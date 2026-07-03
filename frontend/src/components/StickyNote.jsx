import { useState, useRef } from "react"

const COLORS = {
  yellow: { bg: "#FFEAAD", border: "#E0BD3F" },
  pink:   { bg: "#FFD6E7", border: "#FB83DD" },
  blue:   { bg: "#C3ECF6", border: "#7BC9DD" },
  green:  { bg: "#D2FFCE", border: "#80C27A" },
}

// note.tasks may be a JSON string or an array
function parseTasks(tasks) {
  let raw = tasks
  if (typeof raw === "string") {
    try { raw = JSON.parse(raw) } catch { raw = [] }
  }
  return Array.isArray(raw) ? raw : []
}

// For both MouseEvent and TouchEvent
function getPoint(e) {
  if (e.touches && e.touches.length) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  if (e.changedTouches && e.changedTouches.length) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

function StickyNote({ note, onUpdate, onClick, boardRef, onDragOffBoard }) {
  const [isDragging, setIsDragging] = useState(false)
  const [offBoard, setOffBoard] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const didDrag = useRef(false)

  const { bg, border } = COLORS[note.color] || COLORS.yellow
  const safeTasks = parseTasks(note.tasks)

  function isInsideBoard(clientX, clientY) {
    if (!boardRef?.current) return true
    const rect = boardRef.current.getBoundingClientRect()
    return (
      clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom
    )
  }

  // Shared drag-start logic for both mouse and touch (mobile)
  function startDrag(e, { isTouch }) {
    if (e.target.classList.contains("resize-handle")) return
    if (!isTouch) e.preventDefault()
    e.stopPropagation()
    if (!boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const currentPixelX = (note.x / 100) * rect.width
    const currentPixelY = (note.y / 100) * rect.height

    const { x: startX, y: startY } = getPoint(e)
    didDrag.current = false
    dragStart.current = { x: startX - currentPixelX, y: startY - currentPixelY }

    function onMove(e) {
      if (isTouch) e.preventDefault() // stop page scroll while dragging
      const { x, y } = getPoint(e)
      const dx = Math.abs(x - startX)
      const dy = Math.abs(y - startY)
      if (dx > 4 || dy > 4) {
        didDrag.current = true
        setIsDragging(true)
      }

      const targetPixelX = x - dragStart.current.x
      const targetPixelY = y - dragStart.current.y
      onUpdate({ x: targetPixelX, y: targetPixelY })
      setOffBoard(!isInsideBoard(x, y))
    }

    function onEnd(e) {
      setIsDragging(false)
      setOffBoard(false)
      const { x, y } = getPoint(e)

      if (isTouch) {
        window.removeEventListener("touchmove", onMove)
        window.removeEventListener("touchend", onEnd)
      } else {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onEnd)
      }

      if (!isInsideBoard(x, y)) {
        onDragOffBoard()
      }
    }

    if (isTouch) {
      window.addEventListener("touchmove", onMove, { passive: false })
      window.addEventListener("touchend", onEnd)
    } else {
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onEnd)
    }
  }

  function handleMouseDown(e) {
    startDrag(e, { isTouch: false })
  }

  function handleTouchStart(e) {
    startDrag(e, { isTouch: true })
  }

  function handleClick(e) {
    if (didDrag.current) return // ignore clicks that were actually drags
    onClick?.(e)
  }

  
  function handleResizeDown(e) {
    e.stopPropagation()
    e.preventDefault()
    didDrag.current = true
    if (!boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const startW = (note.width / 100) * rect.width
    const startH = (note.height / 100) * rect.height
    const startX = e.clientX
    const startY = e.clientY

    function onMove(e) {
      onUpdate({
        width: startW + e.clientX - startX,
        height: startH + e.clientY - startY,
      })
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  function toggleTask(index, e) {
    e.stopPropagation()
    if (safeTasks[index]) {
      const updated = [...safeTasks]
      updated[index] = { ...updated[index], completed: !updated[index].completed }
      onUpdate({ tasks: updated })
    }
  }

  return (
    <div
      className={`sticky-note ${isDragging ? "dragging" : ""} ${note.deleting ? "deleting" : ""}`}
      style={{
        position: "absolute",
        left: `${note.x}%`,
        top: `${note.y}%`,
        width: `${note.width || 15}%`,
        height: `${note.height || 15}%`,
        backgroundColor: bg,
        border: `4px solid ${border}`,
        touchAction: isDragging ? "none" : "auto",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div className="sticky-title">{note.title || "Untitled"}</div>

      <div className="sticky-tasks">
        {safeTasks.map((task, i) => (
          <div key={i} className={`sticky-task-row ${task?.completed ? "completed" : ""}`}>
            <button
              className={`sticky-checkbox ${task?.completed ? "checked" : ""}`}
              onClick={e => toggleTask(i, e)}
            >
              {task?.completed ? "✓" : ""}
            </button>
            <span className="sticky-task-text">{task?.text || ""}</span>
          </div>
        ))}
      </div>

      {/* Resize handle: desktop only, no touch handler attached */}
      <div className="resize-handle" onMouseDown={handleResizeDown} />

      {offBoard && <div className="note-trash-overlay">🗑️</div>}
    </div>
  )
}

export default StickyNote