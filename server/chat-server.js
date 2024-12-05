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
app.use(express.json());  

const MESSAGES_FILE = path.join(__dirname, 'chat_messages.json');

let resetTimer = 1800; 
let timerInterval;

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
        timestamp: new Date().toISOString(),
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
    resetTimer = 1800; 

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
            resetTimer = 1800; 
            io.emit('timer_update', resetTimer); 
        }
    }, 1000);
}

startGlobalTimer();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.emit('timer_update', resetTimer);
    socket.emit('load_messages', messages);
    socket.emit('chat_lock_status', isChatLocked);

    socket.on('send_message', async (data) => {
        if (!data.content || data.content.length > MAX_MESSAGE_LENGTH) {
            return;
        }

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

        const sanitizedContent = sanitizeHtml(data.content);

        const message = {
            content: sanitizedContent,
            userData: validateUserData(data.userData),
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

            console.log('Admin verified successfully');
            socket.emit('admin_verified', { success: true });
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

http.listen(3000, () => {
    console.log('Chat server running on port 3000');
});