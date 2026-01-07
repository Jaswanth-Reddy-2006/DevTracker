import express from 'express';
import { db, admin } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all groups
router.get('/', verifyToken, async (req, res) => {
    try {
        const groupsSnapshot = await db.collection('groups').get();
        const groups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// Create a group
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupData = { 
            ...req.body, 
            hostId: userId, 
            members: [{ id: userId, role: 'host' }],
            pendingMembers: [],
            createdAt: Date.now() 
        };
        const docRef = await db.collection('groups').add(groupData);
        res.status(201).json({ id: docRef.id, ...groupData });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// Join a group (simplified)
router.post('/:id/join', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        if (groupData.members.some(m => m.id === userId)) {
            return res.status(400).json({ error: 'Already a member' });
        }

        if (groupData.approvalRequired) {
            await groupRef.update({
                pendingMembers: admin.firestore.FieldValue.arrayUnion({ id: userId, name: req.user.name || req.user.email.split('@')[0] })
            });
            res.json({ message: 'Join request sent' });
        } else {
            await groupRef.update({
                members: admin.firestore.FieldValue.arrayUnion({ id: userId, role: 'member' })
            });
            res.json({ message: 'Joined successfully' });
        }
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ error: 'Failed to join group' });
    }
});

// Exit a group
router.post('/:id/exit', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        const updatedMembers = groupData.members.filter(m => m.id !== userId);

        await groupRef.update({ members: updatedMembers });
        res.json({ message: 'Exited successfully' });
    } catch (error) {
        console.error('Error exiting group:', error);
        res.status(500).json({ error: 'Failed to exit group' });
    }
});

// Add a group task
router.post('/:id/tasks', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (doc.data().hostId !== userId) {
            return res.status(403).json({ error: 'Only hosts can add tasks' });
        }

        const newTask = { ...req.body, id: 'gt_' + Date.now(), createdAt: Date.now() };
        await groupRef.update({
            tasks: admin.firestore.FieldValue.arrayUnion(newTask)
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding group task:', error);
        res.status(500).json({ error: 'Failed to add group task' });
    }
});

// Update a group task
router.put('/:id/tasks/:taskId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id: groupId, taskId } = req.params;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        if (groupData.hostId !== userId) {
            return res.status(403).json({ error: 'Only hosts can update tasks' });
        }

        const updatedTasks = groupData.tasks.map(task => 
            task.id === taskId ? { ...task, ...req.body } : task
        );

        await groupRef.update({ tasks: updatedTasks });
        res.json({ message: 'Group task updated successfully' });
    } catch (error) {
        console.error('Error updating group task:', error);
        res.status(500).json({ error: 'Failed to update group task' });
    }
});

// Approve a member
router.post('/:id/approve', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const { memberId } = req.body;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        if (groupData.hostId !== userId) {
            return res.status(403).json({ error: 'Only hosts can approve members' });
        }

        const pendingMember = groupData.pendingMembers.find(m => m.id === memberId);
        if (!pendingMember) {
            return res.status(400).json({ error: 'Member not found in pending list' });
        }

        await groupRef.update({
            pendingMembers: admin.firestore.FieldValue.arrayRemove(pendingMember),
            members: admin.firestore.FieldValue.arrayUnion({ id: pendingMember.id, role: 'member' })
        });

        res.json({ message: 'Member approved successfully' });
    } catch (error) {
        console.error('Error approving member:', error);
        res.status(500).json({ error: 'Failed to approve member' });
    }
});

// Reject a member
router.post('/:id/reject', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const { memberId } = req.body;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        if (groupData.hostId !== userId) {
            return res.status(403).json({ error: 'Only hosts can reject members' });
        }

        const pendingMember = groupData.pendingMembers.find(m => m.id === memberId);
        if (!pendingMember) {
            return res.status(400).json({ error: 'Member not found in pending list' });
        }

        await groupRef.update({
            pendingMembers: admin.firestore.FieldValue.arrayRemove(pendingMember)
        });

        res.json({ message: 'Member rejected successfully' });
    } catch (error) {
        console.error('Error rejecting member:', error);
        res.status(500).json({ error: 'Failed to reject member' });
    }
});

// Remove a member
router.post('/:id/remove', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const { memberId } = req.body;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        if (groupData.hostId !== userId) {
            return res.status(403).json({ error: 'Only hosts can remove members' });
        }

        const updatedMembers = groupData.members.filter(m => m.id !== memberId);
        await groupRef.update({ members: updatedMembers });

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// Send a group message
router.post('/:id/messages', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const groupId = req.params.id;
        const { text } = req.body;
        const groupRef = db.collection('groups').doc(groupId);
        const doc = await groupRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupData = doc.data();
        if (!groupData.members.some(m => m.id === userId)) {
            return res.status(403).json({ error: 'Must be a member to send messages' });
        }

        const newMessage = {
            id: 'msg_' + Date.now(),
            senderId: userId,
            senderName: req.user.name || req.user.email.split('@')[0],
            text,
            timestamp: Date.now()
        };

        await groupRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(newMessage)
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
