<?php
$page = "Updates";
define('allowed', true);
include 'header.php';
?>

    <main>
        <div class="update-container">
            <h1 class="update-title">Update Log</h1>

            <div class="update-list">
                <?php

                $updates = [
                    [
                        'date' => 'December 9, 2024',
                        'version' => 'v1.7',
                        'title' => 'Update',
                        'changes' => [
                            'Major Changes' => [
                                'Huge AI chat improvement. Improved looks of everything and it now looks more like a chat.',
                                'Added a games per page slider on the games page to customize the amount of games per page.',
                                'All chatroom message data is now encrypted.'
                            ],
                            'UI Improvements' => [
                                'Made the games library organized in alphebetical order.',
                                'Added some animations to the chat room.',
                                'Improved the footer at the bottom of each page.',
                                'Added the users pfp to the chat room messages.'
                            ],
                            'Bug Fixes' => [
                                'Fixed all of the websites problems with crashing.',
                                'Found a exploit in the chat room to give yourself admin without the login and fixed it. And also added extra security.'
                            ],
                            'Game Updates' => [
                                'Added 1v1.lol from game reccomendations form.',
                            ],
                        ]
                    ],
                    [
                        'date' => 'December 6, 2024',
                        'version' => 'v1.6',
                        'title' => 'Big Game Update',
                        'changes' => [
                            'Major Changes' => [
                                'Added a 7-Day Online Users graph on the home page. All data comes from Google Analytics.',
                                'Added a Contact Form on the forms page.',
                                'Added a chat reset timer to the chat room.',
                            ],
                            'UI Improvements' => [
                                'Made the game page look better.',
                            ],
                            'Game Updates' => [
                                'Added Amazing Rope Police',
                                'Replaced the current new version A Dance of Fire and Ice.',
                                'Added Merge Round Racers',
                                'Added Bloxorz',
                                'Added Backrooms',
                                'Added Glass City',
                                'Added Cookie Clicker',
                                'Added Burrito Bison',
                                'Added Backrooms',
                                'Added Aqua Park',
                                'Added Townscaper',
                                'Added Boxing Random',
                                'Added Big Red Button',
                                'Added Cell machine',
                                'Added Break Lock',
                                'Added 3 Lines',
                                'Added 10 Minutes Till Dawn',
                                'Added 60s Burger Run',
                                'Added A Dark Room',
                                'Added Age of War',
                                'Added Age of War 2',
                                'Added Awesome Tanks',
                                'Added Bad Piggies',
                                'Added Baldis Basics',
                                'Added Balloon Run',
                                'Added Bit Planes',
                                'Added Boxing Physics 2',
                                'Addeed Bubble Shooter',
                                'Added Clicker Heroes',
                                'Added Deepest Sword',
                                'Added Doodle Jump',
                                'Added Draw Climber',
                                'Added Earn To Die',
                                'Added Hill Climb Racing 2',
                                'Added Knife Hit',
                                'Added Last Horizon',
                                'Added Lazy Jump 3D',
                                'Added Madalin Cars',
                                'Added Mindustry',
                                'Added Minesweeper',
                                'Added Papas Wingeria',
                                'Added Papas Tacomia',
                                'Added Papas Sushiria',
                                'Added Papas Scooperia',
                                'Added Papas Pizzeria',
                                'Added Papas Pastaria',
                                'Added Papas Pancakeria',
                                'Added Papas Donuteria',
                                'Added Papas Cheeseria',
                                'Added Papas Bakeria',
                                'Added Plants VS Zombies',
                                'Added Rocket Bot Royale',
                                'Added Run 3 Editor',
                                'Added Slope 2',
                                'Added Slope 3',
                            ],
                        ]
                    ],
                    [
                        'date' => 'December 4, 2024',
                        'version' => 'v1.5',
                        'title' => 'Update',
                        'changes' => [
                            'Major Changes' => [
                                'Added an option in the settings page to toggle the game bar at the top of your screen when playing a game.',
                                'Heavily improved the global announcement system and added a few more global website features.',
                                'Added kahoot hacks in the misc page.'
                            ],
                            'UI Improvements' => [
                                'Removed the slide down animation for the navigation on page load.',
                                'Made the custom cursor a lot better by adding a trail, aerodynamic physics, and a small delay. (You can enable the custom cursor on the settings page.)',
                                'Added auto scroll to the AI chat when sending and receiving messages.'
                            ],
                            'Removals' => [
                                'The most played games ranking on the home page has been removed.',
                            ],
                            'Bug Fixes' => [
                                'Fixed the online counter on the home page staying in the same place when scrolling.',
                                'Fixed spelling errros across the site.',
                            ]
                        ]
                    ],
                    [
                        'date' => 'December 2, 2024',
                        'version' => 'v1.4',
                        'title' => 'Update',
                        'changes' => [
                            'Major Changes' => [
                                'Added a game pinning feature on the games page, to use it right click any game to pin the game at the top of the page.',
                                'Added a most played games ranking on the home page. It is calculated by the amount of game clicks.',
                                'Added back the chat room with a comprehensive filter to filter out the things that got the chat room removed. Also added extra security to the chat Admin login.',
                                'Added a global announcement system that shows on all pages above the navigation bar when activated.',
                            ],
                            'UI Improvements' => [
                                'Added 20 more blocks in the online users graph, and updated the scaling. The graph now fits 20 minutes of history.',
                                'Moved the Global Users Online and graph to where the announcements were.',
                                'Made the navigation bar look better.',
                                'Added a logo card above the title on the home page.',
                                'Made the page number buttons on the games page better and less glitchy.',
                                'Added a short loading animation on every page when it loads.'
                            ],
                            'Bug Fixes' => [
                                'Fixed some bugs with the online users graph.',
                                'Fixed the profile system and the content to the right on the home page not properly scaling with the page zoom. '
                            ],
                            'Game Updates' => [
                                'Changed the placement of some games on the games page.',
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
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });

            document.querySelectorAll('.update-entry').forEach((card) => {
                observer.observe(card);
            });
        });
    </script>
</body>
</html>