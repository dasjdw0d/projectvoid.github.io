<?php
session_start();

function isAdminAuthenticated() {
    // Check if user is authenticated via session
    if (isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true) {
        return true;
    }

    // Check if user is authenticated via POST request (for login)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
        isset($_POST['username']) && 
        isset($_POST['password'])) {
        
        // Load environment variables
        loadEnv();
        
        // Verify credentials
        if (password_verify($_POST['username'], $_ENV['ADMIN_USERNAME_HASH']) && 
            password_verify($_POST['password'], $_ENV['ADMIN_PASSWORD_HASH'])) {
            
            // Set session
            $_SESSION['admin_authenticated'] = true;
            $_SESSION['last_activity'] = time();
            return true;
        }
    }

    return false;
}

function loadEnv() {
    $envFile = '/var/www/.env';
    if (!file_exists($envFile)) {
        die('.env file not found');
    }

    if (!isset($_ENV['ADMIN_USERNAME_HASH']) || !isset($_ENV['ADMIN_PASSWORD_HASH'])) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos(trim($line), '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if they exist
                $value = trim($value, '"\'');
                
                $_ENV[$key] = $value;
            }
        }
    }
}

// Session security measures
function checkSessionSecurity() {
    // Session timeout after 30 minutes of inactivity
    $timeout = 1800; // 30 minutes in seconds
    
    if (isset($_SESSION['last_activity']) && 
        (time() - $_SESSION['last_activity'] > $timeout)) {
        // Session has expired
        session_unset();
        session_destroy();
        return false;
    }
    
    // Update last activity time
    $_SESSION['last_activity'] = time();
    
    // Regenerate session ID periodically to prevent session fixation
    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();
    } else if (time() - $_SESSION['created'] > 1800) {
        // Regenerate session ID every 30 minutes
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
    
    return true;
}

// Function to validate file paths
function isValidFilePath($file) {
    // Only block sensitive files
    $blockedPaths = [
        '.env'
    ];
    
    foreach ($blockedPaths as $blocked) {
        if (strpos($file, $blocked) !== false) {
            return false;
        }
    }
    
    return true;
}

// Function to get absolute path safely
function getSecurePath($file) {
    if (!isValidFilePath($file)) {
        return false;
    }
    
    return __DIR__ . '/' . $file;
}

// Function to create backup
function createBackup($filePath) {
    $backupDir = __DIR__ . '/data/backups/' . date('Y-m');
    if (!file_exists($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $fileName = basename($filePath);
    $backupPath = $backupDir . '/' . $fileName . '.backup.' . time();
    
    return copy($filePath, $backupPath);
} 