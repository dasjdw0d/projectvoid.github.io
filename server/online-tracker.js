require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: ['https://projectvoid.is-not-a.dev', 'http://projectvoid.is-not-a.dev'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Store active sessions with their last heartbeat
const activeSessions = new Map();

// Clean up inactive sessions every second
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, lastBeat] of activeSessions.entries()) {
        if (now - lastBeat > 5000) { // Wait 5 full seconds before considering someone offline
            activeSessions.delete(sessionId);
            console.log(`Session ${sessionId} timed out after 5s. Active sessions: ${activeSessions.size}`);
        }
    }
}, 1000); // Check every second

// Heartbeat endpoint
app.post('/api/heartbeat', (req, res) => {
    const { sessionId, timestamp } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
    }
    
    activeSessions.set(sessionId, timestamp);
    console.log(`Active sessions: ${activeSessions.size}`); // Debug log
    
    res.json({
        onlineUsers: activeSessions.size
    });
});

// Offline notification endpoint
app.post('/api/offline', (req, res) => {
    const { sessionId } = req.body;
    
    if (sessionId) {
        activeSessions.delete(sessionId);
        console.log(`User offline. Active sessions: ${activeSessions.size}`); // Debug log
    }
    
    res.status(200).send();
});

// Add this near your other endpoints
app.get('/api/test', (req, res) => {
    res.json({ status: 'online' });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Online tracker running on port ${PORT}`);
}); 