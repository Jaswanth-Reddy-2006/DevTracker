import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';
import devStore from '../lib/devStore.js'

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        if (process.env.DISABLE_AUTH === 'true') {
            const tasks = await devStore.getTasks(userId)
            return res.json(tasks)
        }
        const tasksSnapshot = await db.collection('tasks').where('userId', '==', userId).get();
        const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Add a new task
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const taskData = { ...req.body, userId, createdAt: Date.now() };
        if (process.env.DISABLE_AUTH === 'true') {
            const created = await devStore.addTask(userId, taskData)
            return res.status(201).json(created)
        }
        const docRef = await db.collection('tasks').add(taskData);
        res.status(201).json({ id: docRef.id, ...taskData });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const taskId = req.params.id;
        if (process.env.DISABLE_AUTH === 'true') {
            try {
                const updated = await devStore.updateTask(userId, taskId, req.body)
                return res.json({ message: 'Task updated successfully', task: updated })
            } catch (err) {
                return res.status(404).json({ error: 'Task not found' })
            }
        }
        const taskRef = db.collection('tasks').doc(taskId);
        const doc = await taskRef.get();

        if (!doc.exists || doc.data().userId !== userId) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const taskData = doc.data();
        const wasVerified = taskData.isVerified;
        const isNowVerified = req.body.isVerified;

        await taskRef.update(req.body);

        // If task just got verified, increment user score
        if (!wasVerified && isNowVerified) {
            const points = taskData.difficulty === 'Hard' ? 200 : taskData.difficulty === 'Medium' ? 100 : 50;
            const userRef = db.collection('users').doc(userId);
            
            await db.runTransaction(async (t) => {
                const userDoc = await t.get(userRef);
                if (userDoc.exists) {
                    const newScore = (userDoc.data().developerScore || 0) + points;
                    t.update(userRef, { developerScore: newScore });
                } else {
                    t.set(userRef, { 
                        developerScore: points,
                        settings: {
                            language: 'English',
                            notifications: true,
                            privacy: 'Public',
                            autoTrack: true,
                        }
                    });
                }
            });
        }

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Add daily progress
router.post('/:id/progress', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const taskId = req.params.id;
        const { progress } = req.body;
        if (process.env.DISABLE_AUTH === 'true') {
            try {
                const updated = await devStore.updateTask(userId, taskId, { progress })
                const newEntry = { date: new Date().toISOString().split('T')[0], value: progress, timestamp: Date.now() }
                return res.json({ message: 'Progress added successfully', entry: newEntry, task: updated })
            } catch (err) {
                return res.status(404).json({ error: 'Task not found' })
            }
        }
        const taskRef = db.collection('tasks').doc(taskId);
        const doc = await taskRef.get();

        if (!doc.exists || doc.data().userId !== userId) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const taskData = doc.data();
        const dailyProgress = taskData.dailyProgress || [];
        
        // Add new progress entry
        const newEntry = {
            date: new Date().toISOString().split('T')[0],
            value: progress,
            timestamp: Date.now()
        };

        await taskRef.update({
            dailyProgress: [...dailyProgress, newEntry],
            progress: progress // Update current progress too
        });

        res.json({ message: 'Progress added successfully', entry: newEntry });
    } catch (error) {
        console.error('Error adding progress:', error);
        res.status(500).json({ error: 'Failed to add progress' });
    }
});

// Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const taskId = req.params.id;
        if (process.env.DISABLE_AUTH === 'true') {
            try {
                await devStore.deleteTask(userId, taskId)
                return res.json({ message: 'Task deleted successfully' })
            } catch (err) {
                return res.status(404).json({ error: 'Task not found' })
            }
        }
        const taskRef = db.collection('tasks').doc(taskId);
        const doc = await taskRef.get();

        if (!doc.exists || doc.data().userId !== userId) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await taskRef.delete();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

export default router;
