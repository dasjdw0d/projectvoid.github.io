<?php
session_start();

if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['username'])) {
            $env = parse_ini_file('/var/www/.env');
            $admin_username_hash = $env['ADMIN_USERNAME_HASH'];
            $admin_password_hash = $env['ADMIN_PASSWORD_HASH'];

            if (password_verify($data['username'], $admin_username_hash) && 
                password_verify($data['password'], $admin_password_hash)) {
                $_SESSION['isAdmin'] = true;
                //echo json_encode(['success' => true]);
				header('Location: admin.php');
            } else {
                echo json_encode(['success' => false]);
            }
            exit;
        }
    }
    
    if (!isset($_GET['action'])) {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" type="image/png" href="images/favicon.png">
            <title>Project Void - Admin Login</title>
            <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
            <link rel="stylesheet" href="css/admin.css?v=<?php echo time(); ?>">
            <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
            <div id="particles-js"></div>
            <?php include 'loading-screen.php'; ?>

            <main>
                <div class="admin-container">
                    <div id="loginPanel" class="admin-panel">
                        <h1>Admin Login</h1>
                        <div class="login-form">
                            <input type="text" id="adminUsername" placeholder="Username" autocomplete="off">
                            <input type="password" id="adminPassword" placeholder="Password" autocomplete="off">
                            <button id="loginButton">Login</button>
                            <div id="loginStatus" class="status-message"></div>
                        </div>
                    </div>
                </div>
            </main>

            <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
            <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
            <script>
                // Define adminToken at the top level scope
                const adminToken = <?php echo json_encode($admin_token); ?>;

                document.addEventListener('DOMContentLoaded', () => {
                    const loginPanel = document.getElementById('loginPanel');
                    const adminPanel = document.getElementById('adminPanel');
                    const loginButton = document.getElementById('loginButton');
                    const loginStatus = document.getElementById('loginStatus');
                    const updateAnnouncementBtn = document.getElementById('updateAnnouncement');
                    const disableAnnouncementBtn = document.getElementById('disableAnnouncement');
                    const announcementMessage = document.getElementById('announcementMessage');
                    const toggleFlashBtn = document.getElementById('toggleFlash');
                    let isFlashActive = false;

                    if (sessionStorage.getItem('isAdmin') === 'true') {
                        loginPanel.style.display = 'none';
                        adminPanel.style.display = 'block';
                    }

                    fetch('/admin.php?action=get_announcement')
                        .then(response => response.json())
                        .then(data => {
                            if (data.active === 'true' && data.message) {
                                announcementMessage.value = data.message;
                                announcementMessage.readOnly = true;
                                updateAnnouncementBtn.style.display = 'none';
                                disableAnnouncementBtn.style.display = 'inline-block';
                            } else {
                                announcementMessage.value = '';
                                announcementMessage.readOnly = false;
                                updateAnnouncementBtn.style.display = 'inline-block';
                                disableAnnouncementBtn.style.display = 'none';
                            }
                        })
                        .catch(error => {
                            console.error('Failed to load announcement:', error);
                        });

                    fetch('/admin.php?action=get_flash')
                        .then(response => response.json())
                        .then(data => {
                            isFlashActive = data.active === 'true';
                            updateFlashButton();
                        });

                    loginButton.addEventListener('click', async () => {
                        const username = document.getElementById('adminUsername').value;
                        const password = document.getElementById('adminPassword').value;

                        try {
                            const response = await fetch('admin.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ username, password })
                            });

                            const data = await response.json();

                            if (data.success) {
                                sessionStorage.setItem('isAdmin', 'true');
                                loginPanel.style.display = 'none';
                                adminPanel.style.display = 'block';
                                loginStatus.textContent = '';
                                updatePageStatistics();
                                setInterval(updatePageStatistics, 1000);
                            } else {
                                loginStatus.textContent = 'Invalid credentials';
                                loginStatus.style.color = '#ff4444';
                            }
                        } catch (error) {
                            console.error('Login error:', error);
                            loginStatus.textContent = 'Login failed. Please try again.';
                            loginStatus.style.color = '#ff4444';
                        }
                    });

                    updateAnnouncementBtn.addEventListener('click', async () => {
                        if (!announcementMessage.value.trim()) {
                            alert('Please enter an announcement message');
                            return;
                        }

                        try {
                            const response = await fetch('/admin.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    message: announcementMessage.value,
                                    active: true
                                })
                            });

                            const data = await response.json();
                            if (data.success) {
                                announcementMessage.readOnly = true;
                                updateAnnouncementBtn.style.display = 'none';
                                disableAnnouncementBtn.style.display = 'inline-block';
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });

                    disableAnnouncementBtn.addEventListener('click', async () => {
                        try {
                            const response = await fetch('/admin.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    message: '',
                                    active: false
                                })
                            });

                            const data = await response.json();
                            if (data.success) {
                                announcementMessage.value = '';
                                announcementMessage.readOnly = false;
                                disableAnnouncementBtn.style.display = 'none';
                                updateAnnouncementBtn.style.display = 'inline-block';
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });

                    toggleFlashBtn.addEventListener('click', async () => {
                        try {
                            const response = await fetch('/admin.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    action: 'toggle_flash',
                                    active: !isFlashActive
                                })
                            });

                            const data = await response.json();
                            if (data.success) {
                                isFlashActive = !isFlashActive;
                                updateFlashButton();
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });

                    function updateFlashButton() {
                        toggleFlashBtn.textContent = isFlashActive ? 'Disable Flash Mode' : 'Enable Flash Mode';
                        toggleFlashBtn.style.backgroundColor = isFlashActive ? 'rgba(255, 0, 0, 0.2)' : '';
                    }

                    const simulateUsersBtn = document.getElementById('simulateUsers');
                    const clearSimulationBtn = document.getElementById('clearSimulation');
                    const simulationCount = document.getElementById('simulationCount');
                    const simulationStatus = document.getElementById('simulationStatus');

                    simulateUsersBtn.addEventListener('click', async () => {
                        const count = parseInt(simulationCount.value);
                        if (isNaN(count) || count < 1) {
                            alert('Please enter a valid number greater than 0');
                            return;
                        }

                        try {
                            const response = await fetch('https://projectvoid.is-not-a.dev/api/simulate-users', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ 
                                    count,
                                    adminToken  // Use the PHP-provided token
                                })
                            });

                            const data = await response.json();
                            if (data.success) {
                                simulationStatus.textContent = `Added ${count} simulated users. Total users: ${data.totalCount}`;
                                simulationStatus.style.color = '#39ff14';
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            simulationStatus.textContent = 'Failed to add simulated users';
                            simulationStatus.style.color = '#ff4444';
                        }
                    });

                    clearSimulationBtn.addEventListener('click', async () => {
                        try {
                            const response = await fetch('https://projectvoid.is-not-a.dev/api/clear-simulated', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    adminToken  // Use the PHP-provided token
                                })
                            });

                            const data = await response.json();
                            if (data.success) {
                                simulationStatus.textContent = `Cleared all simulated users. Total users: ${data.totalCount}`;
                                simulationStatus.style.color = '#39ff14';
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            simulationStatus.textContent = 'Failed to clear simulated users';
                            simulationStatus.style.color = '#ff4444';
                        }
                    });

                    // Add function to update statistics
                    async function updatePageStatistics() {
                        try {
                            const response = await fetch('https://projectvoid.is-not-a.dev/api/page-statistics');
                            const data = await response.json();
                            
                            if (data.success) {
                                const tbody = document.querySelector('#pageStatistics tbody');
                                tbody.innerHTML = '';
                                
                                data.statistics.sort((a, b) => b.count - a.count).forEach(stat => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${stat.title}</td>
                                        <td>${stat.count}</td>
                                    `;
                                    tbody.appendChild(row);
                                });
                            }
                        } catch (error) {
                            console.error('Failed to fetch page statistics:', error);
                        }
                    }
                });
            </script>
        </body>
        </html>
        <?php
        exit;
    }
}

$env = parse_ini_file('/var/www/.env');
$admin_username_hash = $env['ADMIN_USERNAME_HASH'];
$admin_password_hash = $env['ADMIN_PASSWORD_HASH'];
$admin_token = $env['ADMIN_TOKEN'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_announcement') {
    header('Content-Type: application/json');
    echo json_encode([
        'message' => $env['ANNOUNCEMENT_MESSAGE'] ?? '',
        'active' => $env['ANNOUNCEMENT_ACTIVE'] ?? 'false'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['username'])) {
        if (password_verify($data['username'], $admin_username_hash) && 
            password_verify($data['password'], $admin_password_hash)) {
            session_start();
            $_SESSION['isAdmin'] = true;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        exit;
    }

    if (isset($data['action']) && $data['action'] === 'toggle_flash') {
        session_start();
        if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
            echo json_encode(['success' => false, 'error' => 'Unauthorized']);
            exit;
        }

        $envContent = parse_ini_file('/var/www/.env');
        $envContent['FLASH_MODE_ACTIVE'] = $data['active'] ? 'true' : 'false';

        $envText = '';
        foreach ($envContent as $key => $value) {
            $envText .= "{$key}=\"{$value}\"\n";
        }

        if (file_put_contents('/var/www/.env', $envText) !== false) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to write to .env']);
        }
        exit;
    }

    session_start();
    if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit;
    }

    $envContent = parse_ini_file('/var/www/.env');
    $envContent['ANNOUNCEMENT_MESSAGE'] = $data['message'] ?? '';
    $envContent['ANNOUNCEMENT_ACTIVE'] = isset($data['active']) && $data['active'] ? 'true' : 'false';

    $envText = '';
    foreach ($envContent as $key => $value) {
        $envText .= "{$key}=\"{$value}\"\n";
    }

    if (file_put_contents('/var/www/.env', $envText) !== false) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to write to .env']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_flash') {
    header('Content-Type: application/json');
    echo json_encode([
        'active' => $env['FLASH_MODE_ACTIVE'] ?? 'false'
    ]);
    exit;
}
?>
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
    <title>Project Void - Admin Panel</title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/admin.css?v=<?php echo time(); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="particles-js"></div>
    <?php include 'loading-screen.php'; ?>

    <main>
        <div class="admin-container">
            <div id="loginPanel" class="admin-panel">
                <h1>Admin Login</h1>
                <div class="login-form">
                    <input type="text" id="adminUsername" placeholder="Username" autocomplete="off">
                    <input type="password" id="adminPassword" placeholder="Password" autocomplete="off">
                    <button id="loginButton">Login</button>
                    <div id="loginStatus" class="status-message"></div>
                </div>
            </div>

            <div id="adminPanel" class="admin-panel" style="display: none;">
                <h1>Admin Panel</h1>
                <div class="admin-content">
                    <div class="admin-section">
                        <h2>Global Announcement</h2>
                        <div class="announcement-controls">
                            <textarea id="announcementMessage" placeholder="Enter announcement message"></textarea>
                            <div class="button-group">
                                <button id="updateAnnouncement" class="admin-button">Update Announcement</button>
                                <button id="disableAnnouncement" class="admin-button" style="display: none;">Disable Announcement</button>
                            </div>
                        </div>
                    </div>
                    <div class="admin-section">
                        <h2>User Simulation</h2>
                        <div class="simulation-controls">
                            <div class="simulation-buttons">
                                <div class="input-group">
                                    <input type="number" id="simulationCount" min="1" value="10" placeholder="Number of users">
                                    <button id="simulateUsers" class="admin-button">Add Simulated Users</button>
                                </div>
                                <button id="clearSimulation" class="admin-button danger">Clear Simulated Users</button>
                            </div>
                            <div id="simulationStatus" class="status-message"></div>
                        </div>
                    </div>
                    <div class="admin-section">
                        <h2>Settings</h2>
                        <div class="flash-controls">
                            <button id="toggleFlash" class="admin-button">Enable Flash Mode</button>
							<button onclick="window.location.href='admin_users.php';" class="admin-button">User Settings</button>
                        </div>
                    </div>
                    <div class="admin-section">
                        <h2>Page Statistics</h2>
                        <div class="statistics-container">
                            <table id="pageStatistics" class="statistics-table">
                                <thead>
                                    <tr>
                                        <th>Page</th>
                                        <th>Users</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Data will be populated by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script>
        // Define adminToken at the top level scope
        const adminToken = <?php echo json_encode($admin_token); ?>;

        document.addEventListener('DOMContentLoaded', () => {
            const loginPanel = document.getElementById('loginPanel');
            const adminPanel = document.getElementById('adminPanel');
            const loginButton = document.getElementById('loginButton');
            const loginStatus = document.getElementById('loginStatus');
            const updateAnnouncementBtn = document.getElementById('updateAnnouncement');
            const disableAnnouncementBtn = document.getElementById('disableAnnouncement');
            const announcementMessage = document.getElementById('announcementMessage');
            const toggleFlashBtn = document.getElementById('toggleFlash');
            let isFlashActive = false;

            if (sessionStorage.getItem('isAdmin') === 'true') {
                loginPanel.style.display = 'none';
                adminPanel.style.display = 'block';
                updatePageStatistics();
                setInterval(updatePageStatistics, 1000);
            }

            fetch('/admin.php?action=get_announcement')
                .then(response => response.json())
                .then(data => {
                    if (data.active === 'true' && data.message) {
                        announcementMessage.value = data.message;
                        announcementMessage.readOnly = true;
                        updateAnnouncementBtn.style.display = 'none';
                        disableAnnouncementBtn.style.display = 'inline-block';
                    } else {
                        announcementMessage.value = '';
                        announcementMessage.readOnly = false;
                        updateAnnouncementBtn.style.display = 'inline-block';
                        disableAnnouncementBtn.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Failed to load announcement:', error);
                });

            fetch('/admin.php?action=get_flash')
                .then(response => response.json())
                .then(data => {
                    isFlashActive = data.active === 'true';
                    updateFlashButton();
                });

            loginButton.addEventListener('click', async () => {
                const username = document.getElementById('adminUsername').value;
                const password = document.getElementById('adminPassword').value;

                try {
                    const response = await fetch('admin.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password })
                    });

                    const data = await response.json();

                    if (data.success) {
                        sessionStorage.setItem('isAdmin', 'true');
                        loginPanel.style.display = 'none';
                        adminPanel.style.display = 'block';
                        loginStatus.textContent = '';
                        updatePageStatistics();
                        setInterval(updatePageStatistics, 1000);
                    } else {
                        loginStatus.textContent = 'Invalid credentials';
                        loginStatus.style.color = '#ff4444';
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    loginStatus.textContent = 'Login failed. Please try again.';
                    loginStatus.style.color = '#ff4444';
                }
            });

            updateAnnouncementBtn.addEventListener('click', async () => {
                if (!announcementMessage.value.trim()) {
                    alert('Please enter an announcement message');
                    return;
                }

                try {
                    const response = await fetch('/admin.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: announcementMessage.value,
                            active: true
                        })
                    });

                    const data = await response.json();
                    if (data.success) {
                        announcementMessage.readOnly = true;
                        updateAnnouncementBtn.style.display = 'none';
                        disableAnnouncementBtn.style.display = 'inline-block';
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            disableAnnouncementBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('/admin.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: '',
                            active: false
                        })
                    });

                    const data = await response.json();
                    if (data.success) {
                        announcementMessage.value = '';
                        announcementMessage.readOnly = false;
                        disableAnnouncementBtn.style.display = 'none';
                        updateAnnouncementBtn.style.display = 'inline-block';
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            toggleFlashBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('/admin.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'toggle_flash',
                            active: !isFlashActive
                        })
                    });

                    const data = await response.json();
                    if (data.success) {
                        isFlashActive = !isFlashActive;
                        updateFlashButton();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            function updateFlashButton() {
                toggleFlashBtn.textContent = isFlashActive ? 'Disable Flash Mode' : 'Enable Flash Mode';
                toggleFlashBtn.style.backgroundColor = isFlashActive ? 'rgba(255, 0, 0, 0.2)' : '';
            }

            const simulateUsersBtn = document.getElementById('simulateUsers');
            const clearSimulationBtn = document.getElementById('clearSimulation');
            const simulationCount = document.getElementById('simulationCount');
            const simulationStatus = document.getElementById('simulationStatus');

            simulateUsersBtn.addEventListener('click', async () => {
                const count = parseInt(simulationCount.value);
                if (isNaN(count) || count < 1) {
                    alert('Please enter a valid number greater than 0');
                    return;
                }

                try {
                    const response = await fetch('https://projectvoid.is-not-a.dev/api/simulate-users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            count,
                            adminToken  // Use the PHP-provided token
                        })
                    });

                    const data = await response.json();
                    if (data.success) {
                        simulationStatus.textContent = `Added ${count} simulated users. Total users: ${data.totalCount}`;
                        simulationStatus.style.color = '#39ff14';
                    }
                } catch (error) {
                    console.error('Error:', error);
                    simulationStatus.textContent = 'Failed to add simulated users';
                    simulationStatus.style.color = '#ff4444';
                }
            });

            clearSimulationBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('https://projectvoid.is-not-a.dev/api/clear-simulated', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            adminToken  // Use the PHP-provided token
                        })
                    });

                    const data = await response.json();
                    if (data.success) {
                        simulationStatus.textContent = `Cleared all simulated users. Total users: ${data.totalCount}`;
                        simulationStatus.style.color = '#39ff14';
                    }
                } catch (error) {
                    console.error('Error:', error);
                    simulationStatus.textContent = 'Failed to clear simulated users';
                    simulationStatus.style.color = '#ff4444';
                }
            });

            // Add function to update statistics
            async function updatePageStatistics() {
                try {
                    const response = await fetch('https://projectvoid.is-not-a.dev/api/page-statistics');
                    const data = await response.json();
                    
                    if (data.success) {
                        const tbody = document.querySelector('#pageStatistics tbody');
                        tbody.innerHTML = '';
                        
                        data.statistics.sort((a, b) => b.count - a.count).forEach(stat => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${stat.title}</td>
                                <td>${stat.count}</td>
                            `;
                            tbody.appendChild(row);
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch page statistics:', error);
                }
            }
        });
    </script>
</body>
</html>