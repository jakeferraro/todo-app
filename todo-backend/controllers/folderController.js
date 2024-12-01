import db from '../config/db.js';

// Get all folders from the database
export const getFolders = async (req, res) => {
  try {
    const folders = await db('folders').select('*');
    res.json(folders);
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new folder in the database
export const createFolder = async (req, res) => {
  const { name, parent_folder_id } = req.body;
  try {
    const insertedRows = await db('folders').insert({ name, parent_folder_id }).returning('*');
    
    if (insertedRows.length === 0) {
      return res.status(400).json({ error: 'Folder creation failed' });
    }
    
    const { id, name: folderName, parent_folder_id: parentFolderId } = insertedRows[0];
    
    res.status(201).json({
      id,
      name: folderName,
      parent_folder_id: parentFolderId
    });
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update an existing folder
export const updateFolder = async (req, res) => {
  const { id } = req.params;
  const { name, parent_folder_id } = req.body;
  try {
    const [updatedFolder] = await db('folders').where('id', id).update({ name, parent_folder_id }).returning('*');
    res.json(updatedFolder);
  } catch (err) {
    console.error("Error updating folder:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a folder from the database
export const deleteFolder = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await db('folders').where('id', id).del();
    
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ error: err.message });
  }
};
