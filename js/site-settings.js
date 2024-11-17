(function() {
    // Check localStorage immediately
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    if (settings.cursorToggle === true) {
        document.body.classList.add('custom-cursor');
        enableCustomCursor();
    }
})();

function createContextMenu() {
    let menu = document.querySelector('.custom-context-menu');
    if (!menu) {
        menu = document.createElement('div');
        menu.className = 'custom-context-menu';
        
        // Create background container
        const menuBackground = document.createElement('div');
        menuBackground.className = 'menu-background';
        
        // Add Fullscreen button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'menu-item';
        
        // Add icon span
        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.textContent = '⤢';
        
        // Add text span
        const text = document.createElement('span');
        text.textContent = 'Fullscreen';
        
        fullscreenBtn.appendChild(icon);
        fullscreenBtn.appendChild(text);
        
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            menu.style.display = 'none';
        });
        
        // Add Settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'menu-item';
        
        // Add settings icon
        const settingsIcon = document.createElement('span');
        settingsIcon.className = 'icon';
        settingsIcon.textContent = '⚙️';
        
        // Add settings text
        const settingsText = document.createElement('span');
        settingsText.textContent = 'Settings';
        
        settingsBtn.appendChild(settingsIcon);
        settingsBtn.appendChild(settingsText);
        
        settingsBtn.addEventListener('click', () => {
            window.location.href = 'settings.html';
            menu.style.display = 'none';
        });
        
        menuBackground.appendChild(fullscreenBtn);
        menuBackground.appendChild(settingsBtn);
        menu.appendChild(menuBackground);
        document.body.appendChild(menu);
    }
    
    // Initialize menu as hidden
    menu.style.display = 'none';
    return menu;
}

// Create menu and set up event listeners once when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    
    // Apply particle setting
    const particlesSetting = settings.particleToggle !== false;
    const particles = document.getElementById('particles-js');
    if (particles) {
        particles.style.display = particlesSetting ? 'block' : 'none';
    }

    // Store original title and favicon
    const originalTitle = document.title;
    const originalFavicon = document.querySelector('link[rel="icon"]').href;

    // Apply cloaking if enabled
    if (settings.cloakingToggle) {
        handleCloaking(originalTitle, originalFavicon);
    }

    // Apply global cloak if enabled
    if (settings.globalCloakToggle) {
        applyGlobalCloak(settings.globalCloakType || 'google');
    }

    // Create context menu
    const menu = createContextMenu();
    
    // Handle right click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.style.display = 'block';
        
        // Position the menu
        const x = e.clientX;
        const y = e.clientY;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        
        // Adjust menu position if it would go outside viewport
        const xPos = x + menuWidth > winWidth ? winWidth - menuWidth : x;
        const yPos = y + menuHeight > winHeight ? winHeight - menuHeight : y;
        
        menu.style.left = `${xPos}px`;
        menu.style.top = `${yPos}px`;
    });
    
    // Hide menu on click outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
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

function handleCloaking(originalTitle, originalFavicon) {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    
    // Remove any existing visibility change listener
    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
    }
    
    // Create new visibility change handler
    visibilityChangeHandler = function() {
        const currentSettings = JSON.parse(localStorage.getItem('siteSettings')) || {};
        if (!currentSettings.cloakingToggle) return; // Don't cloak if setting is off
        
        const selectedCloak = currentSettings.clickoffCloakType || 'google';
        const cloak = CLOAK_CONFIGS[selectedCloak];
        
        const favicon = document.querySelector('link[rel="icon"]');
        
        if (document.hidden) {
            document.title = cloak.title;
            favicon.href = cloak.favicon;
        } else {
            document.title = originalTitle;
            favicon.href = originalFavicon;
        }
    };
    
    // Add the new listener
    document.addEventListener('visibilitychange', visibilityChangeHandler);
}

function removeCloak() {
    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        visibilityChangeHandler = null;
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

// Only run settings page code if we're on settings.html
if (window.location.pathname.endsWith('settings.html')) {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};

    // Initialize toggles
    const particleToggle = document.getElementById('particleToggle');
    const cursorToggle = document.getElementById('cursorToggle');
    const cloakingToggle = document.getElementById('cloakingToggle');
    const globalCloakToggle = document.getElementById('globalCloakToggle');
    const globalCloakSelect = document.getElementById('globalCloakSelect');
    const clickoffCloakSelect = document.getElementById('clickoffCloakSelect');

    // Set initial states
    if (particleToggle) {
        particleToggle.checked = settings.particleToggle !== false;
    }
    if (cursorToggle) {
        cursorToggle.checked = settings.cursorToggle === true;
    }
    if (cloakingToggle) {
        const clickoffSettingsCard = cloakingToggle.closest('.settings-card');
        cloakingToggle.checked = settings.cloakingToggle === true;
        clickoffSettingsCard.dataset.active = settings.cloakingToggle === true;
        
        if (clickoffCloakSelect) {
            clickoffCloakSelect.value = settings.clickoffCloakType || 'google';
        }
    }
    if (globalCloakToggle) {
        const globalSettingsCard = globalCloakToggle.closest('.settings-card');
        globalCloakToggle.checked = settings.globalCloakToggle === true;
        globalSettingsCard.dataset.active = settings.globalCloakToggle === true;
        
        if (globalCloakSelect) {
            globalCloakSelect.value = settings.globalCloakType || 'google';
        }
    }

    // Handle clickoff cloaking toggle
    cloakingToggle.addEventListener('change', function() {
        const clickoffSettingsCard = this.closest('.settings-card');
        
        if (this.checked) {
            // If clickoff cloaking is enabled, disable global cloaking
            globalCloakToggle.checked = false;
            const globalSettingsCard = globalCloakToggle.closest('.settings-card');
            globalSettingsCard.dataset.active = false;
            settings.globalCloakToggle = false;
            resetGlobalCloak();
            
            const originalTitle = document.title;
            const originalFavicon = document.querySelector('link[rel="icon"]').href;
            handleCloaking(originalTitle, originalFavicon);
        } else {
            // Remove the visibility change listener and reset title/favicon
            removeCloak();
            const pathParts = window.location.pathname.split('/');
            const pageName = pathParts[pathParts.length - 1].split('.')[0];
            document.title = `Project Void - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = 'images/favicon.png';
            }
        }
        
        settings.cloakingToggle = this.checked;
        clickoffSettingsCard.dataset.active = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    });

    // Handle global cloak toggle
    globalCloakToggle.addEventListener('change', function() {
        const globalSettingsCard = this.closest('.settings-card');
        
        if (this.checked) {
            // If global cloaking is enabled, disable clickoff cloaking
            cloakingToggle.checked = false;
            const clickoffSettingsCard = cloakingToggle.closest('.settings-card');
            clickoffSettingsCard.dataset.active = false;
            settings.cloakingToggle = false;
        }
        
        settings.globalCloakToggle = this.checked;
        globalSettingsCard.dataset.active = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        
        if (this.checked) {
            applyGlobalCloak(settings.globalCloakType || 'google');
        } else {
            resetGlobalCloak();
        }
    });

    // Handle cloak type selection
    if (globalCloakSelect) {
        globalCloakSelect.addEventListener('change', function() {
            settings.globalCloakType = this.value;
            localStorage.setItem('siteSettings', JSON.stringify(settings));
            
            if (settings.globalCloakToggle) {
                applyGlobalCloak(this.value);
            }
        });
    }

    // Handle clickoff cloak selection
    if (clickoffCloakSelect) {
        clickoffCloakSelect.addEventListener('change', function() {
            settings.clickoffCloakType = this.value;
            localStorage.setItem('siteSettings', JSON.stringify(settings));
        });
    }

    // Particle toggle
    particleToggle.addEventListener('change', function() {
        settings.particleToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        
        const particles = document.getElementById('particles-js');
        if (particles) {
            particles.style.display = this.checked ? 'block' : 'none';
        }
    });

    // Cursor toggle
    cursorToggle.addEventListener('change', function() {
        settings.cursorToggle = this.checked;
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        
        if (this.checked) {
            enableCustomCursor();
        } else {
            disableCustomCursor();
        }
    });
}