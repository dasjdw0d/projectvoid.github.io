<?php
$page = "AI Chat";
define('allowed', true);
include 'header.php';
?>

    <main>
        <div class="ai-container">
            <div class="ai-chat">
                <div class="chat-messages" id="aiMessages">
                    <!-- Messages will appear here -->
                </div>
                <div class="chat-input">
                    <div class="input-wrapper">
                        <input type="text" id="userInput" placeholder="Ask me anything..." maxlength="500">
                        <div class="char-counter">0/500</div>
                    </div>
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