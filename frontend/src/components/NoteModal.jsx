import { useState } from "react"
import trashIcon from "../assets/Trash.svg"
import calendarIcon from "../assets/Calendar.svg"

function NoteModal({ onClose, onCreate, initialNote }) {
  const [title, setTitle] = useState(initialNote?.title || "")
  const [color, setColor] = useState(initialNote?.color || "yellow")
  const [tasks, setTasks] = useState(() => {
    let t = initialNote?.tasks || []
    if (typeof t === "string") { try { t = JSON.parse(t) } catch { t = [] } }
    return [...t, { text: "", completed: false }]
  })

  const colors = {
    yellow: { bg: "#FFEAAD", border: "#E0BD3F" },
    pink:   { bg: "#FFD6E7", border: "#FB83DD" },
    blue:   { bg: "#C3ECF6", border: "#7BC9DD" },
    green:  { bg: "#D2FFCE", border: "#80C27A" },
  }

  function updateTask(index, text) {
    let updated = [...tasks] //changed to let to allow reassignment
    updated[index].text = text
    if (index === tasks.length - 1 && text.length > 0) {
      updated.push({ text: "", completed: false })
    }
    // If a middle input is emptied, remove from list
    if (text.length === 0 && index !== updated.length - 1 && updated.length > 1) {
      updated = updated.filter((_, i) => i !== index);
    }
    setTasks(updated)
  }

  function toggleTask(index) {
    const updated = [...tasks]
    updated[index] = { ...updated[index], completed: !updated[index].completed }
    setTasks(updated)
  }

  function deleteTask(index) {
    if (tasks.length === 1) {
      setTasks([{ text: "", completed: false }])
      return
    }
    setTasks(tasks.filter((_, i) => i !== index))
  }

  function handleDone() {
    const cleanTasks = tasks.filter(t => t.text.trim().length > 0)
    const hasTitle = title.trim().length > 0
    const hasTasks = cleanTasks.length > 0
    // Always close — only create/update if there's content
    if (hasTitle || hasTasks) {
      onCreate({ title: title.trim(), color, tasks: cleanTasks })
    }
    onClose()
  }

  function handleEnterKey(currentIndex, currentElement) {
  if (tasks[currentIndex].text.trim().length === 0) return;
  // 1. Create a copy of your tasks list
  const updated = [...tasks];

  // 2. Splice a brand new blank task directly below the current line index
  updated.splice(currentIndex + 1, 0, { text: "", completed: false });

  // 3. Save the new array arrangement to React state
  setTasks(updated);

  // 4. Wait 10 milliseconds for React to draw the new element, then snap cursor focus to it
  setTimeout(() => {
    const allTextareas = currentElement.closest('.modal-tasks')?.querySelectorAll('.task-textarea');
    if (allTextareas && allTextareas[currentIndex + 1]) {
      allTextareas[currentIndex + 1].focus();
    }
  }, 10);
}

function hasChangesBeenMade() {
  const originalTitle = initialNote?.title || "";
  if (title.trim() !== originalTitle.trim()) return true;

  // 2. Parse and clean your original tasks array structure
  let originalTasks = initialNote?.tasks || [];
  if (typeof originalTasks === "string") {
    try { originalTasks = JSON.parse(originalTasks); } catch { originalTasks = []; }
  }
  const cleanOriginal = originalTasks.filter(t => t.text.trim().length > 0);

  // 3. Clean and isolate your live current user input tasks
  const cleanCurrent = tasks.filter(t => t.text.trim().length > 0);

  // 4. If the number of tasks changed, edits definitely happened
  if (cleanCurrent.length !== cleanOriginal.length) return true;

  // 5. Compare the exact text content and completion status of each row item
  for (let i = 0; i < cleanCurrent.length; i++) {
    if (cleanCurrent[i].text.trim() !== cleanOriginal[i].text.trim()) return true;
    if (cleanCurrent[i].completed !== cleanOriginal[i].completed) return true;
  }

  // No modifications detected
  return false;
}

function handleBackdropClick() {
  if (hasChangesBeenMade()) {
    const confirmDiscard = window.confirm("You have unsaved changes! Are you sure you want to leave without saving?");
    if (!confirmDiscard) return; 
  }
  
  onClose();
}


  const { bg, border } = colors[color]

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* LEFT — Color */}
        <div className="modal-left">
          <span className="modal-label">COLOR</span>
          <div className="color-grid">
            {Object.entries(colors).map(([name, { bg: bgc, border: bdc }]) => (
              <button
                key={name}
                className={`color-btn ${color === name ? "selected" : ""}`}
                style={{ 
                  backgroundColor: bgc,
                  boxShadow: `inset 0 0 0 3px ${bdc}`,  // inner ring shows border color
                  outline: color === name ? "3px solid #8f6346ff" : "3px solid transparent",
                  outlineOffset: "3px"
                }}
                onClick={() => setColor(name)}
              />
            ))}
          </div>
        </div>

        {/* CENTER — Preview */}
        <div className="modal-center">
          <div className="modal-note-preview" style={{ backgroundColor: bg, borderColor: border }}>
            <input
              className="modal-title-input"
              placeholder="UNTITLED"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="modal-tasks">
              {tasks.map((task, i) => (
                <div key={i} className={`task-row ${task.completed ? "task-completed" : ""}`}>
                  <button
                    className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(i)}
                  >
                    {task.completed ? "✓" : ""}
                  </button>
                  
                  <textarea
                    className="task-textarea"
                    placeholder="click to add a task..."
                    rows={1}
                    value={task.text}
                    onChange={e => {
                      updateTask(i, e.target.value);
                      // Auto-adjusts height to grow downwards dynamically as you type
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onInput={e => {
                      // Keeps height synchronized if content shrinks or expands quickly
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        e.preventDefault();
                        handleEnterKey(i, e.target);
                        
                      }
                    }}
                    style={{ 
                      textDecoration: task.completed ? "line-through" : "none", 
                      opacity: task.completed ? 0.5 : 1
                    }}
                  />

                  {task.text.length > 0 && (
                    <button 
                      className="task-trash" 
                      title="Delete task"
                      onClick={() => deleteTask(i)}
                      >
                        <img src={trashIcon} alt="Delete task" />
                      </button>
                  )}

                  {task.text.trim().length > 0 && !task.completed && (
                    <button
                      className="modal-cal-btn"
                      title="Add task to Google Calendar"
                      onClick={(e) => {
                        e.stopPropagation()
                        const modalTitle = title.trim()
                        const eventTitle = encodeURIComponent(modalTitle ? `${modalTitle}: ${task.text.trim()}` : task.text.trim())
                        const details = encodeURIComponent("Added from your custom Bulletin Board workspace application.")
                        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}`
                        window.open(calendarUrl, '_blank')
                      }}
                    >
                      <img src={calendarIcon} alt="Add to Calendar" />
    
                      {/* DYNAMIC CALENDAR DATE */}
                      <span className="calendar-date-text">
                        {new Date().getDate()}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="modal-done" onClick={handleDone}>
            {initialNote ? "SAVE" : "DONE"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteModal