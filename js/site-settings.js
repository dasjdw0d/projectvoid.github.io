(function() {
    // Check localStorage immediately
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    if (settings.cursorToggle === true) {
        document.body.classList.add('custom-cursor');
        enableCustomCursor();
    }
})();

function initializeParticles() {
    // Add a small delay to ensure the config file is loaded
    setTimeout(() => {
        if (typeof particlesJS !== 'undefined' && typeof particlesConfig !== 'undefined') {
            particlesJS('particles-js', particlesConfig);
        } else {
            console.warn('Particles config not loaded. Retrying...');
            // Try one more time after a longer delay
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

// Add these variables at the top of the file
let originalTitle = '';
let originalFavicon = '';

// Separate the initialization of cloaking features from the settings page initialization
function initializeCloakingFeatures() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    
    // Get the current page name from the URL
    const pathParts = window.location.pathname.split('/');
    const pageName = pathParts[pathParts.length - 1].split('.')[0] || 'index';
    
    // Store the original values for this page
    originalTitle = `Project Void - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
    originalFavicon = 'images/favicon.png';

    // Apply cloaking if enabled
    if (settings.cloakingToggle) {
        handleCloaking(originalTitle, originalFavicon);
    }

    // Apply global cloak if enabled
    if (settings.globalCloakToggle) {
        applyGlobalCloak(settings.globalCloakType || 'google');
    }
}

// Add these at the top of the file
let heartbeatInterval;
const SESSION_KEY = 'userSessionId';

// Generate a unique session ID if one doesn't exist
function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

// Modify your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cloaking features for all pages
    initializeCloakingFeatures();

    // Initialize online tracking
    initializeOnlineTracking();

    // Initialize particles and cursor settings
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {
        particleToggle: true
    };
    
    // Apply particle setting
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

    // Apply cursor setting
    if (settings.cursorToggle === true) {
        enableCustomCursor();
    }

    // Only initialize settings page if we're on settings.php
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
        
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX - 6 + 'px';
                cursor.style.top = e.clientY - 6 + 'px';
            });
        });
    }
}

function disableCustomCursor() {
    document.body.classList.remove('custom-cursor');
    const cursor = document.querySelector('.custom-cursor-dot');
    if (cursor) cursor.remove();
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

// Add this variable at the top of the file to store the event listener
let visibilityChangeHandler = null;

// Modify the handleCloaking function
function handleCloaking(pageTitle, pageFavicon) {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    
    // Remove any existing visibility change listener
    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
    }
    
    // Create new visibility change handler
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
            // Use the stored original values
            document.title = pageTitle;
            if (favicon) favicon.href = pageFavicon;
        }
    };
    
    // Add the new listener
    document.addEventListener('visibilitychange', visibilityChangeHandler);
}

// Modify the removeCloak function
function removeCloak() {
    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        visibilityChangeHandler = null;
        
        // Reset to original values
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

// Move settings page code into a separate function
function initializeSettingsPage() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {
        particleToggle: true  // Set default to true
    };

    // Initialize toggles
    const particleToggle = document.getElementById('particleToggle');
    const cursorToggle = document.getElementById('cursorToggle');
    const cloakingToggle = document.getElementById('cloakingToggle');
    const globalCloakToggle = document.getElementById('globalCloakToggle');
    const globalCloakSelect = document.getElementById('globalCloakSelect');
    const clickoffCloakSelect = document.getElementById('clickoffCloakSelect');

    if (!particleToggle || !cursorToggle || !cloakingToggle || !globalCloakToggle) {
        return; // Not on settings page, exit early
    }

    // Set initial states
    particleToggle.checked = settings.particleToggle !== false; // This ensures true by default
    cursorToggle.checked = settings.cursorToggle === true;
    cloakingToggle.checked = settings.cloakingToggle === true;
    globalCloakToggle.checked = settings.globalCloakToggle === true;
    
    // Set initial select values
    if (settings.globalCloakType) {
        globalCloakSelect.value = settings.globalCloakType;
    }
    if (settings.clickoffCloakType) {
        clickoffCloakSelect.value = settings.clickoffCloakType;
    }

    // Add event listeners
    particleToggle.addEventListener('change', function() {
        settings.particleToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        
        const particles = document.getElementById('particles-js');
        if (particles) {
            if (this.checked) {
                // Save the setting and refresh the page
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
}

// Run settings initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on settings page (change .html to .php)
    if (window.location.pathname.includes('settings.php')) {
        initializeSettingsPage();
    }
});

// Add this helper function to check if global cloaking is enabled
function isGlobalCloakEnabled() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    return settings.globalCloakToggle === true;
}

// Add this function to get the current cloak config
function getCurrentCloakConfig() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    return CLOAK_CONFIGS[settings.globalCloakType || 'google'];
}

function initializeOnlineTracking() {
    const sessionId = getSessionId();
    let lastUserCount = 0;
    let failedHeartbeats = 0;
    let reconnectAttempts = 0;
    
    // Clear existing interval with a unique identifier
    const trackingId = `tracking_${Date.now()}`;
    window.onlineTrackingIntervals = window.onlineTrackingIntervals || {};
    
    // Clear any existing intervals
    Object.values(window.onlineTrackingIntervals).forEach(clearInterval);
    
    function sendHeartbeat() {
        fetch('https://projectvoid.is-not-a.dev/api/heartbeat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
                // Try to reconnect with exponential backoff
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
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(window.onlineTrackingIntervals[trackingId]);
        delete window.onlineTrackingIntervals[trackingId];
        
        navigator.sendBeacon('https://projectvoid.is-not-a.dev/api/offline', 
            JSON.stringify({ sessionId, timestamp: Date.now() })
        );
    });
}

// Modify the updateOnlineGraph function
let onlineHistory = new Array(40).fill(0);
let maxOnlineUsers = 0;
let lastGraphUpdate = 0;

function updateOnlineGraph(currentUsers, newHistory = null) {
    if (!newHistory) return;
    
    onlineHistory = newHistory;
    maxOnlineUsers = Math.max(...onlineHistory, maxOnlineUsers);

    const graphContainer = document.querySelector('.graph-bars');
    if (!graphContainer) return;

    // Clear existing bars
    graphContainer.innerHTML = '';

    // Create new bars
    onlineHistory.forEach((users, index) => {
        const bar = document.createElement('div');
        bar.className = 'graph-bar';
        
        // Simplified linear scaling
        let heightPercent;
        if (users === 0) {
            heightPercent = 2; // Minimum height for visibility
        } else {
            // Linear scale from 15% to 100%
            heightPercent = 15 + (users / maxOnlineUsers) * 85;
        }
        
        bar.style.height = `${heightPercent}%`;
        
        // Add hover listeners
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

// Add this function near your other online tracking functions
function updateOnlineCount(count) {
    const onlineCountElement = document.getElementById('onlineCount');
    if (onlineCountElement) {
        onlineCountElement.textContent = count;
    }
}