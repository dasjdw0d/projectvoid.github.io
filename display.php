<?php
$page = "Display";
define('allowed', true);
include 'header.php';
?>
    <div class="game-bar">
        <div class="game-bar-left">
            <a href="games.php" class="back-button">
                <span class="back-arrow">‹</span>
                Back to Games
            </a>
            <div class="game-info">
                <span class="game-title" id="gameTitle">Loading...</span>
                <span class="play-time" id="playTime">Session Time: 00:00</span>
            </div>
        </div>
        <div class="game-bar-right">
            <button class="control-button" id="fullscreenBtn">
                <span class="fullscreen-icon">⛶</span>
                Fullscreen
            </button>
            <div class="watermark">Project Void</div>
        </div>
    </div>
    <div class="game-container">
        <iframe id="gameFrame" 
                src="about:blank" 
                frameborder="0" 
                allowfullscreen>
        </iframe>
    </div>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {

            const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
            const gameBar = document.querySelector('.game-bar');
            if (gameBar && settings.gameBarToggle === false) {
                gameBar.style.display = 'none';

                document.querySelector('.game-container').style.height = '100vh';
            }

            const error = localStorage.getItem('lastGameError');
            const success = localStorage.getItem('lastGameSuccess');

            if (error) {
                console.error(error);
                localStorage.removeItem('lastGameError');
            }
            if (success) {
                console.log(success);
                localStorage.removeItem('lastGameSuccess');
            }

            const urlParams = new URLSearchParams(window.location.search);
            const gamePath = urlParams.get('game');
            const gameTitle = urlParams.get('title');
            let timerInterval;
            let totalElapsedTime = 0;
            let lastUpdateTime = Date.now();

            if (gamePath) {
                const gameFrame = document.getElementById('gameFrame');
                gameFrame.src = gamePath;
                document.getElementById('gameTitle').textContent = gameTitle || 'Game';

                if (!isGlobalCloakEnabled()) {
                    document.title = 'Project Void - Playing Game';
                } else {

                    const cloak = getCurrentCloakConfig();
                    document.title = cloak.title;
                    const favicon = document.querySelector('link[rel="icon"]');
                    if (favicon) {
                        favicon.href = cloak.favicon;
                    }
                }

                startTimer();
                setTimeout(() => {
                    window.history.replaceState({}, '', '/display.php');
                }, 100);
            } else {
                window.location.href = 'games.php';
            }

            document.getElementById('fullscreenBtn').addEventListener('click', function() {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            });

            document.addEventListener('fullscreenchange', function() {
                const fullscreenBtn = document.getElementById('fullscreenBtn');
                if (document.fullscreenElement) {
                    fullscreenBtn.innerHTML = '<span class="fullscreen-icon">⮌</span> Exit Fullscreen';
                } else {
                    fullscreenBtn.innerHTML = '<span class="fullscreen-icon">⛶</span> Fullscreen';
                }
            });

            function startTimer() {
                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(updateTimer, 1000);
            }

            function updateTimer() {
                const currentTime = Date.now();
                const newElapsedTime = totalElapsedTime + (currentTime - lastUpdateTime);
                const seconds = Math.floor(newElapsedTime / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;

                document.getElementById('playTime').textContent = 
                    `Session Time: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            }

            window.addEventListener('beforeunload', function() {
                totalElapsedTime += Date.now() - lastUpdateTime;

                let stats = JSON.parse(localStorage.getItem('siteStats')) || {};
                stats.totalPlayTime = (stats.totalPlayTime || 0) + Math.floor(totalElapsedTime / 1000);
                localStorage.setItem('siteStats', JSON.stringify(stats));
            });
        });
    </script>
</body>
</html>