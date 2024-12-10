<?php
$page = "Home";
define('allowed', true);
include 'header.php';
?>

    <main>
        <div class="top-section">
            <div class="user-section">
                <div class="user-header">
                    <div class="user-info">
                        <img id="profileImage" src="images/favicon.png" alt="Profile Picture" title="Click to change profile picture">
                        <div class="user-details">
                            <h3>Welcome, <span id="usernameDisplay">Loading...</span></h3>
                        </div>
                    </div>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📊</span>
                            <span id="visitCount">Loading...</span>
                            <span class="stat-label">Home Visits</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">🎮</span>
                            <span id="lastGameDisplay">Loading...</span>
                            <span class="stat-label">Last Played</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⏱️</span>
                            <span id="totalPlayTime">Loading...</span>
                            <span class="stat-label">Play Time</span>
                        </div>
                    </div>
                </div>
                <div class="user-actions">
                    <div class="primary-actions">
                        <button class="action-btn" id="setUsernameBtn">Change Username</button>
                    </div>
                    <button class="action-btn danger" id="clearDataBtn">Clear Data</button>
                </div>
                <p class="privacy-notice">All data is stored locally in your browser</p>
            </div>
            <div class="hero">
                <div class="online-section">
                    <div class="online-counter">
                        <span id="onlineCount">Loading...</span> Global Users Online
                    </div>
                    <div class="online-graph">
                        <div class="graph-bars"></div>
                        <div class="graph-tooltip"><span></span></div>
                        <div class="graph-label">Updates every 30 seconds. Stores 20 min of history.</div>
                    </div>
                </div>
                <h1>PROJECT VOID</h1>
                <div class="subtitle-group">
                    <p class="tagline">Global Home Visits</p>
                    <img src="https://hitwebcounter.com/counter/counter.php?page=17411431&style=0025&nbdigits=5&type=page&initCount=0" title="Counter Widget" Alt="Visit counter For Websites" border="0" />
                </div>
                <button class="about-blank-btn" onclick="openInAboutBlank()">Open in about:blank</button>
            </div>
            <div class="seven-day-graph">
                <h3>7-Day Online Users</h3>
                <div class="graph-description">(All data comes from Google Analytics. The data will always be 1-2 days behind to insures it's accurate.)</div>
                <div class="graph-container" id="sevenDayGraph"></div>
            </div>
        </div>
    </main>
    <script>
    function openInAboutBlank() {
        (function () {
            var url = "https://projectvoid.is-not-a.dev";

            var win = window.open();

            var iframe = win.document.createElement('iframe');

            iframe.style = "position:fixed;width:100vw;height:100vh;top:0px;left:0px;right:0px;bottom:0px;z-index:2147483647;background-color:black;border:none;";

            if (url.includes('https://') || url.includes("http://")) {
                iframe.src = url;
            } else {
                iframe.src = "https://" + url;
            }

            win.document.body.appendChild(iframe);
        })();

        window.location.href = "https://google.com";
    }
    </script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script src="js/stats.js?v=<?php echo time(); ?>"></script>
    <footer>
        <div class="footer-content">
            <p class="footer-text">© 2024 Project Void. All rights reserved.</p>
            <a class="copyrighted-badge" title="Copyrighted.com Registered &amp; Protected" target="_blank" href="https://app.copyrighted.com/website/yNoVAq8F1q2ddpgE">
                <img alt="Copyrighted.com Registered &amp; Protected" border="0" width="125" height="25" srcset="https://static.copyrighted.com/badges/125x25/02_1_2x.png 2x" src="https://static.copyrighted.com/badges/125x25/02_1.png">
            </a>
            <script src="https://static.copyrighted.com/badges/helper.js"></script>
        </div>
    </footer>
    <script>
    const graphData = [
    { date: 'Dec 2', users: 193 },
    { date: 'Dec 3', users: 240 },
    { date: 'Dec 4', users: 359 },
    { date: 'Dec 5', users: 412 },
    { date: 'Dec 6', users: 526 },
    { date: 'Dec 7', users: 31 },
    { date: 'Dec 8', users: 36 },
];

    function initializeGraph() {
        const container = document.getElementById('sevenDayGraph');
        const maxUsers = Math.max(...graphData.map(d => d.users));
        const roundedMax = Math.ceil(maxUsers / 10) * 10;
        const width = container.offsetWidth - 40;
        const height = container.offsetHeight - 60;

        const numYLabels = 5;
        const yLabelStep = roundedMax / (numYLabels - 1);

        for (let i = 0; i < numYLabels; i++) {
            const yLabel = document.createElement('div');
            yLabel.className = 'y-axis-label';
            const value = Math.round(roundedMax - (i * yLabelStep));
            yLabel.textContent = value;
            const yPos = (i * (height / (numYLabels - 1))) + 20;
            yLabel.style.top = `${yPos}px`;
            container.appendChild(yLabel);
        }

        graphData.forEach((data, index) => {
            const xPos = (index * (width / 6)) + 40;
            const yPos = height - (data.users / roundedMax * height) + 20;

            const dateLabel = document.createElement('div');
            dateLabel.className = 'date-label';
            dateLabel.textContent = data.date;
            dateLabel.style.left = `${xPos}px`;
            container.appendChild(dateLabel);

            if (index < graphData.length - 1) {
                const nextXPos = ((index + 1) * (width / 6)) + 40;
                const nextYPos = height - (graphData[index + 1].users / roundedMax * height) + 20;

                const line = document.createElement('div');
                line.className = 'graph-line';
                const length = Math.sqrt(Math.pow(nextXPos - xPos, 2) + Math.pow(nextYPos - yPos, 2));
                const angle = Math.atan2(nextYPos - yPos, nextXPos - xPos) * 180 / Math.PI;

                line.style.width = `${length}px`;
                line.style.left = `${xPos + 4}px`;
                line.style.top = `${yPos + 4}px`;
                line.style.transform = `rotate(${angle}deg)`;

                container.appendChild(line);
            }

            const point = document.createElement('div');
            point.className = 'graph-point';
            point.style.left = `${xPos}px`;
            point.style.top = `${yPos}px`;

            point.addEventListener('mouseover', () => {
                const tooltip = document.createElement('div');
                tooltip.className = 'graph-tooltip';
                tooltip.style.opacity = '1';
                tooltip.textContent = `${data.users} users`;
                tooltip.style.left = `${xPos}px`;
                tooltip.style.top = `${yPos - 25}px`;
                container.appendChild(tooltip);
            });

            point.addEventListener('mouseout', () => {
                const tooltip = container.querySelector('.graph-tooltip');
                if (tooltip) tooltip.remove();
            });

            container.appendChild(point);
        });
    }

    window.addEventListener('load', initializeGraph);
    </script>
</body>
</html>