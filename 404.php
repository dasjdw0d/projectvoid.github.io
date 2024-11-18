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
    <title>404 - Page Not Found</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .error-container {
            position: relative;
            z-index: 2;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            text-align: center;
        }

        .error-code {
            font-size: clamp(6rem, 20vw, 12rem);
            color: var(--neon-green);
            text-shadow: 0 0 30px var(--neon-green);
            margin-bottom: 1rem;
            font-weight: 700;
            letter-spacing: 4px;
        }

        .error-message {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            color: white;
            margin-bottom: 2rem;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .error-description {
            font-size: 1.2rem;
            color: #888;
            margin-bottom: 3rem;
            max-width: 600px;
        }

        .home-button {
            display: inline-block;
            padding: 1rem 3rem;
            background: var(--dark-bg);
            border: 1px solid var(--neon-green);
            color: var(--neon-green);
            text-decoration: none;
            border-radius: 30px;
            font-size: 1.2rem;
            font-weight: 600;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 0 15px var(--neon-green);
            text-shadow: 0 0 5px var(--neon-green);
        }

        .home-button:hover {
            transform: scale(0.95);
            box-shadow: 0 0 20px var(--neon-green);
            background: var(--hover-bg);
        }
    </style>
</head>
<body>
    <div id="particles-js"></div>
    <script src="js/site-settings.js"></script>

    <nav>
        <div class="nav-logo">
            <img src="images/favicon.png" alt="Project Void Logo" class="nav-logo-img">
        </div>
        <div class="nav-links">
            <a href="index.php">Home</a>
            <a href="games.php">Games</a>
            <a href="proxy.php">Proxy</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
        </div>
    </nav>

    <div class="error-container">
        <div class="error-code">404</div>
        <h1 class="error-message">Page Not Found</h1>
        <p class="error-description">The page you are looking for could not be found.</p>
        <a href="index.php" class="home-button">Return Home</a>
    </div>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
</body>
</html> 