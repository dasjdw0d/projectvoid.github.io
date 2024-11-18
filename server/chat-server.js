require('dotenv').config();
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
const rateLimit = require('express-rate-limit');
const loginAttempts = new Map(); // IP -> {attempts: number, lastAttempt: timestamp}
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const session = require('express-session');

app.use(cors({
    origin: ['https://projectvoid.is-not-a.dev', 'http://projectvoid.is-not-a.dev'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());  // This is important for parsing JSON requests
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    }
}));

// Store messages and users (change Map key to username instead of socketId)
const messages = [];
const users = new Map(); // Key: username, Value: {socketId, userData, lastSeen}

// Add at the top with other state variables
let isChatLocked = false;
const serverStartTime = Date.now();

// Add these constants at the top with your other constants
const MAX_MESSAGE_LENGTH = 500;

// Add this function before your socket.io connection handler
function validateUserData(userData) {
    return {
        username: sanitizeHtml(userData.username || 'Guest'),
        profileImage: userData.profileImage || 'images/favicon.png',
        userId: userData.userId || 'anonymous',
        isAdmin: !!userData.isAdmin
    };
}

// Add the initial system message to the messages array when server starts
messages.push({
    content: 'Chat room has started',
    timestamp: new Date().toISOString(),
    system: true
});

// Add rate limiting middleware
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts, please try again later'
});

app.use('/verify-admin', loginLimiter);

// Add this function near the top of your file
function isRateLimited(ip) {
    const now = Date.now();
    const attempt = loginAttempts.get(ip) || { attempts: 0, lastAttempt: 0 };
    
    // Reset attempts if window has passed
    if (now - attempt.lastAttempt > 15 * 60 * 1000) {
        attempt.attempts = 0;
    }
    
    // Update attempt count
    attempt.attempts++;
    attempt.lastAttempt = now;
    loginAttempts.set(ip, attempt);
    
    return attempt.attempts > 5;
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send existing messages and initial state to new user
    socket.emit('load_messages', messages);
    socket.emit('chat_lock_status', isChatLocked);
    
    // Handle new messages
    socket.on('send_message', (data) => {
        // Validate message length
        if (!data.content || data.content.length > MAX_MESSAGE_LENGTH) {
            return;
        }
        
        // Sanitize content
        const sanitizedContent = sanitizeHtml(data.content);
        
        const message = {
            content: sanitizedContent,
            userData: validateUserData(data.userData),
            timestamp: new Date().toISOString()
        };
        messages.push(message);
        
        // Keep only last 100 messages
        if (messages.length > 100) {
            messages.shift();
        }
        
        // Broadcast the message to all clients
        io.emit('new_message', message);
    });

    // Handle user updates with duplicate prevention
    socket.on('user_update', (userData) => {
        if (!userData || !userData.username) return;

        // Remove any existing socket entries for this username
        for (const [existingUsername, user] of users.entries()) {
            if (user.socketId === socket.id || existingUsername === userData.username) {
                users.delete(existingUsername);
            }
        }

        // Add new user entry
        users.set(userData.username, {
            socketId: socket.id,
            userData: userData,
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
            messages[messageIndex] = {
                ...messages[messageIndex],
                deleted: true,
                content: "Deleted by admin"
            };
            io.emit('message_deleted', messages[messageIndex]);
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
        for (const [username, user] of users.entries()) {
            if (user.socketId === socket.id) {
                users.delete(username);
                break;
            }
        }
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