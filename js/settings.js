document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
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
});