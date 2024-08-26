'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

// Dynamically import ReactQuill for rich text editing
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const apiUrl = 'http://localhost:5000/api';

export default function Home(){
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({ title: '', date: '', details: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch todos from the backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  // Handle adding a new todo
  const handleAddClick = () => {
    setIsEditing(true);
    setCurrentTodo({ title: '', date: '', details: '' });
  };

  // Handle saving the current todo
  const handleSave = async () => {
    if (currentTodo.title && currentTodo.date) {
      try {
        const response = await axios.post(`${apiUrl}/todos`, currentTodo);
        setTodos([...todos, response.data]);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving todo:', error);
      }
    }
  };

  // Handle editing an existing todo
  const handleEdit = (index) => {
    setCurrentTodo(todos[index]);
    setIsEditing(true);
  };

  // Handle updating a todo
  const handleUpdate = async () => {
    if (currentTodo.title && currentTodo.date) {
      try {
        const response = await axios.patch(`${apiUrl}/todos/${currentTodo._id}`, currentTodo);
        setTodos(todos.map(todo => (todo._id === response.data._id ? response.data : todo)));
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  // Handle deleting a todo
  const handleDelete = async (index) => {
    const todoToDelete = todos[index];
    try {
      await axios.delete(`${apiUrl}/todos/${todoToDelete._id}`);
      setTodos(todos.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Filter todos based on the search term
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="flex-1 p-5 border-r border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Todo List</h2>
        {/* Container for search input and add new button */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="block w-2/3 p-2 border border-gray-300 rounded text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="ml-2 w-1/3 bg-blue-500 text-white px-4 py-2 rounded-full text-xs"
            onClick={handleAddClick}
          >
            Add New
          </button>
        </div>
        {/* List of filtered todos */}
        <ul>
          {filteredTodos.map((todo, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-200 p-2 flex justify-between items-center text-xs"
            >
              <span onClick={() => handleEdit(index)}>
                {todo.title} - {todo.date}
              </span>
              {/* Button to delete a todo */}
              <button
                className="ml-4 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center"
                onClick={() => handleDelete(index)}
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-5 border-l border-gray-300">
        {isEditing && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
            {/* Input for todo title */}
            <input
              type="text"
              placeholder="Title"
              className="block w-full mb-4 p-2 border border-gray-300 rounded text-xs"
              value={currentTodo.title}
              onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
            />
            {/* Input for todo date */}
            <input
              type="date"
              className="block w-full mb-4 p-2 border border-gray-300 rounded text-xs"
              value={currentTodo.date}
              onChange={(e) => setCurrentTodo({ ...currentTodo, date: e.target.value })}
            />
            {/* Rich text editor for todo details */}
            <ReactQuill
              value={currentTodo.details}
              onChange={(value) => setCurrentTodo({ ...currentTodo, details: value })}
              className="mb-4"
            />
            {/* Button to save or update the todo */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded text-xs"
              onClick={currentTodo._id ? handleUpdate : handleSave}
            >
              {currentTodo._id ? 'Update' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
