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
const path = require('path');
const fs = require('fs');

app.use(cors({
    origin: ['https://projectvoid.is-not-a.dev', 'http://projectvoid.is-not-a.dev'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());  

const MESSAGES_FILE = path.join(__dirname, 'chat_messages.json');

let resetTimer = 3600; 
let timerInterval;

const MESSAGES_PER_BATCH = 50;
const COOLDOWN_TIME = 2500; // 2.5 seconds, matching client-side
const userLastMessage = new Map();

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

function saveMessages() {
    try {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages), 'utf8');
    } catch (error) {
        console.error('Error saving messages:', error);
    }
}

const messages = [];  

const users = new Map(); 

let isChatLocked = false;

const MAX_MESSAGE_LENGTH = 500;

function validateUserData(userData) {

    return {
        username: userData.username ? sanitizeHtml(userData.username) : 'Guest',
        profileImage: userData.profileImage || 'images/favicon.png',  
        isAdmin: !!userData.isAdmin,  
        userId: userData.userId || ''
    };
}

function containsInvalidCharacters(text) {

    const validPattern = /^[a-zA-Z0-9\s.,!?'"()\-_@#$%&*+= ]+$/;
    return !validPattern.test(text);
}

function containsSensitiveInfo(text) {

    const normalizedText = text
        .toLowerCase()

        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/2/g, 'z')
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

        .replace(/[^a-z0-9]/g, '');

    const reversedText = normalizedText.split('').reverse().join('');

    const sensitivePatterns = [

        /j[o0][e3]/i,            
        /[e3][o0]j/i,            

        /j[o0][es][ey]p*h*/i,    
        /j[o0][es3][ey]/i,       
        /dz[o0][es3][ey]/i,      

        /l[e3]n[t7]*[sz2]*/i,    
        /[sz2][t7]n[e3]l/i,      

        /j[o0][es][ey]p*h*\s*l[e3]n[t7]*[sz2]*/i,  
        /j[o0][es3][ey]\s*l[e3]n[t7]*[sz2]*/i,      

        /g[a4][i1]l/i,           
        /br[i1][a4]n/i,          

        /g[a4][i1]l\s*l[e3]n[t7]*[sz2]*/i,  
        /br[i1][a4]n\s*l[e3]n[t7]*[sz2]*/i,  

        /j[o0]s[e3]ph[i1]n[e3]/i,  
        /j[o0][e3][ui]/i,          

        /l[i1][a4]g/i,            
        /n[a4][i1]rb/i            
    ];

    return sensitivePatterns.some(pattern => 
        pattern.test(normalizedText) || 
        pattern.test(reversedText) ||
        pattern.test(text)
    );
}

async function filterMessage(text) {
    return text;  
}

function initializeChat() {
    messages.length = 0;

    const systemMessage = {
        content: 'Chat room has started',
        timestamp: new Date(0).toISOString(),
        system: true
    };
    messages.push(systemMessage);
    saveMessages();

    if (io) {
        io.emit('chat_reset', {
            message: systemMessage
        });
    }
}

initializeChat();

function startGlobalTimer() {
    clearInterval(timerInterval);
    resetTimer = 3600; 

    timerInterval = setInterval(() => {
        resetTimer--;
        io.emit('timer_update', resetTimer);

        if (resetTimer <= 0) {

            messages.length = 0;

            const resetMessage = {
                content: 'Chat has been reset',
                timestamp: new Date().toISOString(),
                system: true
            };
            messages.push(resetMessage);

            io.emit('chat_cleared', resetMessage);
            resetTimer = 3600; 
            io.emit('timer_update', resetTimer); 
        }
    }, 1000);
}

startGlobalTimer();

// Add message caching
const messageCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function cacheMessages(messages) {
    const cacheKey = 'recent_messages';
    messageCache.set(cacheKey, {
        data: messages,
        timestamp: Date.now()
    });
}

function getCachedMessages() {
    const cacheKey = 'recent_messages';
    const cached = messageCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

function verifyAdminSession(socket) {
    try {
        const adminSession = socket.handshake.auth?.adminSession;
        if (!adminSession) return false;

        const decoded = jwt.verify(adminSession, process.env.JWT_SECRET);
        return decoded && decoded.isAdmin === true;
    } catch (error) {
        return false;
    }
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send initial data more efficiently
    const initialData = {
        timer: resetTimer,
        messages: getCachedMessages() || messages.slice(-MESSAGES_PER_BATCH),
        chatLockStatus: isChatLocked
    };
    
    socket.emit('initial_data', initialData);
    
    if (!getCachedMessages()) {
        cacheMessages(messages.slice(-MESSAGES_PER_BATCH));
    }

    socket.emit('timer_update', resetTimer);
    socket.emit('load_messages', messages.slice(-MESSAGES_PER_BATCH));
    socket.emit('chat_lock_status', isChatLocked);

    socket.on('send_message', async (data) => {
        // Skip cooldown check for admins
        if (!verifyAdminSession(socket)) {
            const now = Date.now();
            const lastMessageTime = userLastMessage.get(socket.id) || 0;
            
            // Check if enough time has passed since last message
            if (now - lastMessageTime < COOLDOWN_TIME) {
                return;
            }
            
            // Update last message time
            userLastMessage.set(socket.id, now);
        }

        const isReallyAdmin = verifyAdminSession(socket);
        
        if (data.userData?.isAdmin && !isReallyAdmin) {
            return;
        }

        if (!data.content || data.content.length > MAX_MESSAGE_LENGTH) {
            return;
        }

        const message = {
            content: sanitizeHtml(data.content),
            userData: {
                ...validateUserData(data.userData),
                isAdmin: isReallyAdmin
            },
            timestamp: new Date().toISOString()
        };

        messages.push(message);
        io.emit('new_message', message);
    });

    socket.on('user_update', (userData) => {
        if (!userData || !userData.userId) return;

        const validatedData = validateUserData(userData);
        const userId = validatedData.userId;

        let userEntry = users.get(userId);
        if (userEntry) {

            userEntry.socketIds.add(socket.id);
            userEntry.userData = validatedData;
            userEntry.lastSeen = Date.now();
        } else {

            userEntry = {
                socketIds: new Set([socket.id]),
                userData: validatedData,
                lastSeen: Date.now()
            };
            users.set(userId, userEntry);
        }

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

    socket.on('disconnect', () => {
        userLastMessage.delete(socket.id);

        for (const [userId, user] of users.entries()) {
            if (user.socketIds.has(socket.id)) {
                user.socketIds.delete(socket.id);

                if (user.socketIds.size === 0) {
                    users.delete(userId);
                }
                break;
            }
        }

        const uniqueUsers = Array.from(users.values()).map(user => ({
            userData: user.userData
        }));
        io.emit('users_update', uniqueUsers);
        console.log('User disconnected:', socket.id);
    });

    socket.on('verify_admin', async (credentials) => {
        try {
            const { username, password } = credentials;
            console.log('Admin login attempt received'); 

            const usernameMatch = await bcrypt.compare(username, process.env.ADMIN_USERNAME_HASH);
            if (!usernameMatch) {
                console.log('Username mismatch');
                socket.emit('admin_verified', { success: false });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
            if (!passwordMatch) {
                console.log('Password mismatch');
                socket.emit('admin_verified', { success: false });
                return;
            }

            // Create admin session token
            const adminToken = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
            // Set the admin session in socket auth
            socket.handshake.auth.adminSession = adminToken;

            console.log('Admin verified successfully');
            socket.emit('admin_verified', { 
                success: true,
                token: adminToken // Send token back to client
            });
        } catch (error) {
            console.error('Admin verification error:', error);
            socket.emit('admin_verified', { success: false });
        }
    });

    socket.on('chat_reset', () => {

        messages.length = 0; 

        const resetMessage = {
            content: 'Chat has been reset',
            timestamp: new Date().toISOString(),
            system: true
        };

        io.emit('chat_cleared');
        io.emit('new_message', resetMessage);
    });

    socket.on('load_more_messages', (data) => {
        const { beforeTimestamp, limit } = data;
        
        let moreMessages;
        if (beforeTimestamp) {
            const oldestLoadedIndex = messages.findIndex(m => m.timestamp === beforeTimestamp);
            if (oldestLoadedIndex > 0) {
                const startIndex = Math.max(1, oldestLoadedIndex - limit);
                moreMessages = messages.slice(startIndex, oldestLoadedIndex);
            }
        }

        socket.emit('more_messages', {
            messages: moreMessages || []
        });
    });

    // Optimize message loading
    socket.on('load_messages', (data) => {
        try {
            // Get the most recent messages first, limited to MESSAGES_PER_BATCH
            const recentMessages = messages
                .slice(-MESSAGES_PER_BATCH)
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            socket.emit('load_messages', recentMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
            socket.emit('load_messages', []);
        }
    });
});

setInterval(() => {
    const now = Date.now();
    let updated = false;

    for (const [userId, user] of users.entries()) {
        if (now - user.lastSeen > 30000) { 
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
}, 1000); 

// Clean up disconnected users' cooldown data
setInterval(() => {
    const now = Date.now();
    for (const [socketId, lastMessageTime] of userLastMessage.entries()) {
        if (now - lastMessageTime > 30000) { // Clean up after 30 seconds of inactivity
            userLastMessage.delete(socketId);
        }
    }
}, 30000);

http.listen(3000, () => {
    console.log('Chat server running on port 3000');
});