import './App.css'
import cat from "./assets/cat.svg"
import shelf from "./assets/shelf.svg"
import plant from "./assets/plant.svg"
import pencilHolder from "./assets/pencil-holder.svg"
import noteStack from "./assets/note-stack.svg"

function App() {
  return (
    <div className="app">
      <div className="wall" />
      <div className="bulletin-board" />
      <div className="desk">
        <img src={shelf} className="deco shelf" alt="" />
        <img src={pencilHolder} className="deco pencil-holder" alt="" />
        <img src={plant} className="deco plant" alt="" />
        <img src={cat} className="deco cat" alt="" />
        <img src={noteStack} className="deco note-stack" alt="" />
      </div>
    </div>
  )
}

export default App