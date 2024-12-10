<?php
$page = "Settings";
define('allowed', true);
include 'header.php';
?>

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
                    <p class="setting-description">Disguise the tab to Google when you switch browser tabs. Cannot be used with Global Tab Cloaking.</p>
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
                    <p class="setting-description">Disguises the tab as Google. Cannot be used with Clickoff Cloaking.</p>
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

                <div class="settings-card">
                    <div class="setting-header">
                        <h3>Game Bar</h3>
                        <label class="toggle">
                            <input type="checkbox" id="gameBarToggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p class="setting-description">Show or hide the game bar at the top of game pages. The bar includes the back button, game title, and fullscreen controls.</p>
                </div>
            </div>
        </div>
    </main>

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