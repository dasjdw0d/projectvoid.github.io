(function() {

    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    if (settings.cursorToggle === true) {
        document.body.classList.add('custom-cursor');
        enableCustomCursor();
    }

    if (!window.location.pathname.endsWith('display.php') && 
        !window.location.pathname.endsWith('admin.php')) {
        createAnnouncementBar();

        checkAnnouncement();

        setInterval(checkAnnouncement, 1000);

        checkFlashMode();
        setInterval(checkFlashMode, 1000);
    }
})();

async function createAnnouncementBar() {
    const existingBar = document.querySelector('.announcement-bar');
    if (existingBar) {
        return;
    }

    const announcementBar = document.createElement('div');
    announcementBar.className = 'announcement-bar';
    announcementBar.style.display = 'none';
    document.body.insertBefore(announcementBar, document.body.firstChild);
}

async function checkAnnouncement() {
    try {
        const response = await fetch('admin.php?action=get_announcement');
        const data = await response.json();

        const announcementBar = document.querySelector('.announcement-bar');
        if (!announcementBar) return;

        if (data.active === 'true' && data.message) {
            announcementBar.textContent = data.message;
            announcementBar.style.display = 'block';
            document.body.classList.add('has-announcement');
        } else {
            announcementBar.style.display = 'none';
            document.body.classList.remove('has-announcement');
        }
    } catch (error) {
        console.error('Failed to check announcement:', error);
    }
}

async function checkFlashMode() {

    if (window.location.pathname.endsWith('display.php') || 
        window.location.pathname.endsWith('admin.php')) {
        return;
    }

    try {
        const response = await fetch('/admin.php?action=get_flash');
        const data = await response.json();

        if (data.active === 'true') {
            if (!document.getElementById('flash-overlay')) {
                createFlashOverlay();
            }
        } else {
            const overlay = document.getElementById('flash-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    } catch (error) {
        console.error('Failed to check flash mode:', error);
    }
}

function createFlashOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'flash-overlay';
    document.body.appendChild(overlay);
}

function initializeParticles() {

    setTimeout(() => {
        if (typeof particlesJS !== 'undefined' && typeof particlesConfig !== 'undefined') {
            particlesJS('particles-js', particlesConfig);
        } else {
            console.warn('Particles config not loaded. Retrying...');

            setTimeout(() => {
                if (typeof particlesJS !== 'undefined' && typeof particlesConfig !== 'undefined') {
                    particlesJS('particles-js', particlesConfig);
                } else {
                    console.error('Failed to load particles config after retry');
                }
            }, 1000);
        }
    }, 100);
}

function destroyParticles() {
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }
}

let originalTitle = '';
let originalFavicon = '';

function initializeCloakingFeatures() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};

    const pathParts = window.location.pathname.split('/');
    const pageName = pathParts[pathParts.length - 1].split('.')[0] || 'index';

    originalTitle = `Project Void - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
    originalFavicon = 'images/favicon.png';

    if (settings.cloakingToggle) {
        handleCloaking(originalTitle, originalFavicon);
    }

    if (settings.globalCloakToggle) {
        applyGlobalCloak(settings.globalCloakType || 'google');
    }
}

let heartbeatInterval;
const SESSION_KEY = 'userSessionId';

function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

document.addEventListener('DOMContentLoaded', function() {

    initializeCloakingFeatures();

    initializeOnlineTracking();

    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {
        particleToggle: true
    };

    const particlesSetting = settings.particleToggle !== false;
    const particles = document.getElementById('particles-js');
    if (particles) {
        particles.style.display = particlesSetting ? 'block' : 'none';
        if (particlesSetting) {
            initializeParticles();
        } else {
            destroyParticles();
        }
    }

    if (settings.cursorToggle === true) {
        enableCustomCursor();
    }

    if (window.location.pathname.includes('settings.php')) {
        initializeSettingsPage();
    }
});

function enableCustomCursor() {
    document.body.classList.add('custom-cursor');

    if (!document.querySelector('.custom-cursor-dot')) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor-dot';
        document.body.appendChild(cursor);

        const numTrails = 3;
        const trails = Array.from({ length: numTrails }, (_, i) => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.opacity = 0.3 - (i * 0.1);
            document.body.appendChild(trail);
            return trail;
        });

        let cursorPos = { x: 0, y: 0 };
        let targetPos = { x: 0, y: 0 };
        let velocity = { x: 0, y: 0 };
        let lastMousePos = { x: 0, y: 0 };
        let lastTime = performance.now();

        let spring = { x: 0, y: 0 };
        const springStrength = 0.2;  
        const dampening = 0.7;

        document.addEventListener('mousemove', (e) => {
            const currentTime = performance.now();
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            velocity.x = (e.clientX - lastMousePos.x) / deltaTime;
            velocity.y = (e.clientY - lastMousePos.y) / deltaTime;

            velocity.x *= 0.2;
            velocity.y *= 0.2;

            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

            targetPos.x = e.clientX;
            targetPos.y = e.clientY;

            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;

            const maxDeform = 0.8;
            const deformX = Math.min(Math.abs(velocity.x) / 3000, maxDeform);
            const deformY = Math.min(Math.abs(velocity.y) / 3000, maxDeform);
            const angle = Math.atan2(velocity.y, velocity.x) * 0.5;
            const scaleX = 1 + (deformX * 0.3);
            const scaleY = 1 - (deformY * 0.15);

            spring.x += (targetPos.x - cursorPos.x) * springStrength;
            spring.y += (targetPos.y - cursorPos.y) * springStrength;

            spring.x *= dampening;
            spring.y *= dampening;

            cursorPos.x += spring.x;
            cursorPos.y += spring.y;

            cursor.style.transform = `translate(${cursorPos.x - 6}px, ${cursorPos.y - 6}px) 
                                    rotate(${angle}rad) 
                                    scale(${scaleX}, ${scaleY})`;

            trails.forEach((trail, index) => {
                trail.style.transform = `translate(${cursorPos.x - 3}px, ${cursorPos.y - 3}px) 
                                       scale(${1 - index * 0.1})`;
                trail.style.opacity = Math.max(0, 0.3 - (speed / 8000) - (index * 0.08));
            });
        });

        function animate() {
            if (!document.querySelector('.custom-cursor-dot')) return;
            requestAnimationFrame(animate);
        }
        animate();
    }
}

function disableCustomCursor() {
    document.body.classList.remove('custom-cursor');
    const cursor = document.querySelector('.custom-cursor-dot');
    const trails = document.querySelectorAll('.cursor-trail');
    if (cursor) cursor.remove();
    trails.forEach(trail => trail.remove());
}

const CLOAK_CONFIGS = {
    google: {
        title: 'Google',
        favicon: 'https://www.google.com/favicon.ico'
    },
    gmail: {
        title: 'Gmail',
        favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico'
    },
    docs: {
        title: 'Google Docs',
        favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
    },
    drive: {
        title: 'Google Drive',
        favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
    },
    classroom: {
        title: 'Google Classroom',
        favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
    },
    brainpop: {
        title: 'BrainPOP',
        favicon: 'https://www.brainpop.com/favicon.ico'
    }
};

let visibilityChangeHandler = null;

function handleCloaking(pageTitle, pageFavicon) {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};

    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
    }

    visibilityChangeHandler = function() {
        const currentSettings = JSON.parse(localStorage.getItem('siteSettings')) || {};
        if (!currentSettings.cloakingToggle) return;

        const selectedCloak = currentSettings.clickoffCloakType || 'google';
        const cloak = CLOAK_CONFIGS[selectedCloak];

        const favicon = document.querySelector('link[rel="icon"]');

        if (document.hidden) {
            document.title = cloak.title;
            if (favicon) favicon.href = cloak.favicon;
        } else {

            document.title = pageTitle;
            if (favicon) favicon.href = pageFavicon;
        }
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler);
}

function removeCloak() {
    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        visibilityChangeHandler = null;

        document.title = originalTitle;
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = originalFavicon;
    }
}

function applyGlobalCloak(cloakType) {
    const cloak = CLOAK_CONFIGS[cloakType];
    if (cloak) {
        document.title = cloak.title;
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = cloak.favicon;
        }
    }
}

function resetGlobalCloak() {
    const pathParts = window.location.pathname.split('/');
    const pageName = pathParts[pathParts.length - 1].split('.')[0];
    document.title = `Project Void - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = 'images/favicon.png';
    }
}

function initializeSettingsPage() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {
        particleToggle: true  
    };

    const particleToggle = document.getElementById('particleToggle');
    const cursorToggle = document.getElementById('cursorToggle');
    const cloakingToggle = document.getElementById('cloakingToggle');
    const globalCloakToggle = document.getElementById('globalCloakToggle');
    const globalCloakSelect = document.getElementById('globalCloakSelect');
    const clickoffCloakSelect = document.getElementById('clickoffCloakSelect');
    const gameBarToggle = document.getElementById('gameBarToggle');

    if (!particleToggle || !cursorToggle || !cloakingToggle || !globalCloakToggle || !gameBarToggle) {
        return; 
    }

    particleToggle.checked = settings.particleToggle !== false; 
    cursorToggle.checked = settings.cursorToggle === true;
    cloakingToggle.checked = settings.cloakingToggle === true;
    globalCloakToggle.checked = settings.globalCloakToggle === true;
    gameBarToggle.checked = settings.gameBarToggle !== false; 

    if (settings.globalCloakType) {
        globalCloakSelect.value = settings.globalCloakType;
    }
    if (settings.clickoffCloakType) {
        clickoffCloakSelect.value = settings.clickoffCloakType;
    }

    particleToggle.addEventListener('change', function() {
        settings.particleToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));

        const particles = document.getElementById('particles-js');
        if (particles) {
            if (this.checked) {

                location.reload();
            } else {
                particles.style.display = 'none';
                destroyParticles();
            }
        }
    });

    cursorToggle.addEventListener('change', function() {
        settings.cursorToggle = this.checked;
        if (this.checked) {
            enableCustomCursor();
        } else {
            disableCustomCursor();
        }
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    });

    cloakingToggle.addEventListener('change', function() {
        if (this.checked && globalCloakToggle.checked) {
            globalCloakToggle.checked = false;
            settings.globalCloakToggle = false;
            resetGlobalCloak();
        }
        settings.cloakingToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        if (this.checked) {
            handleCloaking(document.title, document.querySelector('link[rel="icon"]')?.href);
        } else {
            removeCloak();
        }
    });

    globalCloakToggle.addEventListener('change', function() {
        if (this.checked && cloakingToggle.checked) {
            cloakingToggle.checked = false;
            settings.cloakingToggle = false;
            removeCloak();
        }
        settings.globalCloakToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        if (this.checked) {
            applyGlobalCloak(settings.globalCloakType || 'google');
        } else {
            resetGlobalCloak();
        }
    });

    globalCloakSelect.addEventListener('change', function() {
        settings.globalCloakType = this.value;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        if (settings.globalCloakToggle) {
            applyGlobalCloak(this.value);
        }
    });

    clickoffCloakSelect.addEventListener('change', function() {
        settings.clickoffCloakType = this.value;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    });

    gameBarToggle.addEventListener('change', function() {
        settings.gameBarToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    });
}

document.addEventListener('DOMContentLoaded', function() {

    if (window.location.pathname.includes('settings.php')) {
        initializeSettingsPage();
    }
});

function isGlobalCloakEnabled() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    return settings.globalCloakToggle === true;
}

function getCurrentCloakConfig() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    return CLOAK_CONFIGS[settings.globalCloakType || 'google'];
}

function initializeOnlineTracking() {
    const sessionId = getSessionId();
    let lastUserCount = 0;
    let failedHeartbeats = 0;
    let reconnectAttempts = 0;

    const trackingId = `tracking_${Date.now()}`;
    window.onlineTrackingIntervals = window.onlineTrackingIntervals || {};

    Object.values(window.onlineTrackingIntervals).forEach(clearInterval);

    function sendHeartbeat() {
        fetch('https://projectvoid.is-not-a.dev/api/heartbeat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: sessionId,
                timestamp: Date.now()
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            failedHeartbeats = 0;
            reconnectAttempts = 0;
            lastUserCount = data.onlineUsers;
            updateOnlineCount(lastUserCount);
            updateOnlineGraph(lastUserCount, data.history);
        })
        .catch(error => {
            failedHeartbeats++;
            console.error('Heartbeat failed:', error);

            if (failedHeartbeats > 5) {
                updateOnlineCount('--');

                if (reconnectAttempts < 5) {
                    setTimeout(() => {
                        reconnectAttempts++;
                        sendHeartbeat();
                    }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000));
                }
            }
        });
    }

    window.onlineTrackingIntervals[trackingId] = setInterval(sendHeartbeat, 1000);

    window.addEventListener('beforeunload', () => {
        clearInterval(window.onlineTrackingIntervals[trackingId]);
        delete window.onlineTrackingIntervals[trackingId];

        navigator.sendBeacon('https://projectvoid.is-not-a.dev/api/offline', 
            JSON.stringify({ sessionId, timestamp: Date.now() })
        );
    });
}

let onlineHistory = new Array(40).fill(0);
let maxOnlineUsers = 0;
let lastGraphUpdate = 0;

function updateOnlineGraph(currentUsers, newHistory = null) {
    if (!newHistory) return;

    onlineHistory = newHistory;
    maxOnlineUsers = Math.max(...onlineHistory, maxOnlineUsers);

    const graphContainer = document.querySelector('.graph-bars');
    if (!graphContainer) return;

    graphContainer.innerHTML = '';

    onlineHistory.forEach((users, index) => {
        const bar = document.createElement('div');
        bar.className = 'graph-bar';

        let heightPercent;
        if (users === 0) {
            heightPercent = 2; 
        } else {

            heightPercent = 15 + (users / maxOnlineUsers) * 80;
        }

        bar.style.height = `${heightPercent}%`;

        const tooltip = document.querySelector('.graph-tooltip');
        bar.addEventListener('mousemove', (e) => {
            tooltip.style.opacity = '1';
            tooltip.style.left = `${e.target.offsetLeft + (e.target.offsetWidth / 2)}px`;
            tooltip.querySelector('span').textContent = `Users: ${users}`;
        });

        bar.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        graphContainer.appendChild(bar);
    });
}

function updateOnlineCount(count) {
    const onlineCountElement = document.getElementById('onlineCount');
    if (onlineCountElement) {
        onlineCountElement.textContent = count;
    }
}