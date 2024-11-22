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
    <title>Project Void - Updates</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/updates.css?v=<?php echo time(); ?>">
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
            <a href="chat.php">Chatroom</a>
            <a href="ai.php">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php" class="active">Updates</a>
        </div>
    </nav>

    <main>
        <div class="update-container">
            <h1 class="update-title">Update Log</h1>
            
            <div class="update-list">
                <?php
                // Updates array - newest updates at the top
                $updates = [
                    [
                        'date' => 'November 22, 2024',
                        'version' => 'v1.2',
                        'title' => 'Update',
                        'changes' => [
                            'Removed Burrito Bison. (Couldnt find a working version).',
                            'Added Doge Miner',
                            'Added Draw The Hill',
                            'Added Stack',
                            'Added Idle Dice from game recommendations.',
                            'Added Papas Cupcakeria from game reccomendation, (Couldnt find Papas Scooperia).',
                            'Added an AI filter to the chatroom to filter certain words (profanity is still allowed). The AI can scan up to 200 messages at once. Also Made the chat filter toggelable by the admin panel',
                            'Added a 404 page not found page if you try to go to a nonexistent page',
                            
                        ]
                    ],
                    [
                        'date' => 'November 21, 2024',
                        'version' => 'v1.1.5',
                        'title' => 'Small Update',
                        'changes' => [
                            'Added Block Blast Puzzle (From Game Recommendations Form)',
                            'Fixed the border scaling issue in the chat room when to much people join.',
                            'Fixed spelling/grammar around the site.',
                            'Changed Burrito Bison game version. (Old version crashed when you break through the second wall).',
                            'Added an AI chat.',
                            'Removed Leaderboard.'
                            
                        ]
                    ],
                    [
                        'date' => 'November 20, 2024',
                        'version' => 'v1.1.0',
                        'title' => 'Update',
                        'changes' => [
                            'Fixed the custom cursor not being infront of the Game Bar.',
                            'Chat room improvement. Better designed system messages and user messages.',
                            'Fixed the "Invalid Date" on the profile card, all users may have to click the reset data button to get a valid account creation date.',
                            'Added Tetris Sand (From Game Recommendations Form).',
                            'Added a "Pages" title above the page selectors on the games page.',
                            'Added a leaderboard page.'
                        ]
                    ],
                    [
                        'date' => 'November 19, 2024',
                        'version' => 'v1.0.0',
                        'title' => 'Website Release',
                        'changes' => [
                            'Website Release'
                        ]
                    ],
                ];

                // Loop through and display updates
                foreach ($updates as $update) {
                    echo '<div class="update-entry">
                        <div class="update-header">
                            <span class="update-date">' . $update['date'] . '</span>
                            <span class="update-version">' . $update['version'] . '</span>
                        </div>
                        <div class="update-content">
                            <h3>' . $update['title'] . '</h3>
                            <ul>';
                    
                    foreach ($update['changes'] as $change) {
                        echo '<li>' . $change . '</li>';
                    }
                    
                    echo '</ul>
                        </div>
                    </div>';
                }
                ?>
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

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
</body>
</html> 