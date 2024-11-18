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

    // Admin state
    let isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Track displayed message IDs to prevent duplicates
    const displayedMessages = new Set();

    // Get user data from siteStats
    function getUserData() {
        const stats = JSON.parse(localStorage.getItem('siteStats')) || {
            username: 'Guest',
            profilePicture: 'images/favicon.png'
        };
        
        return {
            username: stats.username,
            profileImage: stats.profilePicture,
            userId: localStorage.getItem('userId') || generateUserId(),
            isAdmin: isAdmin // Include admin status in userData
        };
    }

    let userData = getUserData();
    let lastMessageCount = 0;

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
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
                    const response = await fetch('http://localhost:3000/delete-message', {
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
        const message = messageInput.value.trim();
        if (message) {
            try {
                const response = await fetch('http://localhost:3000/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: message,
                        userData: getUserData(), // Get fresh userData in case admin status changed
                        timestamp: new Date().toISOString()
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
    }

    // Update online users list
    function updateOnlineUsers(users) {
        onlineUsers.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <img src="${user.profileImage}" alt="Avatar">
                <span>${user.username}</span>
            `;
            onlineUsers.appendChild(userDiv);
        });
    }

    // Fetch updates function
    async function fetchUpdates() {
        try {
            // Fetch messages
            const messagesResponse = await fetch('http://localhost:3000/messages');
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
            const usersResponse = await fetch('http://localhost:3000/users');
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
            const response = await fetch('http://localhost:3000/verify-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                isAdmin = true;
                localStorage.setItem('isAdmin', 'true');
                adminModal.style.display = 'none';
                updateAdminUI();
                userData = getUserData();
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error verifying admin:', error);
            alert('Error verifying admin credentials');
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        isAdmin = false;
        localStorage.removeItem('isAdmin');
        updateAdminUI();
        userData = getUserData(); // Update userData with new admin status
    });

    clearChatBtn.addEventListener('click', async () => {
        if (isAdmin && confirm('Are you sure you want to clear all messages?')) {
            try {
                const response = await fetch('http://localhost:3000/clear', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    // Clear local message tracking
                    displayedMessages.clear();
                    lastMessageCount = 0;
                    chatMessages.innerHTML = '';
                    
                    // Add a system message about the clear
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
        `;
        document.head.appendChild(style);
    }

    // Call this when the page loads
    addStyles();

    // Add this function to update user status periodically
    async function updateUserStatus() {
        try {
            const response = await fetch('http://localhost:3000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...userData,
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
});