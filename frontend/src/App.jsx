import { useState, useEffect } from "react"

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const res = await fetch("http://localhost:3000/todos")
    const data = await res.json()
    setTodos(data)
  }

  async function addTodo() {
    if (!input.trim()) return
    await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input })
    })
    setInput("")
    fetchTodos()
  }

  async function toggleTodo(todo) {
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed })
    })
    fetchTodos()
  }

  async function deleteTodo(id) {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE"
    })
    fetchTodos()
  }

  return (
    <div style={{ maxWidth: "500px", margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>My Todo List</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="Add a new todo..."
          style={{ flex: 1, padding: "8px 12px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={addTodo}
          style={{ padding: "8px 16px", fontSize: "16px", borderRadius: "6px", background: "#4f46e5", color: "white", border: "none", cursor: "pointer" }}
        >
          Add
        </button>
      </div>

      {todos.map(todo => (
        <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", marginBottom: "8px", borderRadius: "8px", background: "#f9f9f9", border: "1px solid #eee" }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span style={{ flex: 1, fontSize: "16px", textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "#999" : "#111" }}>
            {todo.title}
          </span>
          <button
            onClick={() => deleteTodo(todo.id)}
            style={{ background: "none", border: "none", color: "#e00", fontSize: "18px", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      ))}

      {todos.length === 0 && <p style={{ color: "#999" }}>No todos yet. Add one above!</p>}
    </div>
  )
}

export default App