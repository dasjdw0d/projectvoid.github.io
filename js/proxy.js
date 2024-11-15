document.getElementById('proxyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('urlInput').value;
    const proxyFrame = document.getElementById('proxyFrame');
    const resultFrame = document.getElementById('resultFrame');
    
    // Proxy configuration
    const proxyConfig = {
        host: '198.23.239.134',
        port: '6540',
        username: 'xwswqggg',
        password: 'tljt5ywjq430'
    };

    // Create proxy URL
    const proxyUrl = `http://${proxyConfig.username}:${proxyConfig.password}@${proxyConfig.host}:${proxyConfig.port}`;
    
    try {
        // Set up proxy request
        const response = await fetch(url, {
            mode: 'cors',
            headers: {
                'Proxy-Authorization': `Basic ${btoa(`${proxyConfig.username}:${proxyConfig.password}`)}`,
            },
        });

        // Show the iframe and load the content
        proxyFrame.classList.remove('hidden');
        resultFrame.src = proxyUrl + '/' + url;
    } catch (error) {
        console.error('Error accessing proxy:', error);
        alert('Error accessing the proxy. Please try again.');
    }
}); 