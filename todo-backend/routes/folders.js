import express from 'express';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../controllers/folderController.js';

const router = express.Router();

// Route to get all folders
router.get('/', getFolders);

// Route to create a new folder
router.post('/', createFolder);

// Route to update an existing task
router.put('/:id', updateFolder);

// Route to delete a task
router.delete('/:id', deleteFolder);

export default router;
