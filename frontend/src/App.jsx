import { useState, useEffect } from "react"

import './App.css'
import cat from "./assets/cat.svg"
import shelf from "./assets/shelf.svg"
import plant from "./assets/plant.svg"
import pencilHolder from "./assets/pencil-holder.svg"
import noteStack from "./assets/note-stack.svg"
import NoteModal from "./components/NoteModal"
import StickyNote from "./components/StickyNote.jsx"


function App() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [showModal, setShowModal] = useState(false) 
  const [notes, setNotes] = useState([]) 

  useEffect(() => {
  fetch(API_BASE_URL + "/todos")
    .then(res => res.json())
    .then(data => setNotes(data))
    .catch(err => console.error("Failed to fetch todos:", err))
  }, [])

  // 2. DEFINE THE CREATION LOGIC
  async function handleCreateNote(newNote) {
    try {
      const res = await fetch(API_BASE_URL + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newNote.title || "Untitled",
          color: newNote.color,
          style: newNote.style,
          status: newNote.status,
          tasks: newNote.tasks || [],
          x: 100,
          y: 100,
          width: 160,
          height: 160,
        })
      })
      const saved = await res.json()
      console.log("Saved to DB:", saved)
      setNotes(prev => [...prev, saved])
    } catch (err) {
      console.error("Failed to create note:", err)
    }
  }

  // 3. UPDATE note position/size — saves to database
  async function handleUpdateNote(id, updates) {
    // Update local state immediately so dragging feels instant
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))

    // Then save to database
    try {
      const note = notes.find(n => n.id === id)
      await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, ...updates })
      })
    } catch (err) {
      console.error("Failed to update note:", err)
    }
  }

  // 4. DELETE note
  async function handleDeleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
    try {
      await fetch(`${API_BASE_URL}/todos/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error("Failed to delete note:", err)
    }
  }

  return (
    <div className="app">

      {/* Wall area — sticky notes live here */}
      <div className="wall-area">
        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={(updates) => handleUpdateNote(note.id, updates)}
            onDelete={() => handleDeleteNote(note.id)}
          />
        ))}
      </div>

      <div className="bulletin-board" />

      <div className="desk">
        <img src={shelf} className="deco shelf" alt="" />
        <img src={pencilHolder} className="deco pencil-holder" alt="" />
        <img src={plant} className="deco plant" alt="" />
        <img src={cat} className="deco cat" alt="" />
        <img
          src={noteStack}
          className="deco note-stack"
          alt=""
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <NoteModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateNote}
        />
      )}

    </div>
  )
}

export default App


//   return (
//     <div className="app">
//       <div className="wall" />
//       <div className="bulletin-board" />
//       <div className="desk">
//         <img src={shelf} className="deco shelf" alt="" />
//         <img src={pencilHolder} className="deco pencil-holder" alt="" />
//         <img src={plant} className="deco plant" alt="" />
//         <img src={cat} className="deco cat" alt="" />
//         <img src={noteStack} className="deco note-stack" alt="" onClick={() => setShowModal(true)}/> 
//       </div> 

//       {/* 3. CONDITIONAL RENDERING */}
//       {showModal && (
//         <NoteModal 
//           onClose={() => setShowModal(false)} 
//           onCreate={handleCreateNote} 
//         />
//       )}
//     </div>
//   )
// }

// export default App