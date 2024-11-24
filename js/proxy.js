document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for Enter key on URL input
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadProxy();
        }
    });
});

function loadProxy() {
    const urlInput = document.getElementById('urlInput');
    const proxyFrame = document.getElementById('proxyFrame');
    let url = urlInput.value.trim();

    // Add https:// if no protocol specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Create and append iframe with updated path to proxy handler
    proxyFrame.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = `api/proxy_handler.php?url=${encodeURIComponent(url)}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    proxyFrame.appendChild(iframe);
} 