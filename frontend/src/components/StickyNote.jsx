import { useState } from "react"
import emptyNote from "../assets/empty-note.svg" 
import linedNote from "../assets/lined-note.svg" 

function StickyNote({ note, onUpdate }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Condition: Use lined SVG if tasks array has items, otherwise use blank SVG
  const stickyAsset = note.tasks && note.tasks.length > 0 ? linedNote : emptyNote

  // DRAG LOGIC: Mouse down starts tracking positions
  const handleMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) return // Don't drag if pulling corner
    setIsDragging(true)
    setDragStart({ x: e.clientX - note.x, y: e.clientY - note.y })
  }

  // DRAG LOGIC: Moving mouse shifts coordinates on the wall
  const handleMouseMove = (e) => {
    if (!isDragging) return
    onUpdate({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div 
      className="visual-sticky-note"
      style={{
        position: "absolute",
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        // Maps color names to your design HEX codes
        backgroundColor: note.color === "yellow" ? "#FFEAAD" : note.color === "pink" ? "#FFD6E7" : note.color === "blue" ? "#C3ECF6" : "#D2FFCE"
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Figma Graphic Layer */}
      <img src={stickyAsset} className="sticky-base-svg" alt="" draggable="false" />
      
      {/* Title Text Overlap Layer */}
      <div className="sticky-content">
        <h4>{note.title || "Untitled"}</h4>
      </div>

      {/* Invisible Resize Corner Handle */}
      <div 
        className="resize-handle"
        onMouseDown={(e) => {
          e.stopPropagation() // Prevents triggering container drag actions
          const startWidth = note.width
          const startHeight = note.height
          const startX = e.clientX
          const startY = e.clientY

          const MIN_WIDTH = 160
          const MIN_HEIGHT = 160
          const MAX_WIDTH = 400 
          const MAX_HEIGHT = 400

          const doResize = (moveEvent) => {
            onUpdate({
              width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + (moveEvent.clientX - startX))),
              height: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + (moveEvent.clientY - startY)))
            })
          }

          const stopResize = () => {
            window.removeEventListener("mousemove", doResize)
            window.removeEventListener("mouseup", stopResize)
          }

          window.addEventListener("mousemove", doResize)
          window.addEventListener("mouseup", stopResize)
        }}
      />
    </div>
  )
}

export default StickyNote
