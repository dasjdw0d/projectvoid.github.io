<div class="loading-screen">
    <div class="cyber-loader"></div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Show loading screen for just 0.2 seconds
        setTimeout(function() {
            const loadingScreen = document.querySelector('.loading-screen');
            loadingScreen.classList.add('fade-out');
            
            // Keep the smooth 0.5s fade out
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 200);
    });
</script>
