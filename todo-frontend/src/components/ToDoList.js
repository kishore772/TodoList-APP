import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ToDoList.css';

const API_URL = 'http://localhost:8000/todos/';

const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#fffffc'];

const getRandomColor = (index) => colors[index % colors.length];

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', status: 'pending', due_date: '', due_time: '' });
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data.filter(todo => todo.status !== 'completed'));
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  const createTodo = async () => {
    try {
      await axios.post(API_URL, newTodo);
      setNewTodo({ title: '', description: '', status: 'pending', due_date: '', due_time: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo', error);
    }
  };

  const updateTodo = async () => {
    try {
      await axios.put(`${API_URL}${editingTodo.id}`, editingTodo);
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const handleCheckboxChange = async (todo) => {
    try {
      const updatedTodo = { ...todo, status: 'completed' };
      await axios.put(`${API_URL}${todo.id}`, updatedTodo);
      fetchTodos();
    } catch (error) {
      console.error('Error marking todo as completed', error);
    }
  };

  return (
    <div className="ToDoList">
      <div className="ToDoListHeader">
        <img src="https://th.bing.com/th/id/OIP.bf_Um5shxy9Snj8HbRR0ZAAAAA?rs=1&pid=ImgDetMain" alt="ToDo" className="ToDoImage" />
        <h1>ToDo List</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <input
          type="date"
          placeholder="Due Date"
          value={newTodo.due_date}
          onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
        />
        <input
          type="time"
          placeholder="Due Time"
          value={newTodo.due_time}
          onChange={(e) => setNewTodo({ ...newTodo, due_time: e.target.value })}
        />
        <select
          value={newTodo.status}
          onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={createTodo}>Add ToDo</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={todo.id} className="ToDoItem" style={{ backgroundColor: getRandomColor(index) }}>
            <input
              type="checkbox"
              className="ToDoCheckbox"
              onChange={() => handleCheckboxChange(todo)}
              checked={todo.status === 'completed'}
            />
            <div className="ToDoContent">
              <h2>{todo.title}</h2>
              <p>{todo.description}</p>
              {todo.due_date && <p className="ToDoDate">Due Date: {todo.due_date}</p>}
              {todo.due_time && <p className="ToDoTime">Due Time: {todo.due_time}</p>}
              <p>Status: {todo.status}</p>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              <button onClick={() => setEditingTodo(todo)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>

      {editingTodo && (
        <div>
          <h2>Edit ToDo</h2>
          <input
            type="text"
            placeholder="Title"
            value={editingTodo.title}
            onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={editingTodo.description}
            onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
          />
          <input
            type="date"
            placeholder="Due Date"
            value={editingTodo.due_date}
            onChange={(e) => setEditingTodo({ ...editingTodo, due_date: e.target.value })}
          />
          <input
            type="time"
            placeholder="Due Time"
            value={editingTodo.due_time}
            onChange={(e) => setEditingTodo({ ...editingTodo, due_time: e.target.value })}
          />
          <select
            value={editingTodo.status}
            onChange={(e) => setEditingTodo({ ...editingTodo, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={updateTodo}>Update ToDo</button>
          <button onClick={() => setEditingTodo(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ToDoList;
