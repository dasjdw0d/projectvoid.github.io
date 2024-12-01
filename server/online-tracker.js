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

// Store active sessions with their last heartbeat and failure count
const activeSessions = new Map();

// Add at the top with other variables
const onlineHistory = new Array(40).fill(0);
let lastHistoryUpdate = Date.now();

// 1. Synchronize cleanup and history updates
let isUpdating = false;

async function updateHistoryWithCleanup() {
    if (isUpdating) return;
    
    try {
        isUpdating = true;
        await cleanupInactiveSessions();
        
        const currentUsers = activeSessions.size;
        onlineHistory.shift();
        onlineHistory.push(currentUsers);
        
        lastHistoryUpdate = Date.now();
        console.log('History updated:', [...onlineHistory]);
    } catch (error) {
        console.error('Error in history update:', error);
    } finally {
        isUpdating = false;
    }
}

// 2. More robust session cleanup
function cleanupInactiveSessions() {
    const now = Date.now();
    const staleThreshold = 3500; // 3 seconds
    let cleanupCount = 0;
    
    for (const [sessionId, session] of activeSessions.entries()) {
        if (now - session.lastBeat > staleThreshold) {
            activeSessions.delete(sessionId);
            cleanupCount++;
            console.log(`Session ${sessionId} considered offline due to inactivity`);
        }
    }
    
    return cleanupCount;
}

// Update immediately when server starts
console.log('Server starting, performing initial history update...');
updateHistoryWithCleanup();

// Then start the 30-second interval
console.log('Setting up 30-second interval...');
const intervalId = setInterval(() => {
    console.log('30-second interval triggered');
    updateHistoryWithCleanup();
}, 30000);

// Add error handling for the interval
if (intervalId) {
    console.log('Interval successfully set up');
} else {
    console.error('Failed to set up interval');
}

// Heartbeat endpoint with logging
app.post('/api/heartbeat', (req, res) => {
    try {
        const { sessionId, timestamp } = req.body;
        
        if (!sessionId) {
            console.error('Missing sessionId in heartbeat request');
            return res.status(400).json({ error: 'Session ID required' });
        }
        
        // Clean up stale sessions before processing new heartbeat
        cleanupInactiveSessions();
        
        // Rest of the heartbeat handling
        const existingSession = activeSessions.get(sessionId);
        if (existingSession) {
            existingSession.lastBeat = timestamp;
            existingSession.failures = 0;
            activeSessions.set(sessionId, existingSession);
        } else {
            activeSessions.set(sessionId, {
                lastBeat: timestamp,
                failures: 0,
                createdAt: Date.now()
            });
        }
        
        console.log(`Heartbeat received from ${sessionId}, current sessions: ${activeSessions.size}`);
        
        res.json({
            onlineUsers: activeSessions.size,
            history: onlineHistory
        });
    } catch (error) {
        console.error('Error in heartbeat endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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

// Add a new endpoint to get history
app.get('/api/history', (req, res) => {
    res.json({
        history: onlineHistory
    });
});

// Add cleanup handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, cleaning up...');
    clearInterval(intervalId);
    // Add any other cleanup needed
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Online tracker running on port ${PORT}`);
}); 