require('dotenv').config({ path: '/var/www/.env' });
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    path: '/socket.io/',
    cors: {
        origin: ['https://projectvoid.is-not-a.dev', 'http://projectvoid.is-not-a.dev'],
        methods: ['GET', 'POST']
    }
});
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');

app.use(cors({
    origin: ['https://projectvoid.is-not-a.dev', 'http://projectvoid.is-not-a.dev'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());  // This is important for parsing JSON requests

// Store messages and users (change Map key to username instead of socketId)
const messages = [];
const users = new Map(); // Key: username, Value: {socketId, userData, lastSeen}

// Add at the top with other state variables
let isChatLocked = false;
let isFilterEnabled = true;  // New state variable for AI filter

// Add these constants at the top with your other constants
const MAX_MESSAGE_LENGTH = 500;

// Add this function near the top with your other helper functions
function validateUserData(userData) {
    // Return a sanitized copy of the user data
    return {
        username: userData.username ? sanitizeHtml(userData.username) : 'Guest',
        profileImage: userData.profileImage || 'images/favicon.png',  // Changed from profilePicture to profileImage
        isAdmin: !!userData.isAdmin,  // Convert to boolean
        userId: userData.userId || ''
    };
}

// Add this helper function to call DeepInfra's API
async function aiFilterMessage(text) {
    try {
        const requestBody = {
            input: `You are a content filter. You must respond with ONLY one word: either "ALLOW" or "BLOCK". Do not explain, do not add anything else.

I want you to filter anything talking about or containing these words (case insensitive):
- Joey
- Joey Lentz
- Lentz
- Joseph Lentz
- Joseph
- Lentz Joey


IMPORTANT: If you see ANY of these words in ANY form, you MUST respond with BLOCK. If you don't see these words, respond with ALLOW.

Message to analyze: "${text}"`,
            max_new_tokens: 10,
            temperature: 0.1,
            stream: false
        };

        const response = await fetch('https://api.deepinfra.com/v1/inference/mistralai/Mixtral-8x7B-Instruct-v0.1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('AI filter error:', response.status);
            return true;
        }

        // Clean up response to ensure we only get ALLOW or BLOCK
        let aiResponse = data.results[0].generated_text
            .replace(/^response:\s*/i, '')  // Remove 'RESPONSE:' prefix
            .replace(/^the answer is\s*/i, '')  // Remove 'The answer is' prefix
            .trim()
            .split(/[\s\n]/)[0]  // Take only the first word
            .toUpperCase();
            
        // If response isn't BLOCK, default to ALLOW
        aiResponse = aiResponse === 'BLOCK' ? 'BLOCK' : 'ALLOW';
            
        console.log(`AI Filter: ${text} -> ${aiResponse}`);

        return aiResponse === 'BLOCK';

    } catch (error) {
        console.error('AI Filter Error:', error.message);
        return true;
    }
}

// Simplified filterMessage function
async function filterMessage(text) {
    // Only apply AI filter if enabled
    if (isFilterEnabled) {
        const shouldBlock = await aiFilterMessage(text);
        if (shouldBlock) {
            return '*'.repeat(text.length);
        }
    }
    return text;
}

// Add the initial system message to the messages array when server starts
messages.push({
    content: 'Chat room has started',
    timestamp: new Date().toISOString(),
    system: true
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send existing messages and initial state to new user
    socket.emit('load_messages', messages);
    socket.emit('chat_lock_status', isChatLocked);
    socket.emit('filter_status', isFilterEnabled);
    
    // Handle new messages
    socket.on('send_message', async (data) => {
        // Validate message length
        if (!data.content || data.content.length > MAX_MESSAGE_LENGTH) {
            return;
        }
        
        // Apply filters to the content
        const filteredContent = await filterMessage(data.content);
        
        // Sanitize the filtered content
        const sanitizedContent = sanitizeHtml(filteredContent);
        
        const message = {
            content: sanitizedContent,
            userData: validateUserData(data.userData),
            timestamp: new Date().toISOString()
        };
        messages.push(message);
        
        // Broadcast the message to all clients
        io.emit('new_message', message);
    });

    // Handle user updates with duplicate prevention
    socket.on('user_update', (userData) => {
        if (!userData || !userData.username) return;

        // Remove any existing socket entries for this socket ID
        for (const [existingUsername, user] of users.entries()) {
            if (user.socketId === socket.id) {
                users.delete(existingUsername);
            }
        }

        // Add new user entry
        users.set(socket.id, {
            socketId: socket.id,
            userData: validateUserData(userData),
            lastSeen: Date.now()
        });

        io.emit('users_update', Array.from(users.values()));
    });

    // Handle admin actions
    socket.on('clear_chat', () => {
        // Create system message before clearing
        const systemMessage = {
            content: 'Chat has been cleared by admin',
            timestamp: new Date().toISOString(),
            system: true
        };
        
        // Clear messages but keep the system message
        messages.length = 0;
        messages.push(systemMessage);
        
        // Broadcast both the clear event and the new system message
        io.emit('chat_cleared');
        io.emit('new_message', systemMessage);
    });

    socket.on('delete_message', (timestamp) => {
        const messageIndex = messages.findIndex(m => m.timestamp === timestamp);
        if (messageIndex !== -1) {
            const systemMessage = {
                content: "Message deleted by admin",
                timestamp: messages[messageIndex].timestamp,
                system: true
            };
            messages[messageIndex] = systemMessage;
            // Broadcast to all connected clients
            io.emit('message_deleted', { 
                oldTimestamp: timestamp,
                message: systemMessage 
            });
        }
    });

    // Handle chat lock toggle
    socket.on('toggle_chat_lock', (status) => {
        if (isChatLocked !== status) {  // Only update if status actually changed
            isChatLocked = status;
            
            // Create system message
            const systemMessage = {
                content: status ? 'Chat has been locked by admin' : 'Chat has been unlocked by admin',
                timestamp: new Date().toISOString(),
                system: true
            };
            
            // Add to messages array and broadcast both the message and status
            messages.push(systemMessage);
            io.emit('new_message', systemMessage);  // Send as a new message
            io.emit('chat_lock_status', isChatLocked);  // Update lock status
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        // Remove user by socket ID
        users.delete(socket.id);
        io.emit('users_update', Array.from(users.values()));
        console.log('User disconnected:', socket.id);
    });

    // Inside your io.on('connection') handler
    socket.on('verify_admin', async (credentials) => {
        try {
            const { username, password } = credentials;
            console.log('Admin login attempt:', { username }); // Don't log passwords!
            
            // Check username
            if (username !== process.env.ADMIN_USERNAME) {
                console.log('Username mismatch');
                socket.emit('admin_verified', { success: false });
                return;
            }
            
            // Verify password hash
            const passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
            console.log('Password match:', passwordMatch);
            
            if (!passwordMatch) {
                console.log('Password mismatch');
                socket.emit('admin_verified', { success: false });
                return;
            }
            
            console.log('Admin verified successfully');
            socket.emit('admin_verified', { success: true });
        } catch (error) {
            console.error('Admin verification error:', error);
            socket.emit('admin_verified', { success: false });
        }
    });

    // Inside io.on('connection') handler
    socket.on('toggle_filter', (status) => {
        if (isFilterEnabled !== status) {  // Only update if status changed
            isFilterEnabled = status;
            
            // Create system message
            const systemMessage = {
                content: status ? 'Chat filter has been enabled by admin' : 'Chat filter has been disabled by admin',
                timestamp: new Date().toISOString(),
                system: true
            };
            
            // Add to messages array and broadcast
            messages.push(systemMessage);
            io.emit('new_message', systemMessage);
            io.emit('filter_status', isFilterEnabled);
        }
    });
});

// Clean up inactive users and update more frequently
setInterval(() => {
    const now = Date.now();
    let updated = false;

    for (const [username, user] of users.entries()) {
        if (now - user.lastSeen > 30000) { // 30 seconds
            users.delete(username);
            updated = true;
        }
    }

    if (updated) {
        io.emit('users_update', Array.from(users.values()));
    }
}, 1000); // Check every second

http.listen(3000, () => {
    console.log('Chat server running on port 3000');
}); 