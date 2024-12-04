document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('aiMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    let isProcessing = false;

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

        const loadingId = addMessage('system', 'Thinking...');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        let dots = 0;
        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            loadingId.textContent = 'Thinking' + '.'.repeat(dots);
            loadingId.className = 'message system-message thinking-dots';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 500);

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
            
            clearInterval(loadingInterval);
            loadingId.remove();

            if (data.response) {
                addMessage('ai', data.response.trim());
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            } else {
                addMessage('system', 'Sorry, I could not generate a response.');
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

        } catch (error) {
            clearInterval(loadingInterval);
            loadingId.remove();
            addMessage('system', `Error: ${error.message}`);
        } finally {
            isProcessing = false;
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = content;
        messagesDiv.appendChild(messageDiv);
        
        requestAnimationFrame(() => {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
        
        return messageDiv;
    }

    sendButton.addEventListener('click', () => {
        if (!isProcessing) {
            sendMessage();
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
            e.preventDefault();
            sendMessage();
        }
    });
}); 