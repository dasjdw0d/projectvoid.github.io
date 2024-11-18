<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-88VFMZRZHX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-88VFMZRZHX');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="images/favicon.png">
    <title>Project Void - Playing Game</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/display.css?v=<?php echo time(); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
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

    <script src="js/site-settings.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
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
                document.title = 'Project Void - Playing Game';
                startTimer();
                setTimeout(() => {
                    window.history.replaceState({}, '', '/display.php');
                }, 100);
            } else {
                window.location.href = 'games.php';
            }

            // Fullscreen functionality
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

            // Timer functionality
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

            // Cleanup on page unload
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
