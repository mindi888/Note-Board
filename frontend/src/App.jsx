import { useState } from "react"

import './App.css'
import cat from "./assets/cat.svg"
import shelf from "./assets/shelf.svg"
import plant from "./assets/plant.svg"
import pencilHolder from "./assets/pencil-holder.svg"
import noteStack from "./assets/note-stack.svg"
import NoteModal from "./components/NoteModal"


function App() {
  const [showModal, setShowModal] = useState(false) 
  // State to hold your saved notes list
  const [notes, setNotes] = useState([]) 

  // 2. DEFINE THE CREATION LOGIC
  const handleCreateNote = (newNote) => {
    setNotes([...notes, newNote])
    console.log("New note added:", newNote)
  }


  return (
    <div className="app">
      <div className="wall" />
      <div className="bulletin-board" />
      <div className="desk">
        <img src={shelf} className="deco shelf" alt="" />
        <img src={pencilHolder} className="deco pencil-holder" alt="" />
        <img src={plant} className="deco plant" alt="" />
        <img src={cat} className="deco cat" alt="" />
        <img src={noteStack} className="deco note-stack" alt="" onClick={() => setShowModal(true)}/> 
      </div> 

      {/* 3. CONDITIONAL RENDERING */}
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