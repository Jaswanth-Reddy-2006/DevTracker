import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile/settings
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            // Create default profile if it doesn't exist
            const defaultProfile = {
                settings: {
                    language: 'English',
                    notifications: true,
                    privacy: 'Public',
                    autoTrack: true,
                },
                developerScore: 0,
                focusRatio: 0,
                activities: [],
                insights: []
            };
            await db.collection('users').doc(userId).set(defaultProfile);
            return res.json(defaultProfile);
        }
        
        res.json(userDoc.data());
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile/insights
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        await db.collection('users').doc(userId).update(req.body);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update user settings
router.put('/settings', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        await db.collection('users').doc(userId).update({
            settings: req.body
        });
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Increment score
router.post('/score', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { amount } = req.body;
        const userRef = db.collection('users').doc(userId);
        
        await db.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            const newScore = (doc.data().developerScore || 0) + (amount || 0);
            t.update(userRef, { developerScore: newScore });
        });
        
        res.json({ message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ error: 'Failed to update score' });
    }
});

export default router;
