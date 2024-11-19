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
            <a href="chat.php">Chatroom</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
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
            title: "Burrito Bison",
            path: "games/burritobison/index.html",
            thumbnail: "games/burritobison/logo.png"
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
            title: "2D Rocket League",
            path: "games/2drocketleague/index.html",
            thumbnail: "games/2drocketleague/unnamed.png"
        },
        {
            title: "Avalanche",
            path: "games/avalanche/index.html",
            thumbnail: "games/avalanche/icon.png"
        },
        {
            title: "Bad Ice Cream",
            path: "games/badicecream/index.html",
            thumbnail: "games/badicecream/bad-ice-cream.png"
        },
        {
            title: "Bad Ice Cream 2",
            path: "games/badicecream2/index.html",
            thumbnail: "games/badicecream2/bad-ice-cream-2.png"
        },
        {
            title: "Bad Ice Cream 3",
            path: "games/badicecream3/index.html",
            thumbnail: "games/badicecream3/bad-ice-cream-3.png"
        },
        {
            title: "Bad Times Simulator",
            path: "games/badtimesimulator/index.html",
            thumbnail: "games/badtimesimulator/icon.png"
        },
        {
            title: "Happy Wheels",
            path: "games/happywheels/index.html",
            thumbnail: "games/happywheels/Untitled.jpeg"
        },
        {
            title: "Red Ball 3",
            path: "games/redball3/index.html",
            thumbnail: "games/redball3/redball3.png"
        },
        {
            title: "Red Ball 4",
            path: "games/redball4/index.html",
            thumbnail: "games/redball4/redball4.webp"
        },
        {
            title: "Roof Top Snipers",
            path: "games/rooftopsnipers/index.html",
            thumbnail: "games/rooftopsnipers/logo.png"
        },
        {
            title: "Roof Top Snipers 2",
            path: "games/rooftopsnipers2/index.html",
            thumbnail: "games/rooftopsnipers2/icon.png"
        },
        {
            title: "Super Hot",
            path: "games/superhot/index.html",
            thumbnail: "games/superhot/icon.png"
        },
        {
            title: "Tetris",
            path: "games/tetris/index.html",
            thumbnail: "games/tetris/icon.png"
        },
        {
            title: "Temple Run 2",
            path: "games/templerun2/index.html",
            thumbnail: "games/templerun2/img/cover.png"
        },
        {
            title: "TABS",
            path: "games/tabs/index.html",
            thumbnail: "games/tabs/unnamed.png"
        },
        {
            title: "The Impossible Game",
            path: "games/theimpossiblegame/index.html",
            thumbnail: "games/theimpossiblegame/image.jpg"
        },
        {
            title: "The Impossible Quiz",
            path: "games/theimpossiblequiz/index.html",
            thumbnail: "games/theimpossiblequiz/tiq.avif"
        },
        {
            title: "Solitaire",
            path: "games/solitaire/index.html",
            thumbnail: "games/solitaire/cover.svg"
        },
        {
            title: "Soccer Random",
            path: "games/soccerrandom/index.html",
            thumbnail: "games/soccerrandom/test.png"
        },
        {
            title: "Stickman Hook",
            path: "games/stickman-hook/index.html",
            thumbnail: "games/stickman-hook/icon.jpg"
        },
        {
            title: "Worlds Hardest Game",
            path: "games/worldshardestgame/index.html",
            thumbnail: "games/worldshardestgame/icon.png"
        },
        {
            title: "Worlds Hardest Game 2",
            path: "games/worldhardestgame2/index.html",
            thumbnail: "games/worldhardestgame2/icon.jpg"
        },
        {
            title: "Wordle",
            path: "games/wordle/index.html",
            thumbnail: "games/wordle/icon.png"
        },
        {
            title: "Tiny Fishing",
            path: "games/tinyfishing/index.html",
            thumbnail: "games/tinyfishing/thumb.png"
        },
        {
            title: "Subway Surfers NY",
            path: "games/subway-surfers-ny/index.html",
            thumbnail: "games/subway-surfers-ny/NewYorkIcon.png"
        },









        {
            title: "Time Shooter 1",
            path: "games/timeshooter1/index.html",
            thumbnail: "games/timeshooter1/logo.png"
        },
        {
            title: "Time Shooter 2",
            path: "games/timeshooter2/index.html",
            thumbnail: "games/timeshooter2/logo.jpg"
        },
        {
            title: "Time Shooter 3",
            path: "games/timeshooter3/index.html",
            thumbnail: "games/timeshooter3/logo.png"
        },
        {
            title: "Papas Burgeria",
            path: "games/papasburgeria/index.html",
            thumbnail: "games/papasburgeria/icon.png"
        },
        {
            title: "Papas Freezeria",
            path: "games/papasfreezeria/index.html",
            thumbnail: "games/papasfreezeria/image.png"
        },
        {
            title: "BTD 1",
            path: "games/btd/index.html",
            thumbnail: "games/btd/logo.webp"
        },
        {
            title: "BTD 2",
            path: "games/btd2/index.html",
            thumbnail: "games/btd2/logo.webp"
        },
        {
            title: "BTD 3",
            path: "games/btd3/index.html",
            thumbnail: "games/btd3/icon.png"
        },
        {
            title: "BTD 4",
            path: "games/btd4/index.html",
            thumbnail: "games/btd4/logo.jpg"
        },
        {
            title: "BTD 5",
            path: "games/btd5/index.html",
            thumbnail: "games/btd5/wogo.png"
        },
        {
            title: "BTD 6",
            path: "games/btd6/index.html",
            thumbnail: "games/btd6/uwu.png"
        },
        {
            title: "Circloo",
            path: "games/circloo/index.html",
            thumbnail: "games/circloo/icon.png"
        },
        {
            title: "Cluster Rush",
            path: "games/cluster-rush/index.html",
            thumbnail: "games/cluster-rush/splash.png"
        },
        {
            title: "Friday Night Funkin",
            path: "games/fridaynightfunkin/index.html",
            thumbnail: "games/fridaynightfunkin/fnf-icon.jpg"
        },
        {
            title: "Fruit Ninja",
            path: "games/fruitninja/index.html",
            thumbnail: "games/fruitninja/FruitNinjaTeaser.jpg"
        },
        {
            title: "Osu",
            path: "games/osu/index.html",
            thumbnail: "games/osu/icon.png"
        },
        {
            title: "Pizza Tower",
            path: "games/pizzatower/index.html",
            thumbnail: "games/pizzatower/logo.png"
        },
        {
            title: "Pacman",
            path: "games/pacman/index.html",
            thumbnail: "games/pacman/icon.png"
        },
        {
            title: "Paper.io",
            path: "games/paperio/index.html",
            thumbnail: "games/paperio/icon.png"
        },
        {
            title: "Sand Game",
            path: "games/sandgame/index.html",
            thumbnail: "games/sandgame/icon.png"
        },
        {
            title: "Skibidi Toilet",
            path: "games/skibiditoilet/index.html",
            thumbnail: "games/skibiditoilet/logo.png"
        },
        {
            title: "Skibidi Toilet Attack",
            path: "games/skibiditoiletattack/index.html",
            thumbnail: "games/skibiditoiletattack/logo.png"
        },
        {
            title: "Riddle School 1",
            path: "games/riddleschool/index.html",
            thumbnail: "games/riddleschool/RiddleSchool2.png"
        },
        {
            title: "Riddle School 2",
            path: "games/riddleschool2/index.html",
            thumbnail: "games/riddleschool2/icon.png"
        },
        {
            title: "Riddle School 3",
            path: "games/riddleschool3/index.html",
            thumbnail: "games/riddleschool3/riddle-school-3.webp"
        },
        {
            title: "Riddle School 4",
            path: "games/riddleschool4/index.html",
            thumbnail: "games/riddleschool4/Untitled.jpeg"
        },
        {
            title: "Riddle School 5",
            path: "games/riddleschool5/index.html",
            thumbnail: "games/riddleschool5/Untitled.jpeg"
        },
        {
            title: "Helix Jump",
            path: "games/helixjump/index.html",
            thumbnail: "games/helixjump/gameIcon.png"
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
                    <img src="${game.thumbnail}" 
                         alt="${game.title}"
                         loading="lazy">
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
        
        // Clear existing games
        gamesGrid.innerHTML = '';
        
        // Add new games for current page
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
        
        // Scroll to top of games grid
        document.querySelector('.games-header').scrollIntoView({ behavior: 'smooth' });
        
        // Update display with new page
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