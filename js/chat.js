document.addEventListener('DOMContentLoaded', () => {

    // Get admin token from session storage if it exists
    const adminToken = sessionStorage.getItem('adminToken');
    
    // Initialize socket with auth if admin token exists
    const socket = io('https://projectvoid.is-not-a.dev', {
        path: '/socket.io/',
        auth: adminToken ? { adminSession: adminToken } : undefined
    });

    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const onlineUsers = document.getElementById('onlineUsers');
    const chatUsername = document.getElementById('chatUsername');
    const chatProfileImage = document.getElementById('chatProfileImage');

    const adminButton = document.getElementById('adminButton');
    const adminModal = document.getElementById('adminModal');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminCloseBtn = document.getElementById('adminCloseBtn');
    const adminControls = document.getElementById('adminControls');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const lockChatBtn = document.getElementById('lockChatBtn');
    const filterToggleBtn = document.getElementById('filterToggleBtn');

    let isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    let isAnonymous = isAdmin;
    let isIdle = false;
    let lastMessageCount = 0;
    const displayedMessages = new Set();
    const MAX_MESSAGE_LENGTH = 500; 
    let userIsScrolling = false;
    let isChatLocked = false;
    let replyingTo = null;
    let isLoadingMessages = false;
    const MESSAGES_PER_BATCH = 50;
    let oldestLoadedMessageTimestamp = null;
    let isLoading = true;

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }

    function getUserData() {
        const stats = JSON.parse(localStorage.getItem('siteStats')) || {
            username: 'Guest',
            profilePicture: 'images/favicon.png'
        };

        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        
        return {
            username: isAdmin ? 'Owner' : stats.username,
            profileImage: stats.profilePicture,
            userId: localStorage.getItem('userId') || generateUserId(),
            isAdmin: isAdmin
        };
    }

    let userData = getUserData();

    function updateUserDisplay() {
        chatUsername.textContent = userData.username;
        chatProfileImage.src = userData.profileImage;
    }

    updateUserDisplay();

    function updateAdminUI() {
        adminControls.style.display = isAdmin ? 'flex' : 'none';
        adminButton.style.display = isAdmin ? 'none' : 'block';
    }

    updateAdminUI();

    function updateChat(messages) {
        if (messages.length === 0) {
            chatMessages.innerHTML = '';
            displayedMessages.clear();
            lastMessageCount = 0;
            return;
        }

        const wasAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight;

        const sortedMessages = messages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        sortedMessages.forEach(message => {
            if (!displayedMessages.has(message.timestamp)) {
                addMessage(message);
                displayedMessages.add(message.timestamp);
            }
        });

        if (wasAtBottom) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        lastMessageCount = messages.length;
    }

    function addMessage(message, prepend = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.system ? 'system-message' : ''} ${message.userData?.isAdmin ? 'admin-message' : ''}`;
        messageDiv.dataset.timestamp = message.timestamp;

        // Sanitize all text content before displaying
        const sanitizedContent = escapeHtml(message.content);
        const sanitizedUsername = message.userData ? escapeHtml(message.userData.username) : 'System';

        if (message.system) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${sanitizedContent}</span>
                </div>
            `;
        } else {
            const avatarImg = document.createElement('img');
            avatarImg.className = 'message-avatar';
            avatarImg.src = message.userData?.profileImage || 'images/favicon.png';
            avatarImg.alt = 'Avatar';
            
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-username">${sanitizedUsername}</span>
                        <span class="message-time">${formatTimestamp(message.timestamp)}</span>
                    </div>
                    <span class="message-text">${sanitizedContent}</span>
                </div>
            `;
            messageDiv.insertBefore(avatarImg, messageDiv.firstChild);
        }

        // Only add delete button if user is actually admin (server-side verified)
        if (isAdmin && !message.system) {
            const deleteIcon = document.createElement('span');
            deleteIcon.className = 'delete-icon';
            deleteIcon.textContent = '🗑️';
            deleteIcon.onclick = () => deleteMessage(message.timestamp);
            messageDiv.appendChild(deleteIcon);
        }

        if (prepend) {
            chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
        } else {
            chatMessages.appendChild(messageDiv);
            // Simple instant scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

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

            indicator.querySelector('.cancel-reply').addEventListener('click', () => {
                replyingTo = null;
                messageInput.placeholder = 'Type your message...';
                indicator.style.display = 'none';
            });
        } else {
            indicator.style.display = 'none';
        }
    }

    let lastMessageTime = 0;
    const COOLDOWN_TIME = 2500; 

    async function sendMessage() {
        if (isLoading || (isChatLocked && !isAdmin)) {
            return;
        }

        const now = Date.now();
        if (!isAdmin && now - lastMessageTime < COOLDOWN_TIME) {
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

        console.log('Attempting to send message:', {
            content,
            userData: getUserData(),
            isAdmin,
            socketAuth: socket.auth,
            adminToken: sessionStorage.getItem('adminToken')
        });

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

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateOnlineUsers(users) {
        const usersList = document.getElementById('onlineUsers');
        usersList.innerHTML = '';

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

    socket.on('connect', () => {
        console.log('Connected to chat server');
        const adminToken = sessionStorage.getItem('adminToken');
        if (adminToken) {
            socket.auth = { adminSession: adminToken };
        }
        socket.emit('user_update', getUserData());
    });

    socket.on('load_messages', (messages) => {
        chatMessages.innerHTML = '';
        displayedMessages.clear();
        lastMessageCount = 0;

        if (messages.length > 0) {
            oldestLoadedMessageTimestamp = messages[messages.length - 1].timestamp;
            
            messages.forEach(message => {
                addMessage(message);
                displayedMessages.add(message.timestamp);
            });
            
            lastMessageCount = messages.length;
            // Instant scroll to bottom after loading
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
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

    socket.on('chat_cleared', (resetMessage) => {
        chatMessages.innerHTML = '';
        displayedMessages.clear();
        lastMessageCount = 0;
        
        if (resetMessage) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message system-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${resetMessage.content}</span>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
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

    function generateUserId() {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
        return userId;
    }

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/`/g, "&#x60;"); // Also escape backticks
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

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

        socket.emit('verify_admin', { username, password });
    });

    adminLogoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            isAdmin = false;
            isAnonymous = false;
            sessionStorage.removeItem('isAdmin');
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

    socket.on('filter_status', (status) => {
        isFilterEnabled = status;
        if (filterToggleBtn) {
            filterToggleBtn.textContent = status ? 'Disable Filter' : 'Enable Filter';
        }
    });

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chat-sidebar {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden; 
            }

            .user-profile {
                flex-shrink: 0;
                margin-bottom: 1rem;
            }

            #onlineUsers {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding-right: 0.5rem;
                min-height: 0; 
            }

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

            .message-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;  
            }

            .message-time {
                color: #00000;
                font-size: 0.75rem;
                margin-left: auto;  
            }


            ${style.textContent}
        `;
        document.head.appendChild(style);
    }

    addStyles();

    setInterval(() => {
        socket.emit('user_update', {
            ...getUserData(),
            isIdle,
            lastSeen: Date.now()
        });
    }, 30000);

    document.addEventListener('visibilitychange', () => {
        isIdle = document.hidden;
        updateUserStatus(); 
        updateStatusBadge(); 
    });

    function updateStatusBadge() {
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = isIdle ? 'Idle' : 'Online';
            statusBadge.className = `status-badge ${isIdle ? 'idle' : 'online'}`;
        }
    }

    messageInput.addEventListener('input', () => {
        if (messageInput.value.length > MAX_MESSAGE_LENGTH) {
            messageInput.value = messageInput.value.substring(0, MAX_MESSAGE_LENGTH);
        }
    });

    chatMessages.addEventListener('scroll', () => {
        userIsScrolling = true;
        clearTimeout(window.scrollTimeout);
        
        if (chatMessages.scrollTop < 100 && !isLoadingMessages) {
            loadMoreMessages();
        }

        window.scrollTimeout = setTimeout(() => {
            userIsScrolling = false;
        }, 2000);
    });

    function loadMoreMessages() {
        if (isLoadingMessages) return;
        isLoadingMessages = true;

        socket.emit('load_more_messages', {
            beforeTimestamp: oldestLoadedMessageTimestamp,
            limit: MESSAGES_PER_BATCH
        });
    }

    socket.on('more_messages', (data) => {
        isLoadingMessages = false;
        
        if (data.messages.length > 0) {
            oldestLoadedMessageTimestamp = data.messages[data.messages.length - 1].timestamp;
            
            data.messages.forEach(message => {
                if (!displayedMessages.has(message.timestamp)) {
                    addMessage(message, true);
                    displayedMessages.add(message.timestamp);
                }
            });
        }
    });

    function updateChatLockUI() {
        const canChat = (isAdmin || !isChatLocked) && !isLoading;
        messageInput.disabled = !canChat;
        sendButton.disabled = !canChat;

        if (lockChatBtn) {
            lockChatBtn.textContent = isChatLocked ? 'Unlock Chat' : 'Lock Chat';
        }

        messageInput.placeholder = isLoading ? 'Loading messages...' : 
                                 !canChat ? 'Chat is locked by admin' : 
                                 'Type your message...';
    }

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

    const cooldownOverlay = addCooldownUI();

    document.addEventListener('mousemove', updateUserActivity);
    document.addEventListener('keydown', updateUserActivity);
    document.addEventListener('click', updateUserActivity);

    function updateUserActivity() {
        if (socket) {
            socket.emit('user_active');
        }
    }

    setInterval(() => {
        if (socket) {
            socket.emit('user_update', getUserData());
        }
    }, 1000); 

    socket.on('system_message', (message) => {
        addSystemMessage(message.content);
    });

    function updateUserStatus() {
        socket.emit('user_update', getUserData());
    }

    socket.on('admin_verified', (data) => {
        console.log('Received admin verification response:', data);
        if (data.success) {
            isAdmin = true;
            isAnonymous = true;
            sessionStorage.setItem('isAdmin', 'true');
            sessionStorage.setItem('adminToken', data.token);
            
            // Update socket auth immediately
            socket.auth = { adminSession: data.token };
            
            // Reconnect with new auth
            socket.disconnect().connect();
            
            adminModal.style.display = 'none';
            updateAdminUI();
            userData = getUserData();
            updateUserDisplay();
            updateUserStatus();
        } else {
            alert('Invalid credentials');
        }
    });

    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.textContent;
            const input = document.getElementById('messageInput');
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;

            input.value = text.substring(0, start) + emoji + text.substring(end);

            input.selectionStart = input.selectionEnd = start + emoji.length;
            input.focus();
        });
    });

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

    socket.on('message_deleted', ({ timestamp, content }) => {
        updateDeletedMessage(timestamp, content);
    });

    socket.on('chat_lock_status', (status) => {
        isChatLocked = status;
        updateChatLockUI();
    });

    function addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.dataset.timestamp = new Date().toISOString();

        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">${content}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        displayedMessages.add(messageDiv.dataset.timestamp);
    }

    const timerDisplay = document.getElementById('chatResetTimer');

    socket.on('timer_update', (seconds) => {
        updateTimerDisplay(seconds);
    });

    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `Automatic Chat Reset: ${minutes}m ${remainingSeconds}s`;
    }

    socket.on('chat_cleared', (resetMessage) => {
        chatMessages.innerHTML = '';
        displayedMessages.clear();
        lastMessageCount = 0;
        
        if (resetMessage) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message system-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${resetMessage.content}</span>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    socket.on('initial_data', (data) => {
        isLoading = false;
        loadingIndicator.remove();
        updateTimerDisplay(data.timer);
        isChatLocked = data.chatLockStatus;
        updateChatLockUI();
        chatMessages.innerHTML = '';
        displayedMessages.clear();
        lastMessageCount = 0;
        
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(message => {
                addMessage(message);
                displayedMessages.add(message.timestamp);
            });
            
            lastMessageCount = data.messages.length;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = 'Loading messages...';
    chatMessages.appendChild(loadingIndicator);

    function deleteMessage(timestamp) {
        if (!isAdmin) return;
        socket.emit('delete_message', timestamp);
    }

    socket.on('message_deleted', ({ timestamp, content }) => {
        const messageDiv = document.querySelector(`[data-timestamp="${timestamp}"]`);
        if (messageDiv) {
            messageDiv.className = 'message system-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-text">${content}</span>
                </div>
            `;
        }
    });
});