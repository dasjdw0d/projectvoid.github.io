<?php
$page = "Misc";
define('allowed', true);
include 'header.php';
?>

    <main>
        <div class="content-container">
            <h1>Misc</h1>

            <div class="hack-container">
                <div class="hack-card">
                    <div class="hack-content">
                        <h3>Project Void - Blooket Hacks</h3>
                        <div class="instructions">
                            Enter a Blooket game, press F12 or right-click and select "Inspect", go to Console tab, paste the code, and press Enter.
                        </div>
                    </div>
                    <button class="copy-btn" onclick="copyBlooketScript()">Copy Script</button>
                </div>

                <div class="hack-card">
                    <div class="hack-content">
                        <h3>Project Void - Kahoot Hacks</h3>
                        <div class="instructions">
                            Enter a Kahoot game, press F12 or right-click and select "Inspect", go to Console tab, paste the code, and press Enter. (The quiz id is shown on the url bar of the teachers screen, you have to type it out into the hacks gui).
                        </div>
                    </div>
                    <button class="copy-btn" onclick="copyKahootScript()">Copy Script</button>
                </div>
            </div>
        </div>
    </main>
    <script>
        async function copyBlooketScript() {
            try {
                const response = await fetch('js/blooket.js');
                const text = await response.text();
                await navigator.clipboard.writeText(text);
                
                const button = document.querySelector('.copy-btn');
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy Script';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }

        async function copyKahootScript() {
            try {
                const response = await fetch('js/kahoot.js');
                const text = await response.text();
                await navigator.clipboard.writeText(text);
                
                const button = document.querySelectorAll('.copy-btn')[1];
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy Script';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
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