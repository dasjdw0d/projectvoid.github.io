document.addEventListener('DOMContentLoaded', () => {
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

    // State variables
    let isAdmin = localStorage.getItem('isAdmin') === 'true';
    let isAnonymous = isAdmin;
    let isIdle = false;
    let lastMessageCount = 0;
    const displayedMessages = new Set();
    const MAX_MESSAGE_LENGTH = 500; // Adjust this number as needed
    let userIsScrolling = false;

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
        messageDiv.className = `message ${data.userData.isAdmin ? 'admin-message' : ''} ${data.deleted ? 'deleted' : ''}`;
        messageDiv.dataset.timestamp = data.timestamp;
        
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
            ${isAdmin && !data.deleted ? '<span class="delete-icon">🗑️</span>' : ''}
        `;

        // Add delete handler for admin
        if (isAdmin && !data.deleted) {
            const deleteIcon = messageDiv.querySelector('.delete-icon');
            deleteIcon.addEventListener('click', async () => {
                try {
                    const response = await fetch(`${SERVER_URL}/delete-message`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            timestamp: data.timestamp
                        })
                    });
                    if (response.ok) {
                        // The next fetch will update the message
                    }
                } catch (error) {
                    console.error('Error deleting message:', error);
                }
            });
        }
        
        chatMessages.appendChild(messageDiv);
    }

    // Add system message
    function addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content system">
                <div class="message-text">${message}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message function
    async function sendMessage() {
        const content = messageInput.value.trim();
        if (!content || content.length > MAX_MESSAGE_LENGTH) return;
        
        try {
            const response = await fetch(`${SERVER_URL}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content,
                    userData
                })
            });
            
            if (response.ok) {
                messageInput.value = '';
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addSystemMessage('Error sending message');
        }
    }

    // Update online users list
    function updateOnlineUsers(users) {
        onlineUsers.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = `user-item ${user.isAdmin ? 'admin-user' : ''}`;
            userDiv.innerHTML = `
                <img src="${user.profileImage}" alt="Avatar">
                <div class="user-info">
                    <div class="user-name-container">
                        <span class="user-name">${user.username}${user.isAdmin ? ' [ADMIN]' : ''}</span>
                        <span class="user-status ${user.isIdle ? 'idle' : 'online'}">${user.isIdle ? '(Idle)' : ''}</span>
                    </div>
                </div>
            `;
            onlineUsers.appendChild(userDiv);
        });
    }

    // Fetch updates function
    async function fetchUpdates() {
        try {
            // Fetch messages
            const messagesResponse = await fetch(`${SERVER_URL}/messages`);
            const messages = await messagesResponse.json();
            
            // Check if messages array is empty (chat was cleared)
            if (messages.length === 0 && chatMessages.children.length > 0) {
                chatMessages.innerHTML = '';
                displayedMessages.clear();
                lastMessageCount = 0;
                addSystemMessage('Chat cleared by admin');
                return;
            }
            
            updateChat(messages);

            // Fetch users
            const usersResponse = await fetch(`${SERVER_URL}/users`);
            const users = await usersResponse.json();
            updateOnlineUsers(users);
        } catch (error) {
            console.error('Error fetching updates:', error);
        }
    }

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
        if (!isAdmin) {
            adminModal.style.display = 'block';
        }
    });

    adminCloseBtn.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    adminLoginBtn.addEventListener('click', async () => {
        const username = document.getElementById('adminUser').value;
        const password = document.getElementById('adminPass').value;
        
        try {
            const response = await fetch(`${SERVER_URL}/verify-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
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
        } catch (error) {
            console.error('Error verifying admin:', error);
            alert('Error verifying admin credentials');
        }
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

    clearChatBtn.addEventListener('click', async () => {
        if (!isAdmin) return;
        
        if (confirm('Are you sure you want to clear all messages?')) {
            try {
                const response = await fetch(`${SERVER_URL}/clear`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    chatMessages.innerHTML = '';
                    displayedMessages.clear();
                    lastMessageCount = 0;
                    addSystemMessage('Chat cleared by admin');
                }
            } catch (error) {
                console.error('Error clearing chat:', error);
            }
        }
    });

    // Poll for updates every 500ms
    setInterval(fetchUpdates, 500);

    // Initial fetch
    fetchUpdates();

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
            }

            .message:hover .delete-icon {
                display: ${isAdmin ? 'block' : 'none'};
            }

            .message .delete-icon:hover {
                opacity: 1;
            }

            .message {
                position: relative;
            }

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
    async function updateUserStatus() {
        try {
            userData = getUserData(); // Get fresh userData
            const response = await fetch(`${SERVER_URL}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...userData,
                    isIdle,
                    isAdmin, // Make sure isAdmin is included
                    lastSeen: Date.now()
                })
            });
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    }

    // Add user status update interval
    setInterval(updateUserStatus, 30000); // Update every 30 seconds

    // Call updateUserStatus immediately
    updateUserStatus();

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
});