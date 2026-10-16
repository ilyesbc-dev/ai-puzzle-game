import './CameraScreen.css';

function CameraScreen({
videoRef,
detectionStatus = 'scanning',
cameraError = '',
isDetecting = false,
onCapture,
onBack,
}) {
const status = cameraError
? {
label: 'CAMERA ERROR',
message: cameraError,
className: 'camera-status-error',
}
: isDetecting
? {
label: 'ANALYZING...',
message: 'YOLO is checking the camera capture.',
className: 'camera-status-scanning',
}
: detectionStatus === 'detected'
? {
label: 'PERSON DETECTED',
message: 'Detection successful. Ready to continue.',
className: 'camera-status-detected',
}
: detectionStatus === 'not-detected'
? {
label: 'NO PERSON DETECTED',
message: 'Make sure you are visible in the camera and try again.',
className: 'camera-status-error',
}
: {
label: 'SCANNING READY',
message: 'Position yourself in the camera view.',
className: 'camera-status-scanning',
};

return ( <main className="camera-screen"> <div className="camera-topbar"> <button className="camera-back" onClick={onBack} type="button">
← Back </button>

```
    <div className="camera-brand">
      <span className="camera-brand-dot" />
      HUMANPUZZLE
    </div>

    <span className="camera-live-label">CAMERA MODULE</span>
  </div>

  <section className="camera-content">
    <div className="camera-heading">
      <p className="camera-eyebrow">STAGE 01 / HUMAN DETECTION</p>
      <h1>Ready to become a puzzle?</h1>
      <p>
        Center yourself in the frame. Our vision system will check for a
        person before the game begins.
      </p>
    </div>

    <div className="camera-layout">
      <div className="camera-view">
        <div className="camera-view-top">
          <span>LIVE FEED</span>
          <span className="camera-rec">
            <span /> LIVE
          </span>
        </div>

        <div className="camera-video-wrap">
          {cameraError ? (
            <div className="camera-placeholder">
              <span className="camera-placeholder-icon">!</span>
              <h2>Camera unavailable</h2>
              <p>Allow camera access in your browser settings, then retry.</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                muted
                playsInline
              />

              <div className="camera-overlay" aria-hidden="true">
                <span className="camera-corner top-left" />
                <span className="camera-corner top-right" />
                <span className="camera-corner bottom-left" />
                <span className="camera-corner bottom-right" />
                <div className="camera-scan-line" />
                <div className="camera-center-marker">
                  <span />
                </div>
              </div>

              <div className="camera-frame-label">ALIGN YOURSELF HERE</div>
            </>
          )}
        </div>

        <div className={`camera-status ${status.className}`}>
          <span className="camera-status-indicator" />
          <div>
            <strong>{status.label}</strong>
            <p>{status.message}</p>
          </div>
        </div>
      </div>

      <aside className="camera-instructions">
        <span className="camera-step-number">01</span>
        <h2>How to play</h2>

        <div className="camera-instruction">
          <span>01</span>
          <div>
            <strong>Face the camera</strong>
            <p>Keep your face and upper body visible.</p>
          </div>
        </div>

        <div className="camera-instruction">
          <span>02</span>
          <div>
            <strong>Run detection</strong>
            <p>YOLO checks the captured image for a person.</p>
          </div>
        </div>

        <div className="camera-instruction">
          <span>03</span>
          <div>
            <strong>Solve your puzzle</strong>
            <p>Your captured image becomes the game challenge.</p>
          </div>
        </div>

        <button
          type="button"
          className="camera-capture-button"
          onClick={onCapture}
          disabled={Boolean(cameraError) || isDetecting || !onCapture}
        >
          {isDetecting ? 'ANALYZING...' : 'CAPTURE & DETECT'}
          <span>→</span>
        </button>

        <p className="camera-privacy-note">
          Your camera is used for this game session.
        </p>
      </aside>
    </div>
  </section>
</main>


);
}

export default CameraScreen;
