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
    const filterToggleBtn = document.getElementById('filterToggleBtn');

    // State variables
    let isAdmin = localStorage.getItem('isAdmin') === 'true';
    let isAnonymous = isAdmin;
    let isIdle = false;
    let lastMessageCount = 0;
    const displayedMessages = new Set();
    const MAX_MESSAGE_LENGTH = 500; // Adjust this number as needed
    let userIsScrolling = false;
    let isChatLocked = false;
    let replyingTo = null;

    // Get user data from siteStats
    function getUserData() {
        const stats = JSON.parse(localStorage.getItem('siteStats')) || {
            username: 'Guest',
            profilePicture: 'images/favicon.png'
        };
        
        return {
            username: isAdmin ? 'Owner' : stats.username,
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
            chatMessages.innerHTML = '';
            displayedMessages.clear();
            lastMessageCount = 0;
            addSystemMessage('Chat cleared by admin');
            return;
        }

        const wasAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight;

        messages.forEach(message => {
            const existingMessage = document.querySelector(`[data-timestamp="${message.timestamp}"]`);
            if (!existingMessage && !displayedMessages.has(message.timestamp)) {
                addMessage(message);
                displayedMessages.add(message.timestamp);
            } else if (existingMessage && message.deleted) {
                existingMessage.className = 'message deleted';
                existingMessage.innerHTML = `
                    <div class="message-content delete-message">
                        <span class="message-text">${message.content}</span>
                    </div>
                `;
            }
        });

        if ((wasAtBottom || !userIsScrolling) && messages.length > lastMessageCount) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        lastMessageCount = messages.length;
    }

    // Add a single message
    function addMessage(data) {
        const messageDiv = document.createElement('div');
        
        if (data.deleted) {
            messageDiv.className = 'message deleted';
            messageDiv.dataset.timestamp = data.timestamp;
            messageDiv.innerHTML = `
                <div class="message-content delete-message">
                    <span class="message-text">${data.content}</span>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            return;
        }
        
        messageDiv.className = `message ${data.userData?.isAdmin ? 'admin-message' : ''} ${data.system ? 'system-message' : ''}`;
        messageDiv.dataset.timestamp = data.timestamp;
        
        if (data.system) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${data.content}</span>
                </div>
            `;
        } else {
            const time = new Date(data.timestamp).toLocaleTimeString();
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-username">${data.userData.username}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <span class="message-text">${escapeHtml(data.content)}</span>
                </div>
                ${isAdmin ? '<div class="delete-icon" role="button" tabindex="0">🗑️</div>' : ''}
            `;

            if (isAdmin) {
                const deleteIcon = messageDiv.querySelector('.delete-icon');
                deleteIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    socket.emit('delete_message', data.timestamp);
                });
            }
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add new function to handle reply indicator
    function updateReplyIndicator() {
        let indicator = document.querySelector('.reply-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'reply-indicator';
            document.querySelector('.chat-input').prepend(indicator);
        }
        
        if (replyingTo) {
            indicator.innerHTML = `
                Replying to ${replyingTo.username}
                <button class="cancel-reply">×</button>
            `;
            indicator.style.display = 'flex';
            
            // Add cancel handler
            indicator.querySelector('.cancel-reply').addEventListener('click', () => {
                replyingTo = null;
                messageInput.placeholder = 'Type your message...';
                indicator.style.display = 'none';
            });
        } else {
            indicator.style.display = 'none';
        }
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
            userData: getUserData(),
            replyTo: replyingTo
        });
        
        messageInput.value = '';
        lastMessageTime = now;
        replyingTo = null;
        updateReplyIndicator();
        messageInput.placeholder = 'Type your message...';
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
                        <span class="user-name">${user.username}</span>
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
        updateChat(messages);
    });

    socket.on('new_message', (message) => {
        addMessage(message);
        displayedMessages.add(message.timestamp);
        lastMessageCount++;
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

    socket.on('message_deleted', ({ oldTimestamp, message }) => {
        const messageDiv = document.querySelector(`[data-timestamp="${oldTimestamp}"]`);
        if (messageDiv) {
            messageDiv.className = 'message system-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${message.content}</span>
                </div>
            `;
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

    // Add socket listener for filter status
    socket.on('filter_status', (status) => {
        isFilterEnabled = status;
        if (filterToggleBtn) {
            filterToggleBtn.textContent = status ? 'Disable Filter' : 'Enable Filter';
        }
    });

    // Add this to your CSS first:
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Update chat container and sidebar styles */
            .chat-sidebar {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden; /* Add this */
            }

            /* Fix user profile section */
            .user-profile {
                flex-shrink: 0;
                margin-bottom: 1rem;
            }

            /* Fix online users container */
            #onlineUsers {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding-right: 0.5rem;
                min-height: 0; /* Critical for flex overflow */
            }

            /* Ensure user items don't grow */
            .user-item {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                gap: 0.8rem;
                padding: 0.8rem;
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid transparent;
                min-height: 42px;
            }

            /* Message styling */
            .message-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;  /* Space between username and timestamp */
            }

            .message-time {
                color: #666;
                font-size: 0.75rem;
                margin-left: auto;  /* Push timestamp to the right */
            }

            .message-text {
                margin-top: 2px;  /* Space between header and message text */
            }

            ${style.textContent}
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

    // Add this after your existing event listeners
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.textContent;
            const input = document.getElementById('messageInput');
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            
            // Insert emoji at cursor position
            input.value = text.substring(0, start) + emoji + text.substring(end);
            
            // Move cursor after emoji
            input.selectionStart = input.selectionEnd = start + emoji.length;
            input.focus();
        });
    });

    // Add this helper function
    function updateDeletedMessage(timestamp, content) {
        const messageDiv = document.querySelector(`[data-timestamp="${timestamp}"]`);
        if (messageDiv) {
            messageDiv.className = 'message system-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${content}</span>
                </div>
            `;
        }
    }

    // Add socket listener for deleted messages
    socket.on('message_deleted', ({ timestamp, content }) => {
        updateDeletedMessage(timestamp, content);
    });

    // Add socket listener for chat lock status
    socket.on('chat_lock_status', (status) => {
        isChatLocked = status;
        updateChatLockUI();
    });
});