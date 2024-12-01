import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

// Route to get all tasks
router.get('/', getTasks);

// Route to create a new task
router.post('/', createTask);

// Route to update an existing task
router.put('/:id', updateTask);

// Route to delete a task
router.delete('/:id', deleteTask);

export default router;
