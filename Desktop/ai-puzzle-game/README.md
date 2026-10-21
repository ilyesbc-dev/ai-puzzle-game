# AI Human Puzzle Challenge

Interactive webcam puzzle game  
YOLOv8 detects a person → capture photo → shuffle into puzzle pieces → solve before the timer ends → climb the leaderboard.

## Architecture

```
ai-puzzle-game/
├── backend/                 # FastAPI + YOLOv8 + SQLite
│   ├── app/
│   │   ├── main.py          # API endpoints
│   │   ├── detector.py      # YOLOv8 person detection (loaded once)
│   │   ├── puzzle.py        # Image → shuffled rectangular tiles
│   │   ├── database.py      # SQLite leaderboard
│   │   └── config.py
│   ├── models/yolov8n.pt
│   ├── requirements.txt
│   └── run.py
└── frontend/                # React + Vite + Tailwind (CDN)
    ├── src/
    │   ├── App.tsx          # Full game UI & drag-and-drop
    │   └── api/client.ts
    └── package.json
```






## Gameplay

1. Click **START GAME**
2. Enter nickname, pick Easy / Medium / Hard
3. Allow webcam access → **Detect Person** → **Capture & Play**  
   (or click **Demo Mode** if no webcam)
4. After countdown, drag pieces from the tray onto the board
5. Correct placements get a green outline
6. Finish before 60 seconds for a score





- Rectangular tiles only (reliable completion check).
- Score = base (1000/2000/3000) + remaining seconds × 15.
- Compatible with Windows; tested with Python 3.12 + Node 20.
- No paid APIs or cloud services required.
