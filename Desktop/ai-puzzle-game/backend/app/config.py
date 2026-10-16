from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
STATIC_DIR = BASE_DIR / "static"
TEMP_DIR = BASE_DIR / "temp"
DB_PATH = BASE_DIR / "leaderboard.db"

# YOLO
YOLO_MODEL_NAME = "yolov8n.pt"
YOLO_MODEL_PATH = MODELS_DIR / YOLO_MODEL_NAME
PERSON_CLASS_ID = 0  # COCO class for person

# Game settings
DIFFICULTIES = {
    "easy": {"grid": 3, "time_limit": 60, "base_score": 1000},
    "medium": {"grid": 4, "time_limit": 60, "base_score": 2000},
    "hard": {"grid": 5, "time_limit": 60, "base_score": 3000},
}

# Capture settings
CAPTURE_WIDTH = 640
CAPTURE_HEIGHT = 480
MIN_PERSON_CONFIDENCE = 0.5

# Ensure directories exist
TEMP_DIR.mkdir(exist_ok=True)
STATIC_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)
