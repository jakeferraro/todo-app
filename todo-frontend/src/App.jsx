import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [folders, setFolders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingTask, setEditingTask] = useState(null);  // State for editing tasks
  const [editingFolder, setEditingFolder] = useState(null);  // State for editing folders
  const [editedTaskName, setEditedTaskName] = useState("");  // State for edited task name
  const [editedFolderName, setEditedFolderName] = useState("");  // State for edited folder name
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch folders and tasks from backend
    const fetchData = async () => {
      try {
        const [foldersRes, tasksRes] = await Promise.all([
          axios.get(`${apiUrl}/folders`),
          axios.get(`${apiUrl}/tasks`),
        ]);
        setFolders(foldersRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${apiUrl}/tasks`, {
        name: newTask,
        description: newTaskDescription.trim() || null,
        folder_id: selectedFolder || null,
      });

      setTasks([...tasks, { 
        id: res.data.id, 
        name: res.data.name,
        description: res.data.description,
        folder_id: res.data.folder_id 
      }]);

      setNewTask("");
      setNewTaskDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const addFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await axios.post(`${apiUrl}/folders`, {name: newFolderName });
      setFolders([...folders, res.data]);
      setNewFolderName("");
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  };

  const updateTask = async (taskId, updatedName, updatedDescription) => {
    try {
      const res = await axios.put(`${apiUrl}/tasks/${taskId}`, {
        name: updatedName,
        description: updatedDescription?.trim() || null,
        folder_id: selectedFolder || null,
      });

      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              name: res.data.name,
              description: res.data.description
            } 
          : task
      ));
      // Clear editing state after saving
      setEditingTask(null); // Reset the editing task state
      setEditedTaskName("");
      setEditedTaskDescription("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateFolder = async (folderId, updatedName) => {
    try {
      await axios.put(`${apiUrl}/folders/${folderId}`, {
        name: updatedName,
        parent_folder_id: null, // Add parent_folder_id if needed
      });
      
      setFolders(folders.map(folder => folder.id === folderId ? { ...folder, name: updatedName } : folder));
      // Clear editing state after saving
      setEditingFolder(null); // Reset the editing folder state
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${apiUrl}/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await axios.delete(`${apiUrl}/folders/${folderId}`);
      setFolders(folders.filter((folder) => folder.id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  // Handle editing task
  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditedTaskName(task.name);
    setEditedTaskDescription(task.description || "");
  };

  // Handle editing folder
  const handleEditFolder = (folder) => {
    setEditingFolder(folder.id);
    setEditedFolderName(folder.name);
  };

  return (
    <div>
      <header>
        <h1>To-Do App</h1>
      </header>
      <div className="container">
        <h2>Folders</h2>
        <div>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder"
          />
          <button onClick={addFolder}>Add Folder</button>
        </div>
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>
              {/* Display folder name or input field based on editing state */}
              {editingFolder === folder.id ? (
                <input
                  type="text"
                  value={editedFolderName}
                  onChange={(e) => setEditedFolderName(e.target.value)}
                />
              ) : (
                folder.name
              )}

              {/* Show "Save" button if folder is being edited, else show "Edit" button */}
              {editingFolder === folder.id ? (
                <button onClick={() => updateFolder(folder.id, editedFolderName)}>Save</button>
              ) : (
                <button onClick={() => handleEditFolder(folder)}>Edit</button>
              )}

              {/* Folder Select Button */}
              {editingFolder !== folder.id && (
                <button onClick={() => setSelectedFolder(folder.id)}>Select</button>
              )}

              {/*Delete Button*/}
              <button onClick={() => deleteFolder(folder.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h2>Tasks</h2>
        {/* Show All Tasks Button*/}
        <button onClick={() => setSelectedFolder(null)}>Show All Tasks</button>

        <ul>
          {tasks
            .filter((task) => (selectedFolder ? task.folder_id === selectedFolder : true))
            .map((task) => (
              <li key={task.id}>
                {/* Display task name or input field based on editing state */}
                {editingTask === task.id ? (
                  <div className="task-edit-form">
                    <input
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                    />
                    <textarea
                      value={editedTaskDescription}
                      onChange={(e) => setEditedTaskDescription(e.target.value)}
                      placeholder="Task description (optional)"
                    />
                    <button onClick={() => updateTask(task.id, editedTaskName, editedTaskDescription)}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="task-display">
                    <div className="task-name">{task.name}</div>
                    {task.description && (
                      <div className="task-description">{task.description}</div>
                    )}
                    <button onClick={() => handleEditTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
        </ul>

        <div className="task-input-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task description (optional)"
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

export default App;
