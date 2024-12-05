function validateUsername(username) {
    const trimmed = username.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > 20) return false;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(trimmed);
}

document.addEventListener('DOMContentLoaded', function() {

    let stats = JSON.parse(localStorage.getItem('siteStats'));

    if (!stats) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];  

        stats = {
            VISITS: 1,
            username: 'Guest',
            lastGame: null,
            profilePicture: 'images/favicon.png',
            totalPlayTime: 0
        };
        localStorage.setItem('siteStats', JSON.stringify(stats));
    } else {

        const currentPath = window.location.pathname;
        if (currentPath === '/index.php' || currentPath.endsWith('/projectvoid/index.php')) {
            stats.VISITS++;
            localStorage.setItem('siteStats', JSON.stringify(stats));
        }
    }

    const visitCount = document.getElementById('visitCount');
    const lastGameDisplay = document.getElementById('lastGameDisplay');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const profileImage = document.getElementById('profileImage');
    const dateCreated = document.getElementById('dateCreated');
    const totalPlayTime = document.getElementById('totalPlayTime');

    if (visitCount) visitCount.textContent = "Loading...";
    if (lastGameDisplay) lastGameDisplay.textContent = "Loading...";

    setTimeout(() => {
        if (visitCount) {
            visitCount.textContent = stats.VISITS > 0 ? stats.VISITS.toLocaleString() : 'N/A';
        }

        if (usernameDisplay) {
            usernameDisplay.textContent = stats.username;
        }

        if (lastGameDisplay) {
            lastGameDisplay.textContent = stats.lastGame || 'N/A';
        }

        if (profileImage) {
            profileImage.src = stats.profilePicture;

            profileImage.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';

                input.onchange = e => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            stats.profilePicture = event.target.result;
                            localStorage.setItem('siteStats', JSON.stringify(stats));
                            forceReload();
                        };
                        reader.readAsDataURL(file);
                    }
                };

                input.click();
            });
        }

        if (dateCreated) {
            dateCreated.textContent = stats.dateCreated ? 
                new Date(stats.dateCreated + 'T12:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }) : 
                'N/A';
        }

        if (totalPlayTime) {
            if (!stats.totalPlayTime && stats.totalPlayTime !== 0) {
                totalPlayTime.textContent = 'N/A';
            } else {
                const hours = Math.floor(stats.totalPlayTime / 3600);
                const minutes = Math.floor((stats.totalPlayTime % 3600) / 60);
                const seconds = stats.totalPlayTime % 60;
                totalPlayTime.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }
    }, 500);

    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all your data?')) {
                localStorage.removeItem('siteStats');
                stats = {
                    VISITS: 0,
                    username: 'Guest',
                    lastGame: null,
                    profilePicture: 'images/favicon.png',
                    totalPlayTime: 0
                };
                localStorage.setItem('siteStats', JSON.stringify(stats));
                forceReload();
            }
        });
    }

    const setUsernameBtn = document.getElementById('setUsernameBtn');
    if (setUsernameBtn) {
        setUsernameBtn.addEventListener('click', function() {
            const newUsername = prompt('Enter your username (max 20 characters, letters and numbers only):', stats.username);
            if (newUsername !== null) {
                if (validateUsername(newUsername)) {
                    stats.username = newUsername.trim();
                    localStorage.setItem('siteStats', JSON.stringify(stats));
                    forceReload();
                } else {
                    alert('Username must be between 1 and 20 characters and contain only letters and numbers. No Spaces.');
                }
            }
        });
    }
});

function updateLastGame(gameName) {
    let stats = JSON.parse(localStorage.getItem('siteStats'));

    if (!stats) {
        stats = {
            VISITS: 1,
            username: 'Guest',
            lastGame: gameName,
            profilePicture: 'images/favicon.png',
            totalPlayTime: 0
        };
    } else {
        stats.lastGame = gameName;
    }

    localStorage.setItem('siteStats', JSON.stringify(stats));

    const lastGameDisplay = document.getElementById('lastGameDisplay');
    if (lastGameDisplay) {
        lastGameDisplay.textContent = gameName;
    }
}

function forceReload() {
    setTimeout(() => {
        window.location.reload();
    }, 100);
}