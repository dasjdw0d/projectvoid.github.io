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
    <title>Project Void - AI Chat</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="css/ai.css?v=<?php echo time(); ?>">
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
            <a href="games.php">Games</a>
            <a href="chat.php">Chatroom</a>
            <a href="ai.php" class="active">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>

    <main>
        <div class="ai-container">
            <div class="ai-chat">
                <div class="chat-messages" id="aiMessages">
                    <!-- Messages will appear here -->
                </div>
                <div class="chat-input">
                    <input type="text" id="userInput" placeholder="Ask me anything...">
                    <button id="sendButton">Send</button>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="footer-content">
            <p class="footer-text">© 2024 Project Void. All rights reserved.</p>
            <a class="copyrighted-badge" title="Copyrighted.com Registered &amp; Protected" target="_blank" href="https://app.copyrighted.com/website/yNoVAq8F1q2ddpgE">
                <img alt="Copyrighted.com Registered &amp; Protected" border="0" width="125" height="25" srcset="https://static.copyrighted.com/badges/125x25/02_1_2x.png 2x" src="https://static.copyrighted.com/badges/125x25/02_1.png">
            </a>
            <script src="https://static.copyrighted.com/badges/helper.js"></script>
        </div>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script src="js/ai-chat.js?v=<?php echo time(); ?>"></script>
</body>
</html> 