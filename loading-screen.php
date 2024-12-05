<div class="loading-screen">
    <div class="cyber-loader"></div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            const loadingScreen = document.querySelector('.loading-screen');
            loadingScreen.classList.add('fade-out');
            
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 300);
    });
</script>
