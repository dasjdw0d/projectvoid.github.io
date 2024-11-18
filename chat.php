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
    <title>Project Void - Chat</title>
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
            <a href="proxy.php">Proxy</a>
            <a href="forms.php">Forms</a>
            <a href="chat.php" class="active">Chat</a>
            <a href="settings.php">Settings</a>
        </div>
    </nav>

    <main>
        <div class="chat-container">
            <div class="chat-sidebar">
                <div class="user-profile">
                    <img id="chatProfileImage" src="images/favicon.png" alt="Profile Picture">
                    <h3 id="chatUsername">Loading...</h3>
                    <span class="status-badge online">Online</span>
                </div>
                <div class="online-users">
                    <h3>Online Users</h3>
                    <div class="users-list" id="onlineUsers">
                        <!-- Users will be populated by JavaScript -->
                    </div>
                </div>
            </div>
            
            <div class="chat-main">
                <div class="chat-header">
                    <h2>Global Chat</h2>
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
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="js/chat.js?v=<?php echo time(); ?>"></script>

    <div id="adminButton" class="admin-button">Admin</div>

    <div id="adminModal" class="admin-modal">
        <div class="admin-modal-content">
            <h2>Admin Login</h2>
            <input type="text" id="adminUser" placeholder="Username">
            <input type="password" id="adminPass" placeholder="Password">
            <button id="adminLoginBtn">Login</button>
            <button id="adminCloseBtn">Close</button>
        </div>
    </div>

    <div id="adminControls" class="admin-controls" style="display: none;">
        <button id="adminLogoutBtn">Logout</button>
        <button id="clearChatBtn">Clear Chat</button>
    </div>
</body>
</html> 