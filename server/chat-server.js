require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
    origin: 'https://projectvoid.is-not-a.dev',
    methods: ['GET', 'POST']
}));

app.use(express.json());

// Store messages and users
const messages = [];
const users = new Map();

// Get messages
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Send message
app.post('/send', (req, res) => {
    const message = {
        content: req.body.content,
        userData: req.body.userData,
        timestamp: new Date().toISOString()
    };
    messages.push(message);
    // Keep only last 100 messages
    if (messages.length > 100) {
        messages.shift();
    }
    res.json({ success: true });
});

// Update user status
app.post('/user', (req, res) => {
    const userData = req.body;
    users.set(userData.userId, {
        username: userData.username,
        profileImage: userData.profileImage,
        userId: userData.userId,
        lastSeen: Date.now()
    });
    res.json({ success: true });
});

// Get online users (only return users seen in the last 30 seconds)
app.get('/users', (req, res) => {
    const now = Date.now();
    const activeUsers = Array.from(users.values())
        .filter(user => (now - user.lastSeen) < 30000) // 30 seconds timeout
        .map(user => ({
            username: user.username,
            profileImage: user.profileImage,
            userId: user.userId
        }));
    res.json(activeUsers);
});

// Clean up inactive users more frequently
setInterval(() => {
    const now = Date.now();
    for (const [userId, userData] of users.entries()) {
        if (now - userData.lastSeen > 30000) { // 30 seconds timeout
            users.delete(userId);
        }
    }
}, 15000); // Check every 15 seconds

// Update the clear endpoint
app.post('/clear', (req, res) => {
    messages.length = 0; // This completely clears the messages array
    res.json({ success: true });
});

// Add these endpoints
app.post('/delete-message', (req, res) => {
    const { timestamp } = req.body;
    const messageIndex = messages.findIndex(m => m.timestamp === timestamp);
    if (messageIndex !== -1) {
        messages[messageIndex] = {
            ...messages[messageIndex],
            deleted: true,
            content: "Deleted by admin"
        };
    }
    res.json({ success: true });
});

// Add this endpoint to securely verify admin credentials
app.post('/verify-admin', (req, res) => {
    const { username, password } = req.body;
    const isValid = 
        username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD;
    
    res.json({ success: isValid });
});

app.listen(3000, () => {
    console.log('Chat server running on port 3000');
}); 