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
    <title>Project Void - Games</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/games.css?v=<?php echo time(); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="particles-js"></div>

    <nav>
        <div class="nav-logo">
            <img src="images/favicon.png" alt="Project Void Logo" class="nav-logo-img">
        </div>
        <div class="nav-links">
            <a href="index.php">Home</a>
            <a href="games.php" class="active">Games</a>
            <a href="proxy.php">Proxy</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
        </div>
    </nav>

    <main>
        <div class="games-header">
            <h1>Games Library</h1>
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Search games...">
                <button onclick="searchGames()">Search</button>
            </div>
        </div>

        <div class="games-grid" id="gamesGrid">
            <!-- Games will be added here dynamically -->
        </div>

        <div class="pagination">
            <button>←</button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>→</button>
        </div>
    </main>

    <script>
    const GAMES_PER_PAGE = 40; // Changed from 24 to 32 games per page
    let currentPage = 1;
    
    // Your existing games array
    const games = [
        {
            title: "Slope",
            path: "games/slope/index.html",
            thumbnail: "games/slope/slope4.jpeg"
        },
        {
            title: "Snow Rider 3D",
            path: "games/snowrider3d/index.html",
            thumbnail: "games/snowrider3d/icon.png"
        },
        {
            title: "Retro Bowl",
            path: "games/retro-bowl/index.html",
            thumbnail: "games/retro-bowl/icon.png"
        },
        {
            title: "Retro Bowl College",
            path: "games/retrobowlcollege/index.html",
            thumbnail: "games/retrobowlcollege/unnamed.png"
        },
        {
            title: "Tunnel Rush",
            path: "games/tunnel-rush/index.html",
            thumbnail: "games/tunnel-rush/tunnel-rush.png"
        },
        {
            title: "Drift Hunters",
            path: "games/drifthunters/index.html",
            thumbnail: "games/drifthunters/icon.png"
        },
        {
            title: "Run 3",
            path: "games/run3/index.html",
            thumbnail: "games/run3/icon.jpeg"
        },
        {
            title: "Run 2",
            path: "games/run2/index.html",
            thumbnail: "games/run2/icon.jpg"
        },
        {
            title: "Run",
            path: "games/run/index.html",
            thumbnail: "games/run/icon.jpeg"
        },
        {
            title: "Drift Boss",
            path: "games/drift-boss/index.html",
            thumbnail: "games/drift-boss/icon.png"
        },
        {
            title: "Drive Mad",
            path: "games/drivemad/index.html",
            thumbnail: "games/drivemad/icon.png"
        },
        {
            title: "MotoX3M",
            path: "games/motox3m/index.html",
            thumbnail: "games/motox3m/icon.png"
        },
        {
            title: "MotoX3M Pool",
            path: "games/motox3m-pool/index.html",
            thumbnail: "games/motox3m-pool/splash.jpg"
        },
        {
            title: "MotoX3M Spooky",
            path: "games/motox3m-spooky/index.html",
            thumbnail: "games/motox3m-spooky/splash.jpeg"
        },
        {
            title: "MotoX3M Winter",
            path: "games/motox3m-winter/index.html",
            thumbnail: "games/motox3m-winter/download.jpeg"
        },
        {
            title: "2048",
            path: "games/2048/index.html",
            thumbnail: "games/2048/icon.png"
        },
        {
            title: "Basketball Stars",
            path: "games/basketball-stars/index.html",
            thumbnail: "games/basketball-stars/icon.png"
        },
        {
            title: "Idle Breakout",
            path: "games/idlebreakout/index.html",
            thumbnail: "games/idlebreakout/image.png"
        },
        {
            title: "Learn To Fly",
            path: "games/learntofly/index.html",
            thumbnail: "games/learntofly/icon.png"
        },
        {
            title: "Learn To Fly 2",
            path: "games/learntofly2/index.html",
            thumbnail: "games/learntofly2/logo.jpg"
        },
        {
            title: "Learn To Fly 3",
            path: "games/learntofly3/index.html",
            thumbnail: "games/learntofly3/icon.png"
        },
        {
            title: "Learn To Fly Idle",
            path: "games/learntoflyidle/index.html",
            thumbnail: "games/learntoflyidle/icon.jpg"
        },
        {
            title: "OvO",
            path: "games/ovo/index.html",
            thumbnail: "games/ovo/ovo.png"
        },
        {
            title: "Monkey Mart",
            path: "games/monkeymart/index.html",
            thumbnail: "games/monkeymart/unnamed.png"
        },
        {
            title: "Rise Higher",
            path: "games/risehigher/index.html",
            thumbnail: "games/risehigher/icon.png"
        },
        {
            title: "Duck Life 1",
            path: "games/ducklife1/index.html",
            thumbnail: "games/ducklife1/ducklife1.png"
        },
        {
            title: "Duck Life 2",
            path: "games/ducklife2/index.html",
            thumbnail: "games/ducklife2/ducklife2.png"
        },
        {
            title: "Duck Life 3",
            path: "games/ducklife3/index.html",
            thumbnail: "games/ducklife3/ducklife3.png"
        },
        {
            title: "Duck Life 4",
            path: "games/ducklife4/index.html",
            thumbnail: "games/ducklife4/icon.png"
        },
        {
            title: "Duck Life 5",
            path: "games/ducklife5/index.html",
            thumbnail: "games/ducklife5/ducklife5.png"
        },
        {
            title: "Death Run 3D",
            path: "games/death-run-3d/index.html",
            thumbnail: "games/death-run-3d/logo.png"
        },
        {
            title: "Ahievement Unlocked",
            path: "games/achieveunlocked/index.html",
            thumbnail: "games/achieveunlocked/icon.png"
        },
        {
            title: "Ahievement Unlocked 2",
            path: "games/achieveunlocked2/index.html",
            thumbnail: "games/achieveunlocked2/icon.png"
        },
        {
            title: "Bit Life",
            path: "games/bitlife/index.html",
            thumbnail: "games/bitlife/logo.png"
        },
        {
            title: "Basket Random",
            path: "games/basketrandom/index.html",
            thumbnail: "games/basketrandom/test.png"
        },
        {
            title: "Cube Field",
            path: "games/cubefield/index.html",
            thumbnail: "games/cubefield/logo.png"
        },
        {
            title: "CSGO Clicker",
            path: "games/csgoclicker/index.html",
            thumbnail: "games/csgoclicker/logo.png"
        },
        {
            title: "Cut The Rope",
            path: "games/cuttherope/index.html",
            thumbnail: "games/cuttherope/icon.png"
        },
        {
            title: "Cut The Rope Holiday",
            path: "games/cuttherope-holiday/index.html",
            thumbnail: "games/cuttherope-holiday/icon.png"
        },
        {
            title: "Crossy Road Space",
            path: "games/crossyroadspace/index.html",
            thumbnail: "games/crossyroadspace/crossyroad.png"
        },







        {
            title: "Flappy Bird",
            path: "games/flappybird/index.html",
            thumbnail: "games/flappybird/icon.png"
        },
        {
            title: "FNAF 1",
            path: "games/fnaf1/index.html",
            thumbnail: "games/fnaf1/splash.jpg"
        },
        {
            title: "FNAF 2",
            path: "games/fnaf1/index.html",
            thumbnail: "games/fnaf1/splash.jpg"
        },
        {
            title: "FNAF 3",
            path: "games/fnaf1/index.html",
            thumbnail: "games/fnaf1/splash.jpg"
        },
        {
            title: "FNAF 4",
            path: "games/fnaf1/index.html",
            thumbnail: "games/fnaf1/splash.jpg"
        },
        {
            title: "Vex 1",
            path: "games/vex1/index.html",
            thumbnail: "games/vex1/icon.png"
        },
        {
            title: "Vex 2",
            path: "games/vex2/index.html",
            thumbnail: "games/vex2/icon.png"
        },
        {
            title: "Vex 3",
            path: "games/vex3/index.html",
            thumbnail: "games/vex3/icon.png"
        },
        {
            title: "Vex 4",
            path: "games/vex4/index.html",
            thumbnail: "games/vex4/vex4.png"
        },
        {
            title: "Vex 5",
            path: "games/vex5/index.html",
            thumbnail: "games/vex5/icon.png"
        },
        {
            title: "Vex 6",
            path: "games/vex6/index.html",
            thumbnail: "games/vex6/icon.png"
        },
        {
            title: "Vex 7",
            path: "games/vex7/index.html",
            thumbnail: "games/vex7/icon.jpeg"
        },
        {
            title: "Among Us",
            path: "games/amongus/index.html",
            thumbnail: "games/amongus/logo.png"
        },
        {
            title: "Jetpack Joyride",
            path: "games/jetpackjoyride/index.html",
            thumbnail: "games/jetpackjoyride/logo.jpeg"
        },
        {
            title: "Hole.io",
            path: "games/holeio/index.html",
            thumbnail: "games/holeio/icon.png"
        },
        {
            title: "Game",
            path: "games/game/index.html",
            thumbnail: "games/game/icon.png"
        },
        {
            title: "Game",
            path: "games/game/index.html",
            thumbnail: "games/game/icon.png"
        },
        {
            title: "Game",
            path: "games/game/index.html",
            thumbnail: "games/game/icon.png"
        },
        {
            title: "Game",
            path: "games/game/index.html",
            thumbnail: "games/game/icon.png"
        },
        {
            title: "Game",
            path: "games/game/index.html",
            thumbnail: "games/game/icon.png"
        },

    ];

    let filteredGames = [...games]; // Copy of games array for filtering

    function searchGames() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.toLowerCase();
        
        filteredGames = games.filter(game => 
            game.title.toLowerCase().includes(searchTerm)
        );
        
        currentPage = 1; // Reset to first page when searching
        updateDisplay();
    }

    // Remove the old debounce listener and add enter key listener
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchGames();
        }
    });

    function createGameCards(gamesSubset) {
        return gamesSubset.map(game => `
            <a href="display.php?game=${encodeURIComponent(game.path)}&title=${encodeURIComponent(game.title)}" 
               class="game-card" 
               data-title="${game.title}" 
               onclick="updateLastGame('${game.title}')">
                <div class="game-thumbnail">
                    <img loading="lazy" src="${game.thumbnail}" alt="${game.title}">
                </div>
                <div class="game-info">
                    <h3>${game.title}</h3>
                </div>
            </a>
        `).join('');
    }

    function updateDisplay() {
        const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
        const endIndex = startIndex + GAMES_PER_PAGE;
        const gamesSubset = filteredGames.slice(startIndex, endIndex);
        
        const gamesGrid = document.getElementById('gamesGrid');
        gamesGrid.innerHTML = createGameCards(gamesSubset);
        
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
        const pagination = document.querySelector('.pagination');
        
        let paginationHTML = `
            <button onclick="changePage('prev')" ${currentPage === 1 ? 'disabled' : ''}>←</button>
        `;

        // Show all page numbers without ellipsis
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button 
                    onclick="changePage(${i})" 
                    class="${currentPage === i ? 'active' : ''}"
                >${i}</button>
            `;
        }

        paginationHTML += `
            <button onclick="changePage('next')" ${currentPage === totalPages ? 'disabled' : ''}>→</button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    function changePage(page) {
        const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
        
        if (page === 'prev') {
            currentPage = Math.max(1, currentPage - 1);
        } else if (page === 'next') {
            currentPage = Math.min(totalPages, currentPage + 1);
        } else {
            currentPage = page;
        }
        
        updateDisplay();
    }

    // Initial display
    updateDisplay();
    </script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script src="js/stats.js?v=<?php echo time(); ?>"></script>
    <footer>
        <div class="footer-content">
            <p class="footer-text">© 2024 Project Void. All rights reserved.</p>
            <a class="copyrighted-badge" title="Copyrighted.com Registered &amp; Protected" target="_blank" href="https://app.copyrighted.com/website/yNoVAq8F1q2ddpgE">
                <img alt="Copyrighted.com Registered &amp; Protected" border="0" width="125" height="25" srcset="https://static.copyrighted.com/badges/125x25/02_1_2x.png 2x" src="https://static.copyrighted.com/badges/125x25/02_1.png">
            </a>
            <script src="https://static.copyrighted.com/badges/helper.js"></script>
        </div>
    </footer>
</body>
</html> 