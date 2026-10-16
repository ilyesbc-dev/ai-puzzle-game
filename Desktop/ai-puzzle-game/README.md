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

**Flow:** Welcome → Nickname + Difficulty → Webcam / Demo → YOLO detect → Capture → 3s countdown → Drag-and-drop puzzle → Victory / Timeout → Leaderboard.

Puzzle pieces are **rectangular tiles** (reliable). Interlocking shapes can be a future enhancement.

## Prerequisites (Windows)

- Python 3.10+
- Node.js 18+
- Webcam (optional – Demo Mode available)

## Setup

### 1. Backend

```powershell
cd ai-puzzle-game\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

First run downloads `yolov8n.pt` automatically (~6 MB).

### 2. Frontend

```powershell
cd ai-puzzle-game\frontend
npm install
```

## Run

Open **two terminals**:

**Terminal 1 – Backend**
```powershell
cd ai-puzzle-game\backend
.\venv\Scripts\activate
python run.py
```
API: http://localhost:8000  
Docs: http://localhost:8000/docs

**Terminal 2 – Frontend**
```powershell
cd ai-puzzle-game\frontend
npm run dev
```
Game: http://localhost:5173

## Gameplay

1. Click **START GAME**
2. Enter nickname, pick Easy / Medium / Hard
3. Allow webcam access → **Detect Person** → **Capture & Play**  
   (or click **Demo Mode** if no webcam)
4. After countdown, drag pieces from the tray onto the board
5. Correct placements get a green outline
6. Finish before 60 seconds for a score

Scores are stored in `backend/leaderboard.db`. Captured images are **never** saved to the leaderboard and temp files are cleaned after each round.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | YOLO status |
| POST | `/api/detect` | Person detection (multipart image) |
| POST | `/api/puzzle` | Generate shuffled puzzle |
| GET | `/api/demo-image` | Sample image for demo mode |
| POST | `/api/score` | Submit score |
| GET | `/api/leaderboard` | Top scores |
| DELETE | `/api/cleanup` | Clear temp images |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| YOLO not loading | Check internet on first run; model downloads from GitHub. Place `yolov8n.pt` in `backend/models/` manually if needed. |
| Webcam permission denied | Use Chrome/Edge; allow camera; or use Demo Mode. |
| CORS / network errors | Ensure backend runs on port 8000 and frontend proxy is active (`vite.config.ts`). |
| `npm install` fails | Delete `node_modules` + `package-lock.json`, retry. Use Node 18+. |
| Slow detection | `yolov8n` is the nano model – good for modest PCs. Close other GPU apps. |
| Drag-and-drop not working | Use a mouse; some touch devices need extra polyfills. |

## Notes

- Rectangular tiles only (reliable completion check).
- Score = base (1000/2000/3000) + remaining seconds × 15.
- Compatible with Windows; tested with Python 3.12 + Node 20.
- No paid APIs or cloud services required.
