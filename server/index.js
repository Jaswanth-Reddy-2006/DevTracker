import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';
import signalsRouter from './routes/signals.js';
import groupsRouter from './routes/groups.js';
import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import healthRouter from './routes/health.js';
import { register as metricsRegister } from './lib/metrics.js'

dotenv.config();

// Development convenience: allow disabling Firebase auth locally when NODE_ENV != 'production'
if (process.env.NODE_ENV !== 'production' && typeof process.env.DISABLE_AUTH === 'undefined') {
    process.env.DISABLE_AUTH = 'true'
    console.info('[dev] DISABLE_AUTH enabled for local development')
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/signals', signalsRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/health', healthRouter);
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', metricsRegister.contentType)
        res.end(await metricsRegister.metrics())
    } catch (err) {
        res.status(500).end(err.message)
    }
})

app.get('/', (req, res) => {
    res.send('DevTracker API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
