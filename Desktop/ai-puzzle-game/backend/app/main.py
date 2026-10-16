"""FastAPI backend for AI Human Puzzle Game."""
from __future__ import annotations

import base64
import logging
import shutil
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from .config import (
    DIFFICULTIES,
    TEMP_DIR,
    CAPTURE_WIDTH,
    CAPTURE_HEIGHT,
)
from .database import init_db, add_score, get_top_scores
from .detector import detector
from .puzzle import generate_puzzle, image_from_base64, create_demo_image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan – load model once
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AI Puzzle Game backend...")
    await init_db()
    try:
        detector.load()
        logger.info("YOLO detector ready")
    except Exception as exc:
        logger.error("YOLO failed to load: %s – demo mode will still work", exc)
    yield
    # Cleanup temp files on shutdown
    if TEMP_DIR.exists():
        for f in TEMP_DIR.iterdir():
            try:
                f.unlink()
            except Exception:
                pass
    logger.info("Shutdown complete")


app = FastAPI(
    title="AI Human Puzzle Game",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Event / local use
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class DetectResponse(BaseModel):
    person_found: bool
    confidence: Optional[float] = None
    message: str
    annotated_image: Optional[str] = None  # base64 data URL


class PuzzleRequest(BaseModel):
    image: str = Field(..., description="Base64 data URL of the captured image")
    difficulty: str = Field("easy", description="easy | medium | hard")


class ScoreSubmit(BaseModel):
    nickname: str = Field(..., min_length=1, max_length=32)
    difficulty: str
    score: int = Field(..., ge=0)
    time_seconds: float = Field(..., ge=0)


class HealthResponse(BaseModel):
    status: str
    yolo_ready: bool
    message: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def encode_image_b64(img_bgr: np.ndarray, quality: int = 85) -> str:
    ok, buf = cv2.imencode(".jpg", img_bgr, [cv2.IMWRITE_JPEG_QUALITY, quality])
    if not ok:
        raise RuntimeError("JPEG encode failed")
    return "data:image/jpeg;base64," + base64.b64encode(buf).decode("ascii")


def validate_difficulty(diff: str) -> dict:
    key = diff.lower().strip()
    if key not in DIFFICULTIES:
        raise HTTPException(400, f"Invalid difficulty. Choose: {list(DIFFICULTIES.keys())}")
    return DIFFICULTIES[key]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health", response_model=HealthResponse)
async def health():
    ready = detector.is_ready()
    return HealthResponse(
        status="ok",
        yolo_ready=ready,
        message="YOLO ready" if ready else "YOLO not loaded – demo mode available",
    )


@app.post("/api/detect", response_model=DetectResponse)
async def detect_person(file: UploadFile = File(...)):
    """Accept a single webcam frame, run person detection, return result + annotated image."""
    if not detector.is_ready():
        raise HTTPException(503, "YOLO model not loaded. Use demo mode.")

    try:
        data = await file.read()
        arr = np.frombuffer(data, dtype=np.uint8)
        frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if frame is None:
            raise HTTPException(400, "Could not decode image")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(400, f"Invalid image: {exc}") from exc

    # Resize for consistent processing
    frame = cv2.resize(frame, (CAPTURE_WIDTH, CAPTURE_HEIGHT))

    try:
        found, info, annotated = detector.detect_person(frame)
    except Exception as exc:
        logger.exception("Detection failed")
        raise HTTPException(500, f"Detection error: {exc}") from exc

    annotated_b64 = encode_image_b64(annotated)

    if found:
        return DetectResponse(
            person_found=True,
            confidence=info["confidence"],
            message=f"Person detected (confidence {info['confidence']:.0%})",
            annotated_image=annotated_b64,
        )
    return DetectResponse(
        person_found=False,
        confidence=None,
        message="No person detected. Please stand in front of the camera.",
        annotated_image=annotated_b64,
    )


@app.post("/api/puzzle")
async def create_puzzle(body: PuzzleRequest):
    """Generate shuffled puzzle pieces from a captured image."""
    cfg = validate_difficulty(body.difficulty)

    try:
        img = image_from_base64(body.image)
    except Exception as exc:
        raise HTTPException(400, f"Invalid image data: {exc}") from exc

    # Resize to a reasonable working size
    img = cv2.resize(img, (CAPTURE_WIDTH, CAPTURE_HEIGHT))

    try:
        puzzle = generate_puzzle(img, cfg["grid"])
    except Exception as exc:
        logger.exception("Puzzle generation failed")
        raise HTTPException(500, f"Puzzle generation error: {exc}") from exc

    # Attach game metadata
    puzzle["difficulty"] = body.difficulty
    puzzle["time_limit"] = cfg["time_limit"]
    puzzle["base_score"] = cfg["base_score"]
    return puzzle


@app.get("/api/demo-image")
async def demo_image():
    """Return a demo image when webcam is unavailable."""
    img = create_demo_image(CAPTURE_WIDTH, CAPTURE_HEIGHT)
    return {"image": encode_image_b64(img)}


@app.post("/api/score")
async def submit_score(body: ScoreSubmit):
    """Save a validated score to the leaderboard."""
    validate_difficulty(body.difficulty)
    nickname = body.nickname.strip()
    if not nickname:
        raise HTTPException(400, "Nickname required")

    # Simple server-side sanity check
    max_possible = DIFFICULTIES[body.difficulty.lower()]["base_score"] + 500
    if body.score > max_possible:
        raise HTTPException(400, "Score out of realistic range")

    try:
        row_id = await add_score(nickname, body.difficulty.lower(), body.score, body.time_seconds)
    except Exception as exc:
        logger.exception("Failed to save score")
        raise HTTPException(500, f"Database error: {exc}") from exc

    return {"ok": True, "id": row_id}


@app.get("/api/leaderboard")
async def leaderboard(limit: int = 5):
    """Return top scores."""
    limit = max(1, min(limit, 20))
    try:
        scores = await get_top_scores(limit)
    except Exception as exc:
        logger.exception("Leaderboard read failed")
        raise HTTPException(500, f"Database error: {exc}") from exc
    return {"scores": scores}


@app.delete("/api/cleanup")
async def cleanup_temp():
    """Delete temporary captured images (called after each round)."""
    removed = 0
    if TEMP_DIR.exists():
        for f in TEMP_DIR.iterdir():
            try:
                f.unlink()
                removed += 1
            except Exception:
                pass
    return {"removed": removed}
