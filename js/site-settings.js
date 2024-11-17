(function() {
    // Check localStorage immediately
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    if (settings.cursorToggle === true) {
        document.body.classList.add('custom-cursor');
        enableCustomCursor();
    }
})();

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