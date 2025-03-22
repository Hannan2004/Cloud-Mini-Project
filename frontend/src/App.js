import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks').then(res => setTasks(res.data));
  };

  const addTask = () => {
    axios.post('http://localhost:5000/tasks', { title, description }).then(() => {
      fetchTasks();
      setTitle('');
      setDescription('');
    });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      fetchTasks();
    });
  };

  const updateTask = () => {
    axios.put(`http://localhost:5000/tasks/${editingTask.id}`, { title, description }).then(() => {
      fetchTasks();
      setTitle('');
      setDescription('');
      setEditingTask(null);
    });
  };

  const startEditing = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingTask(task);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={editingTask ? updateTask : addTask}>
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.description}
            <button onClick={() => startEditing(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;