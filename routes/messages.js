// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /api/messages
// Fetch all messages sorted by newest first
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ success: true, bookings: messages });
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
});

// POST /api/messages/mark-read
// Mark a message as read
router.post('/mark-read', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ success: false, message: 'Message ID is required' });

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

        message.isRead = true;
        await message.save();

        res.json({ success: true, message: 'Message marked as read' });
    } catch (error) {
        console.error('Failed to mark message as read:', error);
        res.status(500).json({ success: false, message: 'Failed to mark message as read' });
    }
});

// DELETE /api/messages/delete/:id
// Delete a message by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: 'Message ID is required' });

        const message = await Message.findByIdAndDelete(id);
        if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Failed to delete message:', error);
        res.status(500).json({ success: false, message: 'Failed to delete message' });
    }
});

module.exports = router;
