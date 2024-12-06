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

const activeSessions = new Map();
const simulatedSessions = new Map();
let simulationCounter = 0;

const onlineHistory = new Array(40).fill(0);
let lastHistoryUpdate = Date.now();

let isUpdating = false;

const simulatedHeartbeatInterval = setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of simulatedSessions.entries()) {
        if (session.isSimulated) {
            session.lastBeat = now;
            activeSessions.get(sessionId).lastBeat = now;
        }
    }
}, 2000);

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

function cleanupInactiveSessions() {
    const now = Date.now();
    const staleThreshold = 3500; 
    let cleanupCount = 0;

    for (const [sessionId, session] of activeSessions.entries()) {
        if (now - session.lastBeat > staleThreshold) {
            activeSessions.delete(sessionId);
            cleanupCount++;
        }
    }

    return cleanupCount;
}

console.log('Server starting, performing initial history update...');
updateHistoryWithCleanup();

console.log('Setting up 30-second interval...');
const intervalId = setInterval(() => {
    updateHistoryWithCleanup();
}, 30000);

if (intervalId) {
    console.log('Interval successfully set up');
} else {
    console.error('Failed to set up interval');
}

app.post('/api/heartbeat', (req, res) => {
    try {
        const { sessionId, timestamp } = req.body;

        if (!sessionId) {
            console.error('Missing sessionId in heartbeat request');
            return res.status(400).json({ error: 'Session ID required' });
        }

        cleanupInactiveSessions();

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

        res.json({
            onlineUsers: activeSessions.size,
            history: onlineHistory
        });
    } catch (error) {
        console.error('Error in heartbeat endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/offline', (req, res) => {
    const { sessionId } = req.body;

    if (sessionId) {
        const session = activeSessions.get(sessionId);
        if (session && !session.isSimulated) {
            console.log(`User offline: ${sessionId}. Active sessions: ${activeSessions.size - 1}`);
        }
        activeSessions.delete(sessionId);
    }

    res.status(200).send();
});

app.get('/api/test', (req, res) => {
    res.json({ status: 'online' });
});

app.get('/api/history', (req, res) => {
    res.json({
        history: onlineHistory
    });
});

app.post('/api/simulate-users', (req, res) => {
    try {
        const { count } = req.body;
        if (!count) {
            console.error('No count provided in simulation request');
            return res.status(400).json({ success: false, error: 'Count required' });
        }
        
        const startingTotal = activeSessions.size;
        console.log(`Adding ${count} simulated users (Current total: ${startingTotal})`);
        
        for (let i = 0; i < count; i++) {
            const simulatedId = `sim_${simulationCounter++}`;
            simulatedSessions.set(simulatedId, {
                lastBeat: Date.now(),
                failures: 0,
                createdAt: Date.now(),
                isSimulated: true
            });
            activeSessions.set(simulatedId, {
                lastBeat: Date.now(),
                failures: 0,
                createdAt: Date.now(),
                isSimulated: true
            });
        }

        console.log(`Simulation complete: Added ${count} users`);
        console.log(`Real users: ${activeSessions.size - simulatedSessions.size}`);
        console.log(`Simulated users: ${simulatedSessions.size}`);
        console.log(`Total users: ${activeSessions.size}`);

        res.json({ 
            success: true, 
            simulatedCount: simulatedSessions.size,
            totalCount: activeSessions.size 
        });
    } catch (error) {
        console.error('Error in simulate-users endpoint:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/clear-simulated', (req, res) => {
    const beforeCount = activeSessions.size;
    const simulatedCount = simulatedSessions.size;

    console.log(`Clearing ${simulatedCount} simulated users (Current total: ${beforeCount})`);

    for (const [sessionId, session] of activeSessions.entries()) {
        if (session.isSimulated) {
            activeSessions.delete(sessionId);
        }
    }
    simulatedSessions.clear();
    simulationCounter = 0;

    console.log(`Simulation cleared`);
    console.log(`Real users: ${activeSessions.size}`);
    console.log(`Simulated users: 0`);
    console.log(`Total users: ${activeSessions.size}`);

    res.json({ 
        success: true, 
        simulatedCount: 0,
        totalCount: activeSessions.size 
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, cleaning up...');
    clearInterval(intervalId);
    clearInterval(simulatedHeartbeatInterval);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Online tracker running on port ${PORT}`);
});