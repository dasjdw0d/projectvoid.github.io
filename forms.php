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
    <title>Project Void - Forms</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/forms.css?v=<?php echo time(); ?>">
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
            <a href="ai.php">AI Chat</a>
            <a href="forms.php" class="active">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>

    <main>
        <div class="forms-container">
            <h1>Forms</h1>
            <div class="forms-grid">
                <div class="form-card">
                    <div class="form-header" onclick="toggleForm(this)">
                        <div class="form-title">
                            <h2>Game Recommendations</h2>
                            <p class="form-description">Submit game recommendations for games you want added to Project Void.</p>
                        </div>
                        <span class="expand-icon">△</span>
                    </div>
                    <div class="form-embed collapsed">
                        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdsB1TkrLDxQ6S084pVFRKTEXTL6WkeU9z7JENdpVjo48Al9w/viewform?embedded=true" 
                                width="100%" 
                                height="725" 
                                frameborder="0" 
                                marginheight="0" 
                                marginwidth="0">
                            Loading…
                        </iframe>
                    </div>
                </div>

                <div class="form-card">
                    <div class="form-header" onclick="toggleForm(this)">
                        <div class="form-title">
                            <h2>Website Recommendations</h2>
                            <p class="form-description">Submit website recommendations to give ideas to possibly improve Project Void.</p>
                        </div>
                        <span class="expand-icon">△</span>
                    </div>
                    <div class="form-embed collapsed">
                        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScgkPgn3SSJqKXaf-XFd4QQWUPHpkOyuFy3gf5VKfuqYi3Q4g/viewform?embedded=true" 
                                width="100%" 
                                height="725" 
                                frameborder="0" 
                                marginheight="0" 
                                marginwidth="0">
                            Loading…
                        </iframe>
                    </div>
                </div>

                <div class="form-card">
                    <div class="form-header" onclick="toggleForm(this)">
                        <div class="form-title">
                            <h2>Website Bug Form</h2>
                            <p class="form-description">Report any bugs or issues you find on Project Void.</p>
                        </div>
                        <span class="expand-icon">△</span>
                    </div>
                    <div class="form-embed collapsed">
                        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScWNHAgzC7WQ76zG7YF2cxIDrxrwqF6Xu14BHWnO4YPJc7LTQ/viewform?embedded=true" 
                                width="100%" 
                                height="725" 
                                frameborder="0" 
                                marginheight="0" 
                                marginwidth="0">
                            Loading…
                        </iframe>
                    </div>
                </div>
                
                <div class="form-card">
                    <div class="form-header" onclick="toggleForm(this)">
                        <div class="form-title">
                            <h2>Contact Form</h2>
                            <p class="form-description">In this form you can reach out to us for anything like questions you want an answer back from, or if you want to give us something.</p>
                        </div>
                        <span class="expand-icon">△</span>
                    </div>
                    <div class="form-embed collapsed">
                        <div class="external-form-link">
                            <p>This form requires a direct link. Please click below to access the contact form:</p>
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfieeEtRpUMAGoasHkAL8W4OCsuwo7baKEJXKUReR1kYW3efA/viewform?usp=sf_link" 
                               target="_blank" 
                               class="form-link-button">
                                Open Contact Form
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script>
        function toggleForm(header) {
            const formEmbed = header.nextElementSibling;
            formEmbed.classList.toggle('collapsed');
            const expandIcon = header.querySelector('.expand-icon');
            expandIcon.style.transform = formEmbed.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    </script>
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
