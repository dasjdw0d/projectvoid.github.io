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
    <title>Project Void - Settings</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/settings.css?v=<?php echo time(); ?>">
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
            <a href="games.php">Games</a>
            <a href="proxy.php">Proxy</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php" class="active">Settings</a>
        </div>
    </nav>

    <main>
        <div class="settings-container">
            <h1>Settings</h1>
            <div class="settings-grid">
                <div class="settings-card">
                    <div class="setting-header">
                        <h3>Particle Background</h3>
                        <label class="toggle">
                            <input type="checkbox" id="particleToggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="setting-description">Toggle the particle effects background. When particle background is off you may experience lag, the glitch is being fixed.</p>
                </div>

                <div class="settings-card">
                    <div class="setting-header">
                        <h3>Custom Cursor</h3>
                        <label class="toggle">
                            <input type="checkbox" id="cursorToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="setting-description">Enable a neon green themed custom cursor.</p>
                </div>

                <div class="settings-card">
                    <div class="setting-header">
                        <h3>Clickoff Cloaking</h3>
                        <label class="toggle">
                            <input type="checkbox" id="cloakingToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="setting-description">Disguise the tab to a website of your choice when you switch browser tabs.</p>
                    <div class="cloak-options" id="clickoffCloakOptions">
                        <select id="clickoffCloakSelect" class="cloak-select">
                            <option value="google">Google Search</option>
                            <option value="gmail">Gmail</option>
                            <option value="docs">Google Docs</option>
                            <option value="drive">Google Drive</option>
                            <option value="classroom">Google Classroom</option>
                            <option value="brainpop">BrainPOP</option>
                        </select>
                    </div>
                </div>

                <div class="settings-card">
                    <div class="setting-header">
                        <h3>Global Tab Cloaking</h3>
                        <label class="toggle">
                            <input type="checkbox" id="globalCloakToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="setting-description">Disguises the tab as another website of your choice.</p>
                    <div class="cloak-options" id="globalCloakOptions">
                        <select id="globalCloakSelect" class="cloak-select">
                            <option value="google">Google Search</option>
                            <option value="gmail">Gmail</option>
                            <option value="docs">Google Docs</option>
                            <option value="drive">Google Drive</option>
                            <option value="classroom">Google Classroom</option>
                            <option value="brainpop">BrainPOP</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js"></script>
    <script src="js/site-settings.js"></script>
    <script>
        particlesJS('particles-js', particlesConfig);
    </script>
</body>
</html> 