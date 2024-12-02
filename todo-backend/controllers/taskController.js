import db from '../config/db.js';

// Get all tasks from the database
export const getTasks = async (req, res) => {
  try {
    const tasks = await db('tasks').select('*');
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new task in the database
export const createTask = async (req, res) => {
  const { name, description, folder_id } = req.body;
  try {
    const insertedRows = await db('tasks')
      .insert({ 
        name, 
        description, 
        folder_id 
      })
      .returning('*');
    
    if (insertedRows.length === 0) {
      return res.status(400).json({ error: 'Task creation failed' });
    }
    
    const { id, name: taskName, description: taskDescription, folder_id: taskFolderId } = insertedRows[0];
    res.status(201).json({
      id,
      name: taskName,
      description: taskDescription,
      folder_id: taskFolderId
    });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update an existing task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, description = null, folder_id } = req.body;
  try {
    const updatedRows = await db('tasks')
      .where('id', id)
      .update({ 
        name, 
        description,
        folder_id 
      })
      .returning('*');

    const { name: taskName, description: taskDescription, folder_id: taskFolderId } = updatedRows[0];
    res.json({
      id,
      name: taskName,
      description: taskDescription,
      folder_id: taskFolderId
    });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a task from the database
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db('tasks').where('id', id).del();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
};
