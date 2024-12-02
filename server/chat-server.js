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
const fs = require('fs');
const path = require('path');

app.use(cors({
    origin: ['https://projectvoid.is-not-a.dev', 'http://projectvoid.is-not-a.dev'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());  // This is important for parsing JSON requests

// Add these constants at the top
const MESSAGES_FILE = path.join(__dirname, 'chat_messages.json');

// Function to load messages from file
function loadMessages() {
    try {
        if (fs.existsSync(MESSAGES_FILE)) {
            const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
    return [];
}

// Function to save messages to file
function saveMessages() {
    try {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages), 'utf8');
    } catch (error) {
        console.error('Error saving messages:', error);
    }
}

// Initialize messages from file
const messages = [];  // Just use an in-memory array

// Store messages and users (change Map key to userId instead of socketId)
const users = new Map(); // Key: userId, Value: {socketIds: Set, userData, lastSeen}

// Add at the top with other state variables
let isChatLocked = false;

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

// Add this function to check for valid characters
function containsInvalidCharacters(text) {
    // Only allow: letters, numbers, basic punctuation, and common symbols
    const validPattern = /^[a-zA-Z0-9\s.,!?'"()\-_@#$%&*+= ]+$/;
    return !validPattern.test(text);
}

// Enhanced sensitive info filter
function containsSensitiveInfo(text) {
    // First, normalize the text more aggressively
    const normalizedText = text
        .toLowerCase()
        // Replace common number/letter substitutions
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        .replace(/\$/g, 's')
        .replace(/@/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y')
        // Remove all non-alphanumeric characters
        .replace(/[^a-z0-9]/g, '');
    
    // Also create a reversed version to catch reversed text
    const reversedText = normalizedText.split('').reverse().join('');
    
    // Define sensitive patterns (using normalized text)
    const sensitivePatterns = [
        // Specific name patterns
        /\bjo[es]y?\b/i,         // Matches joey, joe, jos
        /\bjoseph\b/i,           // Matches joseph
        /\blentz\b/i,            // Matches lentz exactly
        
        // Address patterns (more specific)
        /\b5[o0]5\b/i,          // Specifically match "505" with variations
        /str.*flow/i,           // Match any combination of str and flow
        /flow.*str/i,           // Match any combination in reverse
        /\bstar\s*flow/i,       // Matches star flow
        /\bflow[e3]r/i,         // Matches flower variations
        
        // Combined patterns (more specific)
        /\bjo[es]y?\s*lentz\b/i, // Matches joey/joe lentz
        /\blentz\s*jo[es]y?\b/i  // Matches lentz joey/joe
    ];

    // Check both original, normalized, and reversed text
    return sensitivePatterns.some(pattern => 
        pattern.test(normalizedText) || 
        pattern.test(reversedText) ||
        pattern.test(text)
    );
}

// Clear existing messages and add initial system message ONLY when server starts
function initializeChat() {
    // Clear all messages when server starts
    messages.length = 0;
    
    // Add initial system message
    const systemMessage = {
        content: 'Chat room has started',
        timestamp: new Date().toISOString(),
        system: true
    };
    messages.push(systemMessage);
    saveMessages();
    
    // Broadcast to all connected clients
    if (io) {
        io.emit('chat_reset', {
            message: systemMessage
        });
    }
}

// Call initialization when server starts
initializeChat();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send existing messages to newly connected client
    socket.emit('load_messages', messages);
    socket.emit('chat_lock_status', isChatLocked);

    // Handle new messages
    socket.on('send_message', async (data) => {
        if (!data.content || data.content.length > MAX_MESSAGE_LENGTH) {
            return;
        }
        
        // Check for invalid characters
        if (containsInvalidCharacters(data.content)) {
            const systemMessage = {
                content: 'Message blocked: Contains invalid characters',
                timestamp: new Date().toISOString(),
                system: true
            };
            messages.push(systemMessage);
            io.emit('new_message', systemMessage);
            return;
        }
        
        // Check for sensitive information
        if (containsSensitiveInfo(data.content)) {
            const systemMessage = {
                content: 'Message blocked: Contains filtered content',
                timestamp: new Date().toISOString(),
                system: true
            };
            messages.push(systemMessage);
            io.emit('new_message', systemMessage);
            return;
        }
        
        // Continue with existing message processing
        const sanitizedContent = sanitizeHtml(data.content);
        
        const message = {
            content: sanitizedContent,
            userData: validateUserData(data.userData),
            timestamp: new Date().toISOString()
        };
        messages.push(message);
        
        io.emit('new_message', message);
    });

    // Rest of your socket event handlers...
    socket.on('user_update', (userData) => {
        if (!userData || !userData.userId) return;

        const validatedData = validateUserData(userData);
        const userId = validatedData.userId;

        // Get or create user entry
        let userEntry = users.get(userId);
        if (userEntry) {
            // Update existing user
            userEntry.socketIds.add(socket.id);
            userEntry.userData = validatedData;
            userEntry.lastSeen = Date.now();
        } else {
            // Create new user entry
            userEntry = {
                socketIds: new Set([socket.id]),
                userData: validatedData,
                lastSeen: Date.now()
            };
            users.set(userId, userEntry);
        }

        // Emit unique users list
        const uniqueUsers = Array.from(users.values()).map(user => ({
            userData: user.userData
        }));
        io.emit('users_update', uniqueUsers);
    });

    socket.on('clear_chat', () => {
        const systemMessage = {
            content: 'Chat has been cleared by admin',
            timestamp: new Date().toISOString(),
            system: true
        };
        
        messages.length = 0;
        messages.push(systemMessage);
        
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
            
            io.emit('message_deleted', { 
                oldTimestamp: timestamp,
                message: systemMessage 
            });
        }
    });

    // Handle chat lock toggle
    socket.on('toggle_chat_lock', (status) => {
        if (isChatLocked !== status) {
            isChatLocked = status;
            
            const systemMessage = {
                content: status ? 'Chat has been locked by admin' : 'Chat has been unlocked by admin',
                timestamp: new Date().toISOString(),
                system: true
            };
            
            messages.push(systemMessage);
            io.emit('new_message', systemMessage);
            io.emit('chat_lock_status', isChatLocked);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        // Find and update the user that owns this socket
        for (const [userId, user] of users.entries()) {
            if (user.socketIds.has(socket.id)) {
                user.socketIds.delete(socket.id);
                // Remove user only if they have no active connections
                if (user.socketIds.size === 0) {
                    users.delete(userId);
                }
                break;
            }
        }

        // Emit updated users list
        const uniqueUsers = Array.from(users.values()).map(user => ({
            userData: user.userData
        }));
        io.emit('users_update', uniqueUsers);
        console.log('User disconnected:', socket.id);
    });

    // Inside your io.on('connection') handler
    socket.on('verify_admin', async (credentials) => {
        try {
            const { username, password } = credentials;
            console.log('Admin login attempt received'); // Don't log credentials
            
            // Check username hash
            const usernameMatch = await bcrypt.compare(username, process.env.ADMIN_USERNAME_HASH);
            if (!usernameMatch) {
                console.log('Username mismatch');
                socket.emit('admin_verified', { success: false });
                return;
            }
            
            // Verify password hash
            const passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
            if (!passwordMatch) {
                console.log('Password mismatch');
                socket.emit('admin_verified', { success: false });
                return;
            }
            
            console.log('Admin verified successfully');
            socket.emit('admin_verified', { success: true });
        } catch (error) {
            console.error('Admin verification error:', error);
            console.error('Error details:', error.message);
            socket.emit('admin_verified', { success: false });
        }
    });

    // Add this new event listener
    socket.on('chat_reset', () => {
        // Clear messages on client side
        socket.emit('chat_cleared');
        // Send the new initial message
        socket.emit('new_message', messages[0]);
    });
});

// Clean up inactive users and update more frequently
setInterval(() => {
    const now = Date.now();
    let updated = false;

    for (const [userId, user] of users.entries()) {
        if (now - user.lastSeen > 30000) { // 30 seconds
            users.delete(userId);
            updated = true;
        }
    }

    if (updated) {
        const uniqueUsers = Array.from(users.values()).map(user => ({
            userData: user.userData
        }));
        io.emit('users_update', uniqueUsers);
    }
}, 1000); // Check every second

http.listen(3000, () => {
    console.log('Chat server running on port 3000');
});