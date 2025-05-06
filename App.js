import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const getLocalTodos = () => {
  const data = localStorage.getItem("todos");
  return data ? JSON.parse(data) : [];
};

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(getLocalTodos());

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (task.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: task, completed: false },
      ]);
      setTask("");
    }
  };

  const handleToggle = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleEdit = (id, newText) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  return (
    <div className="App">
      <h2>📝 Todo List</h2>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={handleAdd}>Add</button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable draggableId={todo.id} index={index} key={todo.id}>
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className={todo.completed ? "completed" : ""}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo.id)}
                      />
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleEdit(todo.id, e.target.innerText)}
                      >
                        {todo.text}
                      </span>
                      <button onClick={() => handleDelete(todo.id)}>❌</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
