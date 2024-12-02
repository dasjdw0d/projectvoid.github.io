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
    <title>Project Void - Home</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/home.css?v=<?php echo time(); ?>">
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
            <a href="index.php" class="active">Home</a>
            <a href="games.php">Games</a>
            <a href="chat.php">Chatroom</a>
            <a href="ai.php">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>
    <div class="online-counter">
        <span id="onlineCount">Loading...</span> Global Users Online
    </div>
    <div class="online-graph">
        <div class="graph-label">Updates every 30 seconds. Stores 20 min of history.</div>
        <div class="graph-bars"></div>
        <div class="graph-tooltip"><span></span></div>
    </div>

    <main>
        <div class="top-section">
            <div class="user-section">
                <div class="user-header">
                    <div class="user-info">
                        <img id="profileImage" src="images/favicon.png" alt="Profile Picture" title="Click to change profile picture">
                        <div class="user-details">
                            <h3>Welcome, <span id="usernameDisplay">Loading...</span></h3>
                        </div>
                    </div>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📊</span>
                            <span id="visitCount">Loading...</span>
                            <span class="stat-label">Home Visits</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">🎮</span>
                            <span id="lastGameDisplay">Loading...</span>
                            <span class="stat-label">Last Played</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⏱️</span>
                            <span id="totalPlayTime">Loading...</span>
                            <span class="stat-label">Play Time</span>
                        </div>
                    </div>
                </div>
                <div class="user-actions">
                    <div class="primary-actions">
                        <button class="action-btn" id="setUsernameBtn">Change Username</button>
                    </div>
                    <button class="action-btn danger" id="clearDataBtn">Clear Data</button>
                </div>
                <p class="privacy-notice">All data is stored locally in your browser</p>
            </div>
            <div class="hero">
                <div class="logo-card">
                    <img src="images/newlogo.png" alt="Project Void Logo">
                </div>
                <h1>PROJECT VOID</h1>
                <div class="subtitle-group">
                    <p class="tagline">Global Home Visits</p>
                    <img src="https://hitwebcounter.com/counter/counter.php?page=17411431&style=0025&nbdigits=5&type=page&initCount=0" title="Counter Widget" Alt="Visit counter For Websites" border="0" />
                </div>
                <button class="about-blank-btn" onclick="openInAboutBlank()">Open in about:blank</button>
            </div>
        </div>
    </main>
    <script>
    function openInAboutBlank() {
        (function () {
            var url = "https://projectvoid.is-not-a.dev";

            // Open a new about:blank window
            var win = window.open();

            // Create an iframe
            var iframe = win.document.createElement('iframe');

            // Set styles for the iframe
            iframe.style = "position:fixed;width:100vw;height:100vh;top:0px;left:0px;right:0px;bottom:0px;z-index:2147483647;background-color:black;border:none;";

            // Check and assign the URL to the iframe
            if (url.includes('https://') || url.includes("http://")) {
                iframe.src = url;
            } else {
                iframe.src = "https://" + url;
            }

            // Append the iframe to the body of the window
            win.document.body.appendChild(iframe);
        })();

        // Redirect to google
        window.location.href = "https://google.com";
    }
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
