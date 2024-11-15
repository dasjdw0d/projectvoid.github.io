document.getElementById('proxyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const protocol = document.getElementById('protocol').value;
    const url = document.getElementById('urlInput').value.trim();
    const frame = document.getElementById('proxyFrame');
    
    // Remove any existing protocol from the URL
    const cleanUrl = url.replace(/^(https?:\/\/)/, '');
    
    // Construct the proxy URL
    const proxyUrl = `http://198.23.239.134:6540/${protocol}${cleanUrl}`;
    
    try {
        // Test the proxy connection first
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Proxy-Authorization': 'Basic ' + btoa('xwswqggg:tljt5ywjq430')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If successful, load in iframe
        frame.src = proxyUrl;

    } catch (error) {
        console.error('Detailed error:', error);
        
        let errorMessage = 'Proxy Error:\n\n';
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage += 'Cannot connect to proxy server. Possible reasons:\n' +
                '• Proxy server (198.23.239.134:6540) might be down\n' +
                '• Incorrect proxy credentials\n' +
                '• Network connectivity issues\n' +
                '• CORS policy blocking the request\n\n' +
                'Technical details: ' + error.message;
        } else if (error.message.includes('status: 407')) {
            errorMessage += 'Proxy authentication failed.\n' +
                'Please check username and password are correct.';
        } else if (error.message.includes('status: 403')) {
            errorMessage += 'Access forbidden.\n' +
                'The proxy server is refusing to allow access to the requested URL.';
        } else if (error.message.includes('status: 404')) {
            errorMessage += 'The requested URL was not found.\n' +
                'Please check if the URL is correct.';
        } else if (error.message.includes('status: 5')) {
            errorMessage += 'Proxy server error.\n' +
                'The proxy server encountered an internal error.';
        } else {
            errorMessage += error.message;
        }

        // Create and show error modal
        showErrorModal(errorMessage);
    }
});

function showErrorModal(message) {
    // Remove any existing error modal
    const existingModal = document.querySelector('.error-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'error-modal-content';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'error-close-btn';
    closeButton.innerHTML = '×';
    
    const title = document.createElement('h2');
    title.textContent = 'Error Details';
    
    const messageText = document.createElement('pre');
    messageText.textContent = message;
    
    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(messageText);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add event listeners
    closeButton.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Add these styles to your proxy.css file 