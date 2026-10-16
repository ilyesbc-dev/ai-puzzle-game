"""YOLOv8 person detection - model loaded once at startup."""
from __future__ import annotations

import logging
from typing import Optional, Tuple

import cv2
import numpy as np
from ultralytics import YOLO

from .config import YOLO_MODEL_PATH, PERSON_CLASS_ID, MIN_PERSON_CONFIDENCE

logger = logging.getLogger(__name__)


class PersonDetector:
    """Singleton-style YOLO person detector. Load model once."""

    def __init__(self) -> None:
        self.model: Optional[YOLO] = None
        self._loaded = False

    def load(self) -> None:
        """Load YOLOv8 model. Downloads yolov8n.pt automatically if missing."""
        if self._loaded:
            return
        try:
            logger.info("Loading YOLO model from %s ...", YOLO_MODEL_PATH)
            # Ultralytics will download the model if the path doesn't exist yet
            self.model = YOLO(str(YOLO_MODEL_PATH) if YOLO_MODEL_PATH.exists() else "yolov8n.pt")
            # Force a dummy inference to warm up
            dummy = np.zeros((640, 640, 3), dtype=np.uint8)
            self.model(dummy, verbose=False)
            self._loaded = True
            logger.info("YOLO model loaded successfully")
        except Exception as exc:
            logger.exception("Failed to load YOLO model: %s", exc)
            raise RuntimeError(f"Could not load YOLO model: {exc}") from exc

    def detect_person(self, frame: np.ndarray) -> Tuple[bool, Optional[dict], np.ndarray]:
        """
        Detect a person in the frame.

        Returns:
            (found, info_dict, annotated_frame)
            info_dict contains: confidence, bbox [x1,y1,x2,y2]
        """
        if not self._loaded or self.model is None:
            raise RuntimeError("Detector not loaded. Call load() first.")

        results = self.model(frame, verbose=False, classes=[PERSON_CLASS_ID])
        annotated = frame.copy()
        best = None

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                conf = float(box.conf[0])
                if conf < MIN_PERSON_CONFIDENCE:
                    continue
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                # Draw box
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 100), 2)
                label = f"Person {conf:.2f}"
                cv2.putText(
                    annotated, label, (x1, max(y1 - 8, 15)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 100), 2
                )
                if best is None or conf > best["confidence"]:
                    best = {"confidence": conf, "bbox": [x1, y1, x2, y2]}

        found = best is not None
        return found, best, annotated

    def is_ready(self) -> bool:
        return self._loaded


# Global instance – loaded once at app startup
detector = PersonDetector()
