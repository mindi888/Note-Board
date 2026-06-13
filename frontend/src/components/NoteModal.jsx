import { useState } from "react"

function NoteModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("yellow")
  const [style, setStyle] = useState("plain")
  const [status, setStatus] = useState("empty")

  const colors = {
    yellow: "#FFEAAD",
    pink:   "#FFD6E7",
    blue:   "#C3ECF6",
    green:  "#D2FFCE"
  }

  function handleCreate() {
    onCreate({ title, color, style, status, tasks: [] })
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* LEFT — Color picker */}
        <div className="modal-left">
          <span className="modal-label">COLOR</span>
          <div className="color-grid">
            {Object.entries(colors).map(([name, hex]) => (
              <button
                key={name}
                className={`color-btn ${color === name ? "selected" : ""}`}
                style={{ backgroundColor: hex, borderColor: hex === "#FFEAAD" ? "#E0BD3F" : hex === "#FFD6E7" ? "#FB83DD" : hex === "#C3ECF6" ? "#7BC9DD" : "#80C27A" }}
                onClick={() => setColor(name)}
              />
            ))}
          </div>
        </div>

        {/* CENTER — Note preview */}
        <div className="modal-center">
          <div
            className={`modal-note-preview ${style === "lined" ? "lined" : ""}`}
            style={{ backgroundColor: colors[color] }}
          >
            <input
              className="modal-title-input"
              placeholder="TITLE"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            {style === "lined" && (
              <>
                <div className="preview-task-row">
                  <div className="preview-dot" />
                  <div className="preview-line" />
                </div>
                <div className="preview-task-row">
                  <div className="preview-dot" />
                  <div className="preview-line" />
                </div>
              </>
            )}
          </div>

          {/* Done button */}
          <button className="modal-done" onClick={handleCreate}>DONE</button>
        </div>

        {/* RIGHT — Style + Status */}
        <div className="modal-right">
          <span className="modal-label">STYLE</span>
          <div className="style-row">
            <button
              className={`style-btn ${style === "plain" ? "selected" : ""}`}
              onClick={() => setStyle("plain")}
            >
              <div className="style-circle plain" style={{ backgroundColor: colors[color] }} />
            </button>
            <button
              className={`style-btn ${style === "lined" ? "selected" : ""}`}
              onClick={() => setStyle("lined")}
            >
              <div className="style-circle lined-preview" style={{ backgroundColor: colors[color] }}>
                <div className="mini-line" />
                <div className="mini-line" />
                <div className="mini-line" />
              </div>
            </button>
          </div>

          <span className="modal-label" style={{ marginTop: "32px" }}>STATUS</span>
          <div className="status-row">
            <button
              className={`status-btn ${status === "empty" ? "selected" : ""}`}
              onClick={() => setStatus("empty")}
            >○</button>
            <button
              className={`status-btn ${status === "in-progress" ? "selected" : ""}`}
              onClick={() => setStatus("in-progress")}
            >◎</button>
            <button
              className={`status-btn ${status === "done" ? "selected" : ""}`}
              onClick={() => setStatus("done")}
            >✓</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default NoteModal