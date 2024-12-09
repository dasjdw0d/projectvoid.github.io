document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('aiMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    let isProcessing = false;
    const marked = window.marked;

    // Add clear button to chat input
    const chatInput = document.querySelector('.chat-input');
    const clearButton = document.createElement('button');
    clearButton.id = 'clearButton';
    clearButton.textContent = 'Clear History';
    chatInput.insertBefore(clearButton, sendButton);

    // Load chat history on startup
    loadChatHistory();

    clearButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your chat history?')) {
            localStorage.removeItem('chatHistory');
            messagesDiv.innerHTML = '';
        }
    });

    function loadChatHistory() {
        const history = localStorage.getItem('chatHistory');
        if (history) {
            const messages = JSON.parse(history);
            messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type}-message`;
                
                const avatar = document.createElement('img');
                avatar.className = 'message-avatar';
                
                if (msg.type === 'user') {
                    avatar.src = msg.userData?.profileImage || 'images/favicon.png';
                } else {
                    avatar.src = 'images/aipfp.png';
                }
                
                const messageContent = document.createElement('div');
                messageContent.className = 'message-content';
                
                const header = document.createElement('div');
                header.className = 'message-header';
                
                const username = msg.type === 'user' ? 
                    (msg.userData?.username || 'You') : 
                    'AI Assistant';
                header.innerHTML = `<span>${username}</span>`;
                
                const textContent = document.createElement('div');
                if (msg.type === 'ai') {
                    textContent.innerHTML = msg.content;
                } else {
                    textContent.textContent = msg.content;
                }
                
                messageContent.appendChild(header);
                messageContent.appendChild(textContent);
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(messageContent);
                messagesDiv.appendChild(messageDiv);
            });
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    function saveChatHistory() {
        const messages = Array.from(messagesDiv.children).map(msg => {
            const isUser = msg.classList.contains('user-message');
            const userData = isUser ? getUserData() : null;
            
            return {
                type: isUser ? 'user' : 'ai',
                content: msg.querySelector('.message-content div:last-child').textContent,
                // Save user data with each message if it's a user message
                userData: isUser ? {
                    username: userData.username,
                    profileImage: userData.profileImage
                } : null
            };
        });
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    function addThinkingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message thinking';
        messageDiv.innerHTML = `
            Thinking
            <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return messageDiv;
    }

    async function sendMessage() {
        if (isProcessing) return;
        
        const message = userInput.value.trim();
        if (!message) return;

        isProcessing = true;
        userInput.disabled = true;
        sendButton.disabled = true;
        
        addMessage('user', message);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        userInput.value = '';

        const loadingMessage = addThinkingMessage();
        
        try {
            const response = await fetch('api/ai_endpoint.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.response && data.response.trim()) {
                const aiResponse = data.response.trim();
                loadingMessage.remove();
                addMessage('ai', aiResponse);
                saveChatHistory();
            } else {
                loadingMessage.remove();
                addMessage('system', 'Sorry, I could not generate a response.');
            }

        } catch (error) {
            loadingMessage.remove();
            addMessage('system', `Error: ${error.message}`);
        } finally {
            isProcessing = false;
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    function getUserData() {
        const stats = JSON.parse(localStorage.getItem('siteStats')) || {
            username: 'Guest',
            profilePicture: 'images/favicon.png'
        };

        return {
            username: stats.username,
            profileImage: stats.profilePicture || 'images/favicon.png'
        };
    }

    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        
        if (type === 'user') {
            const userData = getUserData();
            avatar.src = userData.profileImage;
            
            // Add onerror handler in case the profile image fails to load
            avatar.onerror = () => {
                avatar.src = 'images/favicon.png';
            };
        } else {
            avatar.src = 'images/aipfp.png';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        
        const userData = type === 'user' ? getUserData() : { username: 'AI Assistant' };
        header.innerHTML = `<span>${userData.username}</span>`;
        
        const textContent = document.createElement('div');
        if (type === 'ai') {
            textContent.innerHTML = marked.parse(content);
            textContent.querySelectorAll('pre').forEach(block => {
                const button = document.createElement('button');
                button.className = 'copy-button';
                button.textContent = 'Copy';
                button.onclick = () => {
                    navigator.clipboard.writeText(block.textContent);
                    button.textContent = 'Copied!';
                    setTimeout(() => button.textContent = 'Copy', 2000);
                };
                block.appendChild(button);
            });
        } else {
            textContent.textContent = content;
        }
        
        messageContent.appendChild(header);
        messageContent.appendChild(textContent);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesDiv.appendChild(messageDiv);
        
        return messageDiv;
    }

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
            e.preventDefault();
            sendMessage();
        }
    });

    userInput.addEventListener('input', () => {
        const counter = document.querySelector('.char-counter');
        counter.textContent = `${userInput.value.length}/500`;
    });

    function initializeProfileSync() {
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'siteStats') {
                // Update all existing user messages with new profile info
                const userMessages = document.querySelectorAll('.user-message');
                const userData = getUserData();
                
                userMessages.forEach(message => {
                    const avatar = message.querySelector('.message-avatar');
                    const username = message.querySelector('.message-header span');
                    
                    if (avatar) {
                        avatar.src = userData.profileImage;
                    }
                    if (username) {
                        username.textContent = userData.username;
                    }
                });
            }
        });
    }

    initializeProfileSync();
}); 