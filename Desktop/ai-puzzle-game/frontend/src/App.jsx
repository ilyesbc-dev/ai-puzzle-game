import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api/client';
import './App.css';

/* ---------------- helpers ---------------- */

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Could not convert the captured image.'));
    reader.onerror = () => reject(new Error('Failed to read the captured image.'));
    reader.readAsDataURL(blob);
  });
}

function toImageSrc(value) {
  if (typeof value !== 'string' || !value) return '';
  if (/^(data:|https?:\/\/|\/|blob:)/.test(value)) return value;
  return `data:image/jpeg;base64,${value}`;
}

function getPieceImage(piece) {
  if (typeof piece === 'string') return toImageSrc(piece);
  if (!piece || typeof piece !== 'object') return '';

  return toImageSrc(
    piece.image ??
      piece.src ??
      piece.data ??
      piece.image_url ??
      piece.data_url ??
      piece.image_base64 ??
      piece.base64
  );
}

// The correct position of a piece, if the backend sends it.
function getCorrectIndex(piece) {
  if (!piece || typeof piece !== 'object') return null;

  const value =
    piece.correct_index ??
    piece.correct_position ??
    piece.original_index ??
    piece.index ??
    piece.id;

  return Number.isInteger(value) ? value : null;
}

function formatTime(total) {
  const seconds = Math.max(0, Math.round(Number(total) || 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Accept both `{ scores: [...] }` and a plain array, and several field names.
function normalizeLeaderboard(result) {
  const list = Array.isArray(result)
    ? result
    : result?.scores ?? result?.leaderboard ?? result?.items ?? [];

  if (!Array.isArray(list)) return [];

  return list
    .map((entry, index) => ({
      key: entry._id ?? entry.id ?? `${entry.nickname}-${index}`,
      nickname: entry.nickname ?? entry.name ?? 'Player',
      difficulty: entry.difficulty ?? '—',
      score: Number(entry.score) || 0,
      time: entry.time_seconds ?? entry.time ?? null,
    }))
    .sort((a, b) => b.score - a.score || (a.time ?? Infinity) - (b.time ?? Infinity));
}

/* ---------------- component ---------------- */

export default function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [screen, setScreen] = useState('welcome');
  const [nickname, setNickname] = useState('');
  const [difficulty, setDifficulty] = useState('easy');

  const [status, setStatus] = useState('Ready to start');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const [puzzle, setPuzzle] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [saved, setSaved] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [health, setHealth] = useState(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }, []);

  /* backend health + cleanup on unmount */
  useEffect(() => {
    let active = true;

    api
      .health()
      .then((result) => active && setHealth(result))
      .catch(() => active && setHealth(null));

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  /* stop camera when leaving the camera screen */
  useEffect(() => {
    if (screen !== 'camera') stopCamera();
  }, [screen, stopCamera]);

  /* plug the stream into <video> once the camera screen is mounted */
  useEffect(() => {
    if (screen === 'camera' && cameraReady && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [screen, cameraReady]);

  /* countdown: only decrements, no side effects inside the updater */
  useEffect(() => {
    if (screen !== 'playing') return undefined;

    const id = setInterval(() => {
      setSecondsLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [screen]);

  /* time is over */
  useEffect(() => {
    if (screen === 'playing' && secondsLeft === 0) {
      setSolved(false);
      setScore(0);
      setScreen('finished');
    }
  }, [screen, secondsLeft]);

  /* puzzle solved? (only checked after the first swap) */
  useEffect(() => {
    if (screen !== 'playing' || moves === 0 || pieces.length === 0) return;

    const ids = pieces.map(getCorrectIndex);
    const complete = ids.every((id, position) => id !== null && id === position);

    if (complete) {
      const base = Number(puzzle?.base_score) || 100;
      // server accepts at most base_score + 500
      setScore(base + Math.min(500, secondsLeft * 5));
      setSolved(true);
      setScreen('finished');
    }
  }, [pieces, moves, screen, puzzle, secondsLeft]);

  /* ---------------- actions ---------------- */

  async function openCamera() {
    setError('');
    setStatus('Opening camera...');
    setCameraReady(false);
    setScreen('camera');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is unavailable. Use localhost or HTTPS.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      setCameraReady(true);
      setStatus('Camera ready. Make sure your upper body is visible.');
    } catch (err) {
      setError(err.message || 'Could not access the camera. Check your browser permissions.');
      setStatus('Camera unavailable');
    }
  }

  async function handleCapture() {
    const video = videoRef.current;
    if (!video || busy) return;

    if (!video.videoWidth || !video.videoHeight) {
      setError('The camera is not ready yet. Please wait.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not capture the camera image.');
      context.drawImage(video, 0, 0);

      const imageBlob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Could not create the camera image.'))),
          'image/jpeg',
          0.9
        );
      });

      setStatus('Analyzing image with YOLO...');
      const result = await api.detect(imageBlob);

      const found = result?.person_found ?? result?.detected ?? result?.has_person ?? false;

      if (!found) {
        const message =
          result?.message ||
          'No person detected. Improve the lighting and move into the camera view.';
        setStatus(message);
        setError(message);
        return;
      }

      setStatus('Person detected! Creating your puzzle...');

      const imageData = await blobToDataURL(imageBlob);
      const puzzleResult = await api.createPuzzle(imageData, difficulty);

      const returnedPieces =
        puzzleResult?.pieces ?? puzzleResult?.tiles ?? puzzleResult?.puzzle_pieces ?? [];

      if (!Array.isArray(returnedPieces) || returnedPieces.length === 0) {
        throw new Error('The backend did not return any puzzle pieces (check backend/puzzle.py).');
      }

      const timeLimit = Number(puzzleResult?.time_limit);

      setPuzzle(puzzleResult);
      setPieces(returnedPieces);
      setSelectedPiece(null);
      setMoves(0);
      setSolved(false);
      setSaved(false);
      setScore(0);
      setSecondsLeft(Number.isFinite(timeLimit) && timeLimit > 0 ? timeLimit : 60);

      stopCamera();
      setStatus('Puzzle ready!');
      setScreen('playing');
    } catch (err) {
      console.error('Capture or detection failed:', err);
      setError(err.message || 'Something went wrong. Check that the backend is running.');
      setStatus('Detection failed');
    } finally {
      setBusy(false);
    }
  }

  function handlePieceClick(index) {
    if (selectedPiece === null) {
      setSelectedPiece(index);
      return;
    }

    if (selectedPiece === index) {
      setSelectedPiece(null);
      return;
    }

    setPieces((previous) => {
      const updated = [...previous];
      [updated[selectedPiece], updated[index]] = [updated[index], updated[selectedPiece]];
      return updated;
    });

    setMoves((count) => count + 1);
    setSelectedPiece(null);
  }

  async function loadLeaderboard() {
    setError('');
    setLoadingBoard(true);
    setScreen('leaderboard');

    try {
      const result = await api.leaderboard(10);
      setLeaderboard(normalizeLeaderboard(result));
    } catch (err) {
      setLeaderboard([]);
      setError(err.message || 'Could not load the leaderboard.');
    } finally {
      setLoadingBoard(false);
    }
  }

  async function saveScore() {
    if (!nickname.trim()) {
      setError('Enter a nickname before saving your score.');
      return;
    }

    if (saved) {
      loadLeaderboard();
      return;
    }

    setError('');
    setBusy(true);

    try {
      const timeLimit = Number(puzzle?.time_limit) || 60;
      const elapsedSeconds = Math.max(0, timeLimit - secondsLeft);

      await api.submitScore(nickname.trim(), difficulty, score, elapsedSeconds);
      setSaved(true);
      await loadLeaderboard();
    } catch (err) {
      setError(err.message || 'Could not save your score.');
    } finally {
      setBusy(false);
    }
  }

  function giveUp() {
    setSolved(false);
    setScore(0);
    setScreen('finished');
  }

  function goHome() {
    stopCamera();
    setError('');
    setStatus('Ready to start');
    setPuzzle(null);
    setPieces([]);
    setSelectedPiece(null);
    setMoves(0);
    setSolved(false);
    setSaved(false);
    setSecondsLeft(60);
    setScore(0);
    setScreen('welcome');
  }

  /* ---------------- render ---------------- */

  const columns = Math.max(1, Math.ceil(Math.sqrt(pieces.length)));
  const me = nickname.trim().toLowerCase();

  return (
    <main className="app">
      <div className="container">
        <header className="header">
          <img className="logo" src="/logo.png" alt="HumanPuzzle logo" />
          <div className="eyebrow">itech project</div>
          <h1 className="title">
            HUMAN<span>PUZZLE</span>
          </h1>
          <p className="tagline">Your camera. AI detection. Your puzzle.</p>
        </header>

        {error && (
          <div role="alert" className="alert">
            {error}
          </div>
        )}

        {/* WELCOME */}
        {screen === 'welcome' && (
          <section className="card">
            <div className="big-emoji">🧩</div>
            <h2>Turn yourself into a puzzle</h2>
            <p className="muted">
              AI detects you, turns you into a puzzle, and challenges you to solve it
              before time runs out!
            </p>

            <div className="field">
              <label htmlFor="nickname">Choose your nickname</label>
              <input
                id="nickname"
                className="input"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Your nickname"
                maxLength={24}
              />
            </div>

            <div className="field">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                className="input"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div style={{ marginTop: 22 }}>
              <button className="btn" onClick={openCamera} disabled={!nickname.trim()}>
                START GAME →
              </button>
            </div>

            <button className="btn btn-secondary" onClick={loadLeaderboard}>
              🏆 Leaderboard
            </button>

            <p className="health">
              <span className={`dot ${health?.status === 'ok' ? 'ok' : ''}`} />
              Backend: {health?.status || 'offline'} · YOLO:{' '}
              {health?.yolo_ready ? 'ready' : 'not ready'}
            </p>
          </section>
        )}

        {/* CAMERA */}
        {screen === 'camera' && (
          <section className="card">
            <h2>PERSON SCANNER</h2>
            <p className="muted">{status}</p>

            <div className="camera-box">
              <video ref={videoRef} autoPlay playsInline muted />
              <div className="camera-frame" />
            </div>

            <p className="muted" style={{ fontSize: 14 }}>
              Keep your face and upper body visible, with enough light.
            </p>

            <button className="btn" onClick={handleCapture} disabled={!cameraReady || busy}>
              {busy ? 'ANALYZING...' : 'CAPTURE & DETECT'}
            </button>
            <button className="btn btn-secondary" onClick={goHome}>
              ← Back
            </button>
          </section>
        )}

        {/* PLAYING */}
        {screen === 'playing' && (
          <section className="card">
            <h2>🧩 SOLVE THE PUZZLE</h2>

            <div className={`timer ${secondsLeft <= 10 ? 'low' : ''}`}>
              {formatTime(secondsLeft)}
            </div>

            <p className="muted">Select two pieces to swap them. Moves: {moves}</p>

            <div
              className="board"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {pieces.map((piece, index) => {
                const image = getPieceImage(piece);

                return (
                  <button
                    key={piece?.id ?? index}
                    className={`piece ${selectedPiece === index ? 'selected' : ''}`}
                    onClick={() => handlePieceClick(index)}
                    aria-label={`Select puzzle piece ${index + 1}`}
                  >
                    {image ? (
                      <img src={image} alt={`Puzzle piece ${index + 1}`} />
                    ) : (
                      <span>Piece {index + 1}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button className="btn btn-secondary" onClick={giveUp}>
              Give up
            </button>
            <button className="btn btn-secondary" onClick={goHome}>
              Quit
            </button>
          </section>
        )}

        {/* FINISHED */}
        {screen === 'finished' && (
          <section className="card">
            <div className="big-emoji">{solved ? '🏆' : '⏱️'}</div>
            <h2>{solved ? 'PUZZLE SOLVED!' : 'GAME OVER'}</h2>
            <p className="muted">Player: {nickname}</p>
            <div className="score">Score: {score}</div>

            <button className="btn" onClick={saveScore} disabled={busy}>
              {saved ? 'VIEW LEADERBOARD' : busy ? 'SAVING...' : 'SAVE SCORE'}
            </button>
            <button className="btn btn-secondary" onClick={goHome}>
              Play again
            </button>
          </section>
        )}

        {/* LEADERBOARD */}
        {screen === 'leaderboard' && (
          <section className="card">
            <h2>🏆 LEADERBOARD</h2>

            {loadingBoard ? (
              <p className="muted">Loading...</p>
            ) : leaderboard.length > 0 ? (
              <div className="board-wrap">
                <table className="lb">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Player</th>
                      <th>Level</th>
                      <th className="num">Time</th>
                      <th className="num">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry.key}
                        className={entry.nickname.toLowerCase() === me ? 'me' : ''}
                      >
                        <td>
                          <span className={`rank ${index < 3 ? `r${index + 1}` : ''}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td>{entry.nickname}</td>
                        <td style={{ textTransform: 'capitalize' }}>{entry.difficulty}</td>
                        <td className="num">
                          {entry.time === null ? '—' : formatTime(entry.time)}
                        </td>
                        <td className="num score-cell">{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">No scores yet. Be the first!</p>
            )}

            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={goHome}>
                Back to home
              </button>
              <button className="btn btn-secondary" onClick={loadLeaderboard} disabled={loadingBoard}>
                ↻ Refresh
              </button>
            </div>
          </section>
        )}

        <footer className="footer">HUMANPUZZLE · itech club</footer>
      </div>
    </main>
  );
}