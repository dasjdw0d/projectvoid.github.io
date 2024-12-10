<?php
$page = "Chatroom";
define('allowed', true);
include 'header.php';
?>
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
                    <span id="chatResetTimer" class="chat-reset-timer">Chat Reset: 0m 0s</span>
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
                    <p>Your profile in this chat room is synced with the profile system on the home page.</p>
                    <ul>
                        <li>To change your username go to the home page and click the "Change Username" button</li>
                        <li>To change your profile picture go to the home page and click on the pfp image.</li>
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