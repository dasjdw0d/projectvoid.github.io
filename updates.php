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
            <a href="misc.php">Misc</a>
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
                        'date' => 'Planned Release: December 2, 2024',
                        'version' => 'v1.4',
                        'title' => 'Update (In Development)',
                        'changes' => [
                            'Major Changes' => [
                                'Added a game pinning feature on the games page, to use it right click any game to pin the game at the top of the page.',
                                'Added a most played games ranking on the home page. It is calculated by the amount of game clicks.',
                                'Added back the chat room with a comprehensive filter to filter out the things that got the chat room removed. Also added extra security to the Admin login.'
                            ],
                            'UI Improvements' => [
                                'Added 20 more blocks in the online users graph, and updated the scaling. The graph now fits 20 minutes of history.',
                                'Moved the Global Users Online and graph to where the announcements were.',
                                'Made the navigation bar look better.',
                                'Added a logo card above the title on the home page.',
                                'Made the page number buttons on the games page better and less glitchy.'
                            ],
                            'Bug Fixes' => [
                                'Fixed some bugs with the online users graph.',
                                'Fixed the profile system and the content to the right on the home page not properly scaling with the page zoom. '
                            ],
                            'Game Updates' => [
                                'Fixed Eggy Car being blocked.',
                                'Removed Retro Bowl College until further notice.',
                                'Added Little Alchemy 2 (From game recommendations).'
                            ],
                            'Removals' => [
                                'Removed the announcements.',
                                'Removed the "Member Since" text in the profile card on the home page.'
                            ],
                        ]
                    ],
                    [
                        'date' => 'November 26, 2024',
                        'version' => 'v1.3',
                        'title' => 'Update',
                        'changes' => [
                            'Major Changes' => [
                                'Updated the AI chat to use the model to Mixtral-8x7B-Instruct-v0.1. It should be better now and can handle up to 200 messages at once.',
                                'Improved the global users online system that is displayed on the home page. And also added a history graph that updates every 30 seconds.',
                            ],
                            'UI Improvements' => [
                                'Made the announcements and profile card look better.',
                                'Fixed some bugs related to the profile statistics.',
                            ],
                            'Game Updates' => [
                                'Added Eggy Car (From game recommendations).',
                                'Added A dance of Fire & Ice (From game recommendations).',
                                'Added Getaway Shootout',
                                'Added Gunspin',
                                'Added House of Hazards',
                                'Added Pandemic 2',
                                'Added Stack Bump 3D',
                                'Added Stickman Golf',
                                'Added Volleyrandom',
                                'Added Polytrack',
                            ],
                            'Removals' => [
                                'Removed the chatroom, it may be added back in the future.',
                                'Removed Learn To Fly 3, couldnt find a working version.',
                            ]
                        ]
                    ],
                    [
                        'date' => 'November 22, 2024',
                        'version' => 'v1.2',
                        'title' => 'Update',
                        'changes' => [
                            'Game Updates' => [
                                'Added Doge Miner',
                                'Added Draw The Hill',
                                'Added Stack',
                                'Added Idle Dice from game recommendations.',
                                'Added Papas Cupcakeria from game reccomendation, (Couldnt find Papas Scooperia).',
                            ],
                            'Features' => [
                                'Added an AI filter to the chatroom to filter certain words (profanity is still allowed). The AI can scan up to 200 messages at once.',
                                'Made the chat filter toggelable by the admin panel',
                                'Added a 404 page not found page if you try to go to a nonexistent page',
                            ],
                            'Removals' => [
                                'Removed Burrito Bison. (Couldnt find a working version).',
                            ]
                        ]
                    ],
                    [
                        'date' => 'November 21, 2024',
                        'version' => 'v1.1.5',
                        'title' => 'Small Update',
                        'changes' => [
                            'Game Updates' => [
                                'Added Block Blast Puzzle (From Game Recommendations Form)',
                                'Changed Burrito Bison game version. (Old version crashed when you break through the second wall).',
                            ],
                            'Features' => [
                                'Added an AI chat.',
                            ],
                            'Bug Fixes' => [
                                'Fixed the border scaling issue in the chat room when to much people join.',
                                'Fixed spelling/grammar around the site.',
                            ],
                            'Removals' => [
                                'Removed Leaderboard.'
                            ]
                        ]
                    ],
                    [
                        'date' => 'November 20, 2024',
                        'version' => 'v1.1.0',
                        'title' => 'Update',
                        'changes' => [
                            'Bug Fixes' => [
                                'Fixed the custom cursor not being infront of the Game Bar.',
                                'Fixed the "Invalid Date" on the profile card, all users may have to click the reset data button to get a valid account creation date.',
                            ],
                            'Features' => [
                                'Chat room improvement. Better designed system messages and user messages.',
                                'Added a "Pages" title above the page selectors on the games page.',
                                'Added a leaderboard page.',
                            ],
                            'Game Updates' => [
                                'Added Tetris Sand (From Game Recommendations Form).',
                            ]
                        ]
                    ],
                    [
                        'date' => 'November 19, 2024',
                        'version' => 'v1.0.0',
                        'title' => 'Website Release',
                        'changes' => [
                            'Release' => [
                                'Website Release'
                            ]
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
                            <h3>' . $update['title'] . '</h3>';
                    
                    foreach ($update['changes'] as $section => $changes) {
                        echo '<h4 class="update-section">' . $section . '</h4>
                              <ul>';
                        
                        foreach ($changes as $change) {
                            echo '<li>' . $change . '</li>';
                        }
                        
                        echo '</ul>';
                    }
                    
                    echo '</div></div>';
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