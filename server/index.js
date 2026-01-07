import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';
import signalsRouter from './routes/signals.js';
import groupsRouter from './routes/groups.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/signals', signalsRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
    res.send('DevTracker API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
