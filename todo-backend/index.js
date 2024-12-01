import express from 'express';
import folderRoutes from './routes/folders.js';
import taskRoutes from './routes/tasks.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.use('/folders', folderRoutes);
app.use('/tasks', taskRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});


