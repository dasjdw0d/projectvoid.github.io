document.addEventListener('DOMContentLoaded', () => {
    // Connect to WebSocket server through the proxy
    const socket = io('https://projectvoid.is-not-a.dev', {
        path: '/socket.io/'
    });

    // Chat elements
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const onlineUsers = document.getElementById('onlineUsers');
    const chatUsername = document.getElementById('chatUsername');
    const chatProfileImage = document.getElementById('chatProfileImage');

    // Admin UI elements
    const adminButton = document.getElementById('adminButton');
    const adminModal = document.getElementById('adminModal');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminCloseBtn = document.getElementById('adminCloseBtn');
    const adminControls = document.getElementById('adminControls');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const lockChatBtn = document.getElementById('lockChatBtn');

    // State variables
    let isAdmin = localStorage.getItem('isAdmin') === 'true';
    let isAnonymous = isAdmin;
    let isIdle = false;
    let lastMessageCount = 0;
    const displayedMessages = new Set();
    const MAX_MESSAGE_LENGTH = 500; // Adjust this number as needed
    let userIsScrolling = false;
    let isChatLocked = false;

    // Add this constant at the top with other constants (after DOMContentLoaded)
    const SERVER_URL = 'https://projectvoid.is-not-a.dev:3000';

    // Get user data from siteStats
    function getUserData() {
        const stats = JSON.parse(localStorage.getItem('siteStats')) || {
            username: 'Guest',
            profilePicture: 'images/favicon.png'
        };
        
        return {
            username: isAdmin ? 'Anonymous' : stats.username,
            profileImage: stats.profilePicture,
            userId: localStorage.getItem('userId') || generateUserId(),
            isAdmin: isAdmin
        };
    }

    let userData = getUserData();

    // Update profile display
    function updateUserDisplay() {
        chatUsername.textContent = userData.username;
        chatProfileImage.src = userData.profileImage;
    }

    updateUserDisplay();

    // Function to update admin UI
    function updateAdminUI() {
        adminControls.style.display = isAdmin ? 'flex' : 'none';
        adminButton.style.display = isAdmin ? 'none' : 'block';
    }

    // Initialize admin UI
    updateAdminUI();

    // Update chat display without repeating messages
    function updateChat(messages) {
        if (messages.length === 0 && chatMessages.children.length > 0) {
            // If server has no messages but we have local messages, clear everything
            chatMessages.innerHTML = '';
            displayedMessages.clear();
            lastMessageCount = 0;
            addSystemMessage('Chat cleared by admin');
            return;
        }

        const wasAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight;

        messages.forEach(message => {
            const existingMessage = document.querySelector(`[data-timestamp="${message.timestamp}"]`);
            if (existingMessage) {
                // Update existing message if it's been deleted
                if (message.deleted && !existingMessage.classList.contains('deleted')) {
                    existingMessage.classList.add('deleted');
                    existingMessage.querySelector('.message-text').textContent = message.content;
                    existingMessage.querySelector('.delete-icon')?.remove();
                }
            } else if (!displayedMessages.has(message.timestamp)) {
                // Add new message
                addMessage(message);
                displayedMessages.add(message.timestamp);
            }
        });

        // Only auto-scroll if user was at bottom or not actively scrolling
        if ((wasAtBottom || !userIsScrolling) && messages.length > lastMessageCount) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        lastMessageCount = messages.length;
    }

    // Add a single message
    function addMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${data.userData?.isAdmin ? 'admin-message' : ''} ${data.deleted ? 'deleted' : ''} ${data.system ? 'system-message' : ''}`;
        messageDiv.dataset.timestamp = data.timestamp;
        
        if (data.system) {
            // System message format
            messageDiv.innerHTML = `
                <div class="message-content system">
                    <div class="message-text">${data.content}</div>
                </div>
            `;
        } else {
            // Regular message format
            const time = new Date(data.timestamp).toLocaleTimeString();
            messageDiv.innerHTML = `
                <img class="message-avatar" src="${data.userData.profileImage}" alt="Avatar">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-username">${data.userData.username}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-text">${escapeHtml(data.content)}</div>
                </div>
                ${isAdmin && !data.deleted ? '<span class="delete-icon" role="button" tabindex="0">🗑️</span>' : ''}
            `;

            // Add delete handler for admin
            if (isAdmin && !data.deleted) {
                const deleteIcon = messageDiv.querySelector('.delete-icon');
                deleteIcon.addEventListener('click', () => {
                    if (confirm('Delete this message?')) {
                        socket.emit('delete_message', data.timestamp);
                    }
                });
            }
        }

        chatMessages.appendChild(messageDiv);
    }

    // Add message cooldown
    let lastMessageTime = 0;
    const COOLDOWN_TIME = 2500; // 2.5 seconds in milliseconds

    // Update your send message function
    async function sendMessage() {
        if (isChatLocked && !isAdmin) return;
        
        const now = Date.now();
        if (now - lastMessageTime < COOLDOWN_TIME) {
            const remainingTime = ((COOLDOWN_TIME - (now - lastMessageTime)) / 1000).toFixed(1);
            cooldownOverlay.textContent = `Wait ${remainingTime}s`;
            cooldownOverlay.classList.add('active');
            setTimeout(() => {
                cooldownOverlay.classList.remove('active');
            }, COOLDOWN_TIME - (now - lastMessageTime));
            return;
        }

        const content = messageInput.value.trim();
        if (!content || content.length > MAX_MESSAGE_LENGTH) return;
        
        socket.emit('send_message', {
            content,
            userData: getUserData()
        });
        
        messageInput.value = '';
        lastMessageTime = now;
    }

    // Update online users list
    function updateOnlineUsers(users) {
        const usersList = document.getElementById('onlineUsers');
        usersList.innerHTML = '';
        
        // Sort users: admins first, then alphabetically by username
        const sortedUsers = users.sort((a, b) => {
            if (a.isAdmin !== b.isAdmin) {
                return b.isAdmin ? 1 : -1;
            }
            return a.username.localeCompare(b.username);
        });
        
        sortedUsers.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = `user-item ${user.isAdmin ? 'admin-user' : ''}`;
            
            userDiv.innerHTML = `
                <img src="${user.profileImage}" alt="Avatar">
                <div class="user-info">
                    <div class="user-name-container">
                        <span class="user-name">${user.username}${user.isAdmin ? ' [ADMIN]' : ''}</span>
                    </div>
                </div>
            `;
            
            usersList.appendChild(userDiv);
        });
    }

    // Socket event handlers
    socket.on('connect', () => {
        console.log('Connected to chat server');
        socket.emit('user_update', getUserData());
    });

    socket.on('load_messages', (messages) => {
        chatMessages.innerHTML = '';
        displayedMessages.clear();
        messages.forEach(message => addMessage(message));
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('new_message', (message) => {
        if (!displayedMessages.has(message.timestamp)) {
            addMessage(message);
            displayedMessages.add(message.timestamp);
            if (!userIsScrolling) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    });

    socket.on('users_update', (users) => {
        if (Array.isArray(users)) {
            updateOnlineUsers(users.map(user => user.userData));
        }
    });

    socket.on('chat_cleared', () => {
        chatMessages.innerHTML = '';
        displayedMessages.clear();
        lastMessageCount = 0;
    });

    socket.on('message_deleted', (message) => {
        const messageElement = document.querySelector(`[data-timestamp="${message.timestamp}"]`);
        if (messageElement) {
            messageElement.classList.add('deleted');
            const messageText = messageElement.querySelector('.message-text');
            if (messageText) {
                messageText.textContent = "Deleted by admin";
            }
            // Remove delete icon if it exists
            const deleteIcon = messageElement.querySelector('.delete-icon');
            if (deleteIcon) {
                deleteIcon.remove();
            }
        }
    });

    socket.on('chat_lock_status', (status) => {
        isChatLocked = status;
        updateChatLockUI();
    });

    // Helper function to generate userId
    function generateUserId() {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
        return userId;
    }

    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Admin event listeners
    adminButton.addEventListener('click', () => {
        console.log('Admin button clicked');
        if (!isAdmin) {
            console.log('Showing admin modal');
            adminModal.style.display = 'block';
        }
    });

    adminCloseBtn.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    adminLoginBtn.addEventListener('click', () => {
        const username = document.getElementById('adminUser').value;
        const password = document.getElementById('adminPass').value;
        
        console.log('Attempting admin login with username:', username);
        
        // Send credentials through socket
        socket.emit('verify_admin', { username, password });
    });

    adminLogoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            isAdmin = false;
            isAnonymous = false;
            localStorage.removeItem('isAdmin');
            updateAdminUI();
            userData = getUserData();
            updateUserStatus();
            updateUserDisplay();
        }
    });

    clearChatBtn.addEventListener('click', () => {
        if (!isAdmin) return;
        if (confirm('Are you sure you want to clear all messages?')) {
            socket.emit('clear_chat');
        }
    });

    lockChatBtn.addEventListener('click', () => {
        if (!isAdmin) return;
        socket.emit('toggle_chat_lock', !isChatLocked);
    });

    // Add this to your CSS first:
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .message .delete-icon {
                display: none;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: red;
                cursor: pointer;
                padding: 5px;
                opacity: 0.7;
                z-index: 1;
                user-select: none;
            }

            .message:hover .delete-icon {
                display: ${isAdmin ? 'block' : 'none'};
            }

            .message .delete-icon:hover {
                opacity: 1;
                transform: translateY(-50%) scale(1.1);
            }

            .message {
                position: relative;
            }

            /* Updated deleted message styles */
            .message.deleted .message-content {
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid rgba(255, 0, 0, 0.2);
            }

            .message.deleted .message-text {
                color: rgba(255, 0, 0, 0.7);
                font-style: italic;
            }

            /* Updated admin user styles */
            .user-item.admin-user {
                background: rgba(255, 0, 0, 0.1) !important;
                border: 1px solid rgba(255, 0, 0, 0.3) !important;
            }

            .user-item.admin-user .user-name {
                color: red !important;
            }

            /* Updated user info styles */
            .user-info {
                flex: 1;
            }

            .user-name-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .user-status {
                font-size: 0.8em;
                color: orange;
            }

            .user-status.online {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Call this when the page loads
    addStyles();

    // Add this function to update user status periodically
    setInterval(() => {
        socket.emit('user_update', {
            ...getUserData(),
            isIdle,
            lastSeen: Date.now()
        });
    }, 30000);

    // Add visibility change detection
    document.addEventListener('visibilitychange', () => {
        isIdle = document.hidden;
        updateUserStatus(); // Update status immediately when changing tabs
        updateStatusBadge(); // Update the status badge under username
    });

    // Add status badge update function
    function updateStatusBadge() {
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = isIdle ? 'Idle' : 'Online';
            statusBadge.className = `status-badge ${isIdle ? 'idle' : 'online'}`;
        }
    }

    // Update the message input handler
    messageInput.addEventListener('input', () => {
        if (messageInput.value.length > MAX_MESSAGE_LENGTH) {
            messageInput.value = messageInput.value.substring(0, MAX_MESSAGE_LENGTH);
        }
    });

    // Add scroll detection
    chatMessages.addEventListener('scroll', () => {
        userIsScrolling = true;
        // Reset the flag after user stops scrolling for 2 seconds
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            userIsScrolling = false;
        }, 2000);
    });

    // Add this function to update the UI
    function updateChatLockUI() {
        const canChat = isAdmin || !isChatLocked;
        messageInput.disabled = !canChat;
        sendButton.disabled = !canChat;
        
        // Update button text
        if (lockChatBtn) {
            lockChatBtn.textContent = isChatLocked ? 'Unlock Chat' : 'Lock Chat';
        }
        
        // Update input placeholder
        messageInput.placeholder = !canChat ? 'Chat is locked by admin' : 'Type your message...';
    }

    // Add cooldown UI elements to the chat input area
    function addCooldownUI() {
        const style = document.createElement('style');
        style.textContent = `
            .chat-input {
                position: relative;
            }
            
            .cooldown-overlay {
                position: absolute;
                bottom: 100%;
                left: 0;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid rgba(255, 0, 0, 0.3);
                color: rgba(255, 0, 0, 0.8);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
            }
            
            .cooldown-overlay.active {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        const cooldownOverlay = document.createElement('div');
        cooldownOverlay.className = 'cooldown-overlay';
        document.querySelector('.chat-input').appendChild(cooldownOverlay);
        return cooldownOverlay;
    }

    // Initialize cooldown UI
    const cooldownOverlay = addCooldownUI();

    // Add these event listeners to track user activity
    document.addEventListener('mousemove', updateUserActivity);
    document.addEventListener('keydown', updateUserActivity);
    document.addEventListener('click', updateUserActivity);

    function updateUserActivity() {
        if (socket) {
            socket.emit('user_active');
        }
    }

    // Send periodic updates more frequently
    setInterval(() => {
        if (socket) {
            socket.emit('user_update', getUserData());
        }
    }, 1000); // Update every second

    // Add socket listener for system messages
    socket.on('system_message', (message) => {
        addSystemMessage(message.content);
    });

    // Add this function near your other utility functions
    function updateUserStatus() {
        socket.emit('user_update', getUserData());
    }

    // Add socket listener for admin verification response
    socket.on('admin_verified', (data) => {
        console.log('Received admin verification response:', data);
        if (data.success) {
            isAdmin = true;
            isAnonymous = true;
            localStorage.setItem('isAdmin', 'true');
            adminModal.style.display = 'none';
            updateAdminUI();
            userData = getUserData();
            updateUserDisplay();
            updateUserStatus();
        } else {
            alert('Invalid credentials');
        }
    });
});