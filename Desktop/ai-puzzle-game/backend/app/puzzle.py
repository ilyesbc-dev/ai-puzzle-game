"""Puzzle generation from a captured image."""
from __future__ import annotations

import base64
import io
import random
import uuid
from typing import List, Tuple

import cv2
import numpy as np
from PIL import Image


def generate_puzzle(
    image_bgr: np.ndarray,
    grid_size: int,
) -> dict:
    """
    Split image into grid_size x grid_size rectangular tiles,
    shuffle them, and return base64-encoded pieces + solution order.

    Returns:
        {
            "session_id": str,
            "grid_size": int,
            "pieces": [ {"id": int, "image": "data:image/jpeg;base64,..."} ],
            "solution": [int],   # correct order of piece ids (row-major)
            "width": int,
            "height": int,
        }
    """
    h, w = image_bgr.shape[:2]
    # Make dimensions divisible by grid_size
    tile_h = h // grid_size
    tile_w = w // grid_size
    # Crop to exact multiple
    image_bgr = image_bgr[: tile_h * grid_size, : tile_w * grid_size]
    h, w = image_bgr.shape[:2]

    pieces = []
    solution = []
    idx = 0
    for row in range(grid_size):
        for col in range(grid_size):
            y1 = row * tile_h
            x1 = col * tile_w
            tile = image_bgr[y1 : y1 + tile_h, x1 : x1 + tile_w]
            # Encode as JPEG base64
            ok, buf = cv2.imencode(".jpg", tile, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ok:
                raise RuntimeError("Failed to encode puzzle tile")
            b64 = base64.b64encode(buf).decode("ascii")
            pieces.append({
                "id": idx,
                "image": f"data:image/jpeg;base64,{b64}",
            })
            solution.append(idx)
            idx += 1

    # Shuffle pieces (keep solution list as the correct order of ids)
    shuffled = pieces.copy()
    random.shuffle(shuffled)

    session_id = str(uuid.uuid4())

    return {
        "session_id": session_id,
        "grid_size": grid_size,
        "pieces": shuffled,
        "solution": solution,  # [0,1,2,...,n-1] in correct visual order
        "width": tile_w,
        "height": tile_h,
        "full_width": w,
        "full_height": h,
    }


def image_from_base64(b64_str: str) -> np.ndarray:
    """Decode a base64 data-URL or raw base64 string to BGR numpy array."""
    if "," in b64_str:
        b64_str = b64_str.split(",", 1)[1]
    data = base64.b64decode(b64_str)
    arr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def create_demo_image(width: int = 640, height: int = 480) -> np.ndarray:
    """Generate a colorful demo image when webcam is unavailable."""
    img = np.zeros((height, width, 3), dtype=np.uint8)
    # Gradient background
    for y in range(height):
        for x in range(width):
            img[y, x] = [
                int(80 + 100 * (x / width)),
                int(40 + 80 * (y / height)),
                int(160 + 60 * ((x + y) / (width + height))),
            ]
    # Draw some shapes so the puzzle is interesting
    cv2.rectangle(img, (80, 60), (280, 220), (0, 220, 255), -1)
    cv2.circle(img, (420, 160), 90, (255, 100, 50), -1)
    cv2.putText(
        img, "AI PUZZLE", (140, 380),
        cv2.FONT_HERSHEY_SIMPLEX, 2.0, (255, 255, 255), 4
    )
    cv2.putText(
        img, "DEMO MODE", (180, 430),
        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (200, 200, 255), 2
    )
    return img
