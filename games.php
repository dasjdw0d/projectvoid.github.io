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
    <?php include 'loading-screen.php'; ?>

    <nav>
        <div class="nav-logo">
            <img src="images/favicon.png" alt="Project Void Logo" class="nav-logo-img">
        </div>
        <div class="nav-links">
            <a href="index.php">Home</a>
            <a href="games.php" class="active">Games</a>
            <a href="chat.php">Chatroom</a>
            <a href="ai.php">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>

    <main>
        <div id="pinnedGamesSection"></div>
        <div class="games-header">
            <div class="title-section">
                <h1 class="section-title">Games Library</h1>
                <p class="pin-instruction">(Right click any game to pin the game at the top of the page)</p>
            </div>
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Search games...">
                <button onclick="searchGames()">Search</button>
            </div>
        </div>
        <div class="games-grid" id="gamesGrid">
        </div>
        <div class="pages-title">Pages</div>
        <div class="pagination">
            <button>←</button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>→</button>
        </div>
    </main>

    <script>
    const GAMES_PER_PAGE = 40;
    let currentPage = 1;

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
            title: "Little Alchemy 2",
            path: "games/littlealchemy2/index.html",
            thumbnail: "games/littlealchemy2/logo.png"
        },
        {
            title: "Drift Hunters",
            path: "games/drifthunters/index.html",
            thumbnail: "games/drifthunters/icon.png"
        },
        {
            title: "Burrito Bison",
            path: "games/burritobison/index.html",
            thumbnail: "games/burritobison/logo.png"
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
            title: "Eggy Car",
            path: "games/eggycar/index.html",
            thumbnail: "games/eggycar/logo.png"
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
            title: "Idle Dice",
            path: "games/idle-dice/index.html",
            thumbnail: "games/idle-dice/icon.png"
        },
        {
            title: "Avalanche",
            path: "games/avalanche/index.html",
            thumbnail: "games/avalanche/icon.png"
        },
        {
            title: "Poly Track",
            path: "games/polytrack/index.html",
            thumbnail: "games/polytrack/logo.png"
        },
        {
            title: "Cookie Clicker",
            path: "games/cookieclicker/index.html",
            thumbnail: "games/cookieclicker/logo.png"
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
            title: "Learn To Fly Idle",
            path: "games/learntoflyidle/index.html",
            thumbnail: "games/learntoflyidle/icon.jpg"
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
            title: "Gun Spin",
            path: "games/gunspin/index.html",
            thumbnail: "games/gunspin/icon.png"
        },
        {
            title: "House of Hazards",
            path: "games/house-of-hazards/index.html",
            thumbnail: "games/house-of-hazards/icon.png"
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
            title: "Tiny Fishing",
            path: "games/tinyfishing/index.html",
            thumbnail: "games/tinyfishing/thumb.png"
        },











        
        {
            title: "Bit Life",
            path: "games/bitlife/index.html",
            thumbnail: "games/bitlife/logo.png"
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
            title: "Super Hot",
            path: "games/superhot/index.html",
            thumbnail: "games/superhot/icon.png"
        },
        {
            title: "Tetris",
            path: "games/tetris/index.html",
            thumbnail: "games/tetris/logo.png"
        },
        {
            title: "Tetris Sand",
            path: "games/tetris-sand/index.html",
            thumbnail: "games/tetris-sand/logo.png"
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
            title: "Papas Cupcakeria",
            path: "games/papas-cupcakeria/index.html",
            thumbnail: "games/papas-cupcakeria/icon.png"
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
            title: "Paper.io 2",
            path: "games/paperio2/index.html",
            thumbnail: "games/paperio2/logo.png"
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
        {
            title: "Block Blast Puzzle",
            path: "games/block-blast-puzzle/index.html",
            thumbnail: "games/block-blast-puzzle/logo.png"
        },
        {
            title: "Doge Miner",
            path: "games/doge-miner/index.html",
            thumbnail: "games/doge-miner/logo.png"
        },
        {
            title: "Draw The Hill",
            path: "games/draw-the-hill/index.html",
            thumbnail: "games/draw-the-hill/icon.png"
        },
        {
            title: "Stack",
            path: "games/stack/index.html",
            thumbnail: "games/stack/logo.png"
        },
        {
            title: "Getaway Shootout",
            path: "games/getaway-shootout/index.html",
            thumbnail: "games/getaway-shootout/icon.png"
        },
        {
            title: "Gun Mayhem",
            path: "games/gun-mayhem/index.html",
            thumbnail: "games/gun-mayhem/icon.png"
        },
        {
            title: "Pandemic 2",
            path: "games/pandemic2/index.html",
            thumbnail: "games/pandemic2/icon.png"
        },
        {
            title: "Stack Bump 3D",
            path: "games/stackbump/index.html",
            thumbnail: "games/stackbump/thumbnail.jpg"
        },
        {
            title: "Stickman Golf",
            path: "games/stickman-golf/index.html",
            thumbnail: "games/stickman-golf/splash.png"
        },
        {
            title: "Volleyrandom",
            path: "games/volleyrandom/index.html",
            thumbnail: "games/volleyrandom/icon.png"
        },
        {
            title: "A Dance of Fire & Ice",
            path: "games/a-dance-of-fire-and-ice/index.html",
            thumbnail: "games/a-dance-of-fire-and-ice/logo.png"
        },
        {
            title: "Merge Round Racers",
            path: "games/merge-round-racers/index.html",
            thumbnail: "games/merge-round-racers/logo.png"
        },
        {
            title: "Bloxorz",
            path: "games/bloxorz/index.html",
            thumbnail: "games/bloxorz/logo.jpg"
        },
        {
            title: "Boxing Random",
            path: "games/boxing-random/index.html",
            thumbnail: "games/boxing-random/logo.png"
        },
        {
            title: "Backrooms",
            path: "games/backrooms/index.html",
            thumbnail: "games/backrooms/logo.png"
        },
        {
            title: "Glass City",
            path: "games/glass-city/index.html",
            thumbnail: "games/glass-city/logo.png"
        },
        {
            title: "Aqua Park",
            path: "games/aquapark/index.html",
            thumbnail: "games/aquapark/splash.png"
        },
        {
            title: "Big Red Button",
            path: "games/bigredbutton/index.html",
            thumbnail: "games/bigredbutton/bigredbutton.png"
        },
        {
            title: "Town Scaper",
            path: "games/townscaper/index.html",
            thumbnail: "games/townscaper/logo.png"
        },
        {
            title: "Cell Machine",
            path: "games/cell-machine/index.html",
            thumbnail: "games/cell-machine/img/icon.png"
        },
        {
            title: "Break Lock",
            path: "games/breaklock/index.html",
            thumbnail: "games/breaklock/logo.png"
        },
    ];

    let filteredGames = [...games]; 

    window.pinnedGames = JSON.parse(localStorage.getItem('pinnedGames') || '[]');

    function togglePinGame(event, gameTitle) {
        event.preventDefault(); 

        window.pinnedGames = JSON.parse(localStorage.getItem('pinnedGames') || '[]');
        const gameIndex = window.pinnedGames.findIndex(game => game.title === gameTitle);

        if (gameIndex === -1) {

            const gameToPin = games.find(game => game.title === gameTitle);
            if (gameToPin) {
                window.pinnedGames.push(gameToPin);
                showToast('Game pinned!');
            }
        } else {

            window.pinnedGames.splice(gameIndex, 1);
            showToast('Game unpinned!');
        }

        localStorage.setItem('pinnedGames', JSON.stringify(window.pinnedGames));

        updateDisplay();

        return false; 
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }, 100);
    }

    function searchGames() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            filteredGames = games; 
        } else {
            filteredGames = games.filter(game => 
                game.title.toLowerCase().includes(searchTerm)
            );
        }

        currentPage = 1; 
        updateDisplay();
    }

    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchGames();
        }
    });

    function createGameCards(gamesSubset) {
        return gamesSubset.map(game => {
            const title = game.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const path = encodeURIComponent(game.path);
            const thumbnail = encodeURIComponent(game.thumbnail);
            const isPinned = window.pinnedGames.some(pinned => pinned.title === title);

            return `
                <a href="#" 
                   class="game-card ${isPinned ? 'pinned' : ''}" 
                   data-title="${title}"
                   data-game="${path}"
                   onclick="handleGameClick(event, '${title}', '${path}')"
                   oncontextmenu="togglePinGame(event, '${title}')">
                    <div class="game-thumbnail">
                        <img src="${thumbnail}" 
                             alt="${title}" 
                             loading="lazy">
                        ${isPinned ? '<div class="pin-indicator">📌</div>' : ''}
                    </div>
                    <div class="game-info">
                        <h3>${title}</h3>
                    </div>
                </a>
            `;
        }).join('');
    }

    async function handleGameClick(event, title, path) {
        event.preventDefault();

        try {

            let stats = JSON.parse(localStorage.getItem('siteStats') || '{}');
            stats.lastGame = title;
            localStorage.setItem('siteStats', JSON.stringify(stats));

            window.location.href = `display.php?game=${path}&title=${encodeURIComponent(title)}`;
        } catch (error) {
            console.error('Error:', error);
            window.location.href = `display.php?game=${path}&title=${encodeURIComponent(title)}`;
        }
    }

    function updateDisplay() {

        const pinnedGamesSection = document.getElementById('pinnedGamesSection');
        if (window.pinnedGames.length > 0) {
            pinnedGamesSection.innerHTML = `
                <div class="games-header">
                    <h1 class="section-title">Pinned Games</h1>
                </div>
                <div class="games-grid">${createGameCards(window.pinnedGames)}</div>
            `;
            pinnedGamesSection.style.display = 'block';
        } else {
            pinnedGamesSection.style.display = 'none';
        }

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

        pagination.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => changePage('prev'));
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (currentPage === i) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => changePage(i));
            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => changePage('next'));
        pagination.appendChild(nextButton);
    }

    function changePage(page) {
        const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

        if (page === 'prev') {
            currentPage = Math.max(1, currentPage - 1);
        } else if (page === 'next') {
            currentPage = Math.min(totalPages, currentPage + 1);
        } else if (typeof page === 'number' && page >= 1 && page <= totalPages) {
            currentPage = page;
        } else {
            console.error('Invalid page number:', page);
            return;
        }

        document.querySelector('.games-header').scrollIntoView({ behavior: 'smooth' });

        updateDisplay();
    }

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