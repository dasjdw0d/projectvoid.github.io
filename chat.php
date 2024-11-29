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
    <title>Project Void - Chatroom</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/chat.css?v=<?php echo time(); ?>">
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
            <a href="chat.php" class="active">Chatroom</a>
            <a href="ai.php">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>

    <main>
        <div class="chat-container">
            <div class="chat-sidebar">
                <div class="user-profile">
                    <img id="chatProfileImage" src="images/favicon.png" alt="Profile">
                    <span id="chatUsername">Guest</span>
                </div>
                <h3>Online Users</h3>
                <div id="onlineUsers"></div>
            </div>

            <div class="chat-main">
                <div class="chat-header">
                    <h2>Global Chatroom</h2>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be populated by JavaScript -->
                </div>

                <div class="chat-input">
                    <input type="text" id="messageInput" placeholder="Type your message...">
                    <button id="sendMessage">
                        <span class="button-text">Send</span>
                        <span class="button-icon">➤</span>
                    </button>
                </div>
            </div>

            <div class="chat-info-sidebar">
                <div class="info-section profile">
                    <h3>Profile Information</h3>
                    <p>Your profile in this chat room is synced with the profile system on the home page:</p>
                    <ul>
                        <li>To change your username: Go to the home page and click the "Change Username" button</li>
                        <li>To change your profile picture: Go to the home page and click on the pfp image.</li>
                    </ul>
                    <h3>Rules</h3>
                    <ul>
                        <li>Don't be annoying.</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="js/chat.js?v=<?php echo time(); ?>"></script>

    <div id="adminButton" class="admin-button">Admin</div>

    <div id="adminModal" class="modal">
        <div class="modal-content">
            <span id="adminCloseBtn" class="close">&times;</span>
            <h2>Admin Login</h2>
            <form id="adminLoginForm" onsubmit="return false;">
                <input type="text" 
                       id="adminUser" 
                       placeholder="Username" 
                       required 
                       autocomplete="username">
                <input type="password" 
                       id="adminPass" 
                       placeholder="Password" 
                       required 
                       autocomplete="current-password">
                <button type="submit" id="adminLoginBtn">Login</button>
            </form>
        </div>
    </div>

    <div id="adminControls" class="admin-controls" style="display: none;">
        <button id="adminLogoutBtn">Logout</button>
        <button id="clearChatBtn">Clear Chat</button>
        <button id="lockChatBtn">Lock Chat</button>
    </div>
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