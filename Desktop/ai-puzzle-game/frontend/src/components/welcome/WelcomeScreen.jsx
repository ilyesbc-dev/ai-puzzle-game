
import './WelcomeScreen.css';

export default function WelcomeScreen({ onStart, onLeaderboard }) {
  return (
    <main className="arcade-home">
      <header className="arcade-header">
        <a className="arcade-logo" href="/">
          <span className="logo-icon">H</span>
          <span>
            HUMAN<span className="logo-accent">PUZZLE</span>
          </span>
        </a>

        <button
          className="leaderboard-button"
          onClick={onLeaderboard}
          type="button"
        >
          <span>🏆</span> LEADERBOARD
        </button>
      </header>

      <section className="arcade-content">
        <div className="arcade-copy">
          <div className="game-status">
            <span className="status-dot" />
            INTERACTIVE DETECTION GAME
          </div>

          <h1>
            HUMAN
            <br />
            <span>VS</span> PUZZLE
          </h1>

          <p className="arcade-description">
            Every human is a puzzle.
            <br />
            Can you solve it?
          </p>

          <div className="arcade-actions">
            <button
              className="start-button"
              onClick={onStart}
              type="button"
            >
              <span className="play-icon">▶</span>
              START GAME
              <span className="button-arrow">↗</span>
            </button>

            <div className="controls-hint">
              <span className="keyboard-key">SPACE</span>
              <span>TO BEGIN</span>
            </div>
          </div>

          <div className="game-stats">
            <div>
              <span className="stat-number">01</span>
              <span className="stat-label">DETECT</span>
            </div>
            <div>
              <span className="stat-number">02</span>
              <span className="stat-label">DECODE</span>
            </div>
            <div>
              <span className="stat-number">03</span>
              <span className="stat-label">SOLVE</span>
            </div>
          </div>
        </div>

        <div className="arcade-visual">
          <div className="visual-topline">
            <span>PUZZLE ARENA</span>
            <span className="live-indicator">
              <span className="status-dot" />
              SYSTEM READY
            </span>
          </div>

          <div className="puzzle-arena">
            <div className="arena-grid" />

            <span className="arena-cross cross-tl">+</span>
            <span className="arena-cross cross-tr">+</span>
            <span className="arena-cross cross-bl">+</span>
            <span className="arena-cross cross-br">+</span>

            <div className="depth-label depth-label-back">
              LAYER 03
            </div>

            <div className="depth-label depth-label-middle">
              LAYER 02
            </div>

            <div className="depth-label depth-label-front">
              LAYER 01
            </div>

            <div className="puzzle-stack">
              <div className="puzzle-layer puzzle-layer-back">
                <div className="puzzle-piece piece-a">?</div>
                <div className="puzzle-piece piece-b">?</div>
                <div className="puzzle-piece piece-c">?</div>
                <div className="puzzle-piece piece-d">?</div>
                <div className="puzzle-piece piece-e">?</div>
                <div className="puzzle-piece piece-f">?</div>
                <div className="puzzle-piece piece-g">?</div>
                <div className="puzzle-piece piece-h">?</div>
                <div className="puzzle-piece piece-i">?</div>
              </div>

              <div className="puzzle-layer puzzle-layer-middle">
                <div className="puzzle-piece piece-a">?</div>
                <div className="puzzle-piece piece-b">?</div>
                <div className="puzzle-piece piece-c">?</div>
                <div className="puzzle-piece piece-d">?</div>
                <div className="puzzle-piece piece-e">?</div>
                <div className="puzzle-piece piece-f">?</div>
                <div className="puzzle-piece piece-g">?</div>
                <div className="puzzle-piece piece-h">?</div>
                <div className="puzzle-piece piece-i">?</div>
              </div>

              <div className="puzzle-layer puzzle-layer-front">
                <div className="puzzle-piece piece-a">?</div>
                <div className="puzzle-piece piece-b">?</div>
                <div className="puzzle-piece piece-c">?</div>
                <div className="puzzle-piece piece-d">?</div>
                <div className="puzzle-piece piece-e">?</div>
                <div className="puzzle-piece piece-f">?</div>
                <div className="puzzle-piece piece-g">?</div>
                <div className="puzzle-piece piece-h">?</div>
                <div className="puzzle-piece piece-i">?</div>
              </div>
            </div>

            <div className="scan-line" />

            <div className="detection-box">
              <span className="detection-corner corner-tl" />
              <span className="detection-corner corner-tr" />
              <span className="detection-corner corner-bl" />
              <span className="detection-corner corner-br" />
              <span className="detection-tag">TARGET DETECTED</span>
            </div>

            <div className="floating-fragment fragment-one">?</div>
            <div className="floating-fragment fragment-two">?</div>
            <div className="floating-fragment fragment-three">?</div>

            <div className="coordinate coordinate-left">
              X: 024.8
              <br />
              Y: 091.2
            </div>

            <div className="coordinate coordinate-right">
              DEPTH
              <br />
              03.42
            </div>
          </div>

          <div className="visual-bottomline">
            <span>OBJECT RECONSTRUCTION</span>
            <span>V.01.0 // HUMAN PUZZLE</span>
          </div>
        </div>
      </section>

      <footer className="arcade-footer">
        <span>THINK DIFFERENT. SOLVE DIFFERENT.</span>
        <span className="footer-center">
          <span className="status-dot" />
          READY FOR PLAYER ONE
        </span>
        <span>© HUMANPUZZLE</span>
      </footer>
    </main>
  );
}

