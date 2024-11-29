<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'auth.php';

loadEnv();

$announcementsFile = __DIR__ . '/data/announcements.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if (isAdminAuthenticated()) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode([
                "status" => "error", 
                "message" => "Invalid credentials. Eat hazel nuts..."
            ]);
        }
        exit();
    }
    
    // For other POST requests, verify authentication
    if (!isAdminAuthenticated() || !checkSessionSecurity()) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }
    
    // Handle announcement updates
    if (isset($_POST['action'])) {
        $announcement = [
            'message' => '',
            'active' => false,
            'timestamp' => time(),
        ];

        switch ($_POST['action']) {
            case 'update':
                if (!empty($_POST['message'])) {
                    $announcement['message'] = $_POST['message'];
                    $announcement['active'] = true;
                } else {
                    echo json_encode([
                        "status" => "error",
                        "message" => "Message cannot be empty for update."
                    ]);
                    exit();
                }
                break;

            case 'disable':
                break;

            default:
                echo json_encode([
                    "status" => "error", 
                    "message" => "Invalid action."
                ]);
                exit();
        }
        
        if (file_put_contents($announcementsFile, json_encode($announcement))) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to save announcement."]);
        }
        exit();
    }
}

$currentAnnouncement = file_exists($announcementsFile) ? json_decode(file_get_contents($announcementsFile), true) : null;
$hasActiveAnnouncement = $currentAnnouncement && $currentAnnouncement['active'] && !empty($currentAnnouncement['message']);
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
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/admin.css?v=<?php echo time(); ?>">
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="js/particles-config.js?v=<?php echo time(); ?>"></script>
    <script src="js/site-settings.js?v=<?php echo time(); ?>"></script>
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs/loader.js"></script>
</head>
<body>
    <div id="particles-js"></div>

    <nav>
        <div class="nav-logo">
            <img src="images/favicon.png" alt="Project Void Logo" class="nav-logo-img">
        </div>
        <div class="nav-links">
            <a href="index.php">Home</a>
            <a href="games.php">Games</a>
            <a href="chat.php">Chatroom</a>
            <a href="ai.php">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>

    <main>
        <div class="container">
            <h2>Project Void Admin Panel</h2>
            
            <div id="loginForm" class="login-form">
                <form class="login-box" onsubmit="login(event)">
                    <h3>Admin Login</h3>
                    <input type="text" 
                           id="username" 
                           name="username"
                           placeholder="Username..." 
                           autocomplete="username"
                           required>
                    <input type="password" 
                           id="password" 
                           name="password"
                           placeholder="Password..." 
                           autocomplete="current-password"
                           required>
                    <button type="submit">Login</button>
                </form>
            </div>

            <div id="adminPanel" style="display: none;">
                <div class="admin-nav">
                    <button class="admin-nav-btn active" onclick="showSection('announcements')">Announcements</button>
                    <button class="admin-nav-btn" onclick="showSection('code')">Code Editor</button>
                    <button class="admin-nav-btn danger" onclick="logout()">Logout</button>
                </div>

                <div id="announcements" class="admin-section active">
                    <?php if ($hasActiveAnnouncement): ?>
                        <div class="current-announcement">
                            ✅ Current Active Announcement: "<?php echo htmlspecialchars($currentAnnouncement['message']); ?>"
                        </div>
                    <?php endif; ?>

                    <form onsubmit="handleAnnouncement(event)">
                        <textarea id="message" placeholder="Enter your announcement message" <?php 
                            echo $hasActiveAnnouncement ? 'readonly' : ''; 
                        ?>><?php 
                            echo $hasActiveAnnouncement ? 
                                htmlspecialchars($currentAnnouncement['message']) : ''; 
                        ?></textarea>
                        
                        <div class="button-group">
                            <?php if (!$hasActiveAnnouncement): ?>
                                <button type="submit" name="action" value="update">Update Announcement</button>
                            <?php endif; ?>
                            <?php if ($hasActiveAnnouncement): ?>
                                <button type="submit" name="action" value="disable" class="danger">Disable Announcement</button>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>

                <div id="code" class="admin-section">
                    <div class="code-header">
                        <h3>Code Editor</h3>
                        <button class="fullscreen-btn" onclick="toggleFullscreen(this)">
                            <svg class="fullscreen-icon" viewBox="0 0 24 24">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                            </svg>
                            <span>Fullscreen</span>
                        </button>
                    </div>
                    <div class="file-browser">
                        <div class="explorer">
                            <div class="explorer-header">
                                <span>EXPLORER</span>
                            </div>
                            <div id="fileTree" class="file-tree">
                                <!-- File tree will be populated by JavaScript -->
                            </div>
                        </div>
                        <div class="editor-container">
                            <div class="editor-tabs" id="editorTabs">
                                <!-- Tabs will be populated by JavaScript -->
                            </div>
                            <div id="editor"></div>
                            <div class="editor-actions">
                                <button onclick="saveCurrentFile()" class="save-btn">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Check session storage on page load
        document.addEventListener('DOMContentLoaded', () => {
            if (sessionStorage.getItem('adminAuthenticated') === 'true') {
                showAdminPanel();
            }
        });

        function showAdminPanel() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            loadFileTree();
        }

        function login(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    sessionStorage.setItem('adminAuthenticated', 'true');
                    showAdminPanel();
                } else {
                    alert(data.message || 'Login failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed');
            });
        }

        function handleAnnouncement(event) {
            event.preventDefault();
            const form = event.target;
            const action = form.querySelector('button[type="submit"]').value;
            const message = document.getElementById('message').value;

            fetch('admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=${action}&message=${encodeURIComponent(message)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.reload();
                } else {
                    alert(data.message || 'Failed to update announcement');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update announcement');
            });
        }

        // Add these new functions for the code editor
        function logout() {
            sessionStorage.removeItem('adminAuthenticated');
            window.location.reload();
        }

        function showSection(sectionId) {
            // Remove active class from all buttons and sections
            document.querySelectorAll('.admin-nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding section
            document.querySelector(`button[onclick="showSection('${sectionId}')"]`).classList.add('active');
            document.getElementById(sectionId).classList.add('active');
        }

        // Code Editor functionality
        let editor = null;
        let openFiles = new Map(); // Stores file content and unsaved status
        let currentFile = null;
        let fileTreeData = []; // Store the file tree data globally

        function loadFileTree() {
            fetch('/api/get_file_tree.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        fileTreeData = data.tree;
                        updateFileTree();
                    } else {
                        console.error('Failed to load file tree:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error loading file tree:', error);
                });
        }

        // Initialize Monaco Editor
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            editor = monaco.editor.create(document.getElementById('editor'), {
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: true },
                automaticLayout: true,
                scrollBeyondLastLine: false,
            });

            // Add change listener
            editor.onDidChangeModelContent(() => {
                if (currentFile) {
                    const fileData = openFiles.get(currentFile);
                    if (fileData && !fileData.unsaved) {
                        fileData.unsaved = true;
                        openFiles.set(currentFile, fileData);
                        updateTabs();
                        updateFileTree();
                    }
                }
            });
        });

        // Add event listener for code section button
        document.addEventListener('DOMContentLoaded', () => {
            const codeButton = document.querySelector('button[onclick="showSection(\'code\')"]');
            if (codeButton) {
                codeButton.addEventListener('click', () => {
                    if (!fileTreeData.length) {
                        loadFileTree();
                    }
                });
            }
        });

        function loadFile(filePath, element) {
            if (!filePath) return;

            // Update selected file in tree
            document.querySelectorAll('.file-item').forEach(item => {
                item.classList.remove('selected');
            });
            element.classList.add('selected');

            // If file is already open, just switch to it
            if (openFiles.has(filePath)) {
                switchToFile(filePath);
                return;
            }

            fetch(`/api/get_file.php?file=${encodeURIComponent(filePath)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const ext = filePath.split('.').pop().toLowerCase();
                        const language = {
                            'js': 'javascript',
                            'css': 'css',
                            'php': 'php',
                            'html': 'html',
                            'json': 'json',
                            'md': 'markdown',
                            'sql': 'sql',
                            'txt': 'plaintext',
                            'xml': 'xml',
                            'yml': 'yaml',
                            'yaml': 'yaml'
                        }[ext] || 'plaintext';

                        openFiles.set(filePath, {
                            content: data.content,
                            language: language,
                            unsaved: false
                        });

                        switchToFile(filePath);
                        updateTabs();
                    } else {
                        console.error('Failed to load file:', data.message);
                        alert(data.message || 'Failed to load file');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to load file');
                });
        }

        function switchToFile(filePath) {
            const fileData = openFiles.get(filePath);
            if (!fileData) return;

            currentFile = filePath;
            const model = monaco.editor.createModel(fileData.content, fileData.language);
            editor.setModel(model);
            updateTabs();
        }

        function closeFile(filePath, event) {
            event.stopPropagation();
            
            const fileData = openFiles.get(filePath);
            if (fileData && fileData.unsaved) {
                if (!confirm('You have unsaved changes. Close anyway?')) {
                    return;
                }
            }

            openFiles.delete(filePath);
            
            if (currentFile === filePath) {
                const remainingFiles = Array.from(openFiles.keys());
                if (remainingFiles.length > 0) {
                    switchToFile(remainingFiles[0]);
                } else {
                    currentFile = null;
                    editor.setModel(null);
                }
            }
            
            updateTabs();
            updateFileTree();
        }

        function updateTabs() {
            const tabsContainer = document.getElementById('editorTabs');
            tabsContainer.innerHTML = Array.from(openFiles.entries()).map(([file, data]) => `
                <div class="editor-tab ${currentFile === file ? 'active' : ''}" onclick="switchToFile('${file}')">
                    <span>${file.split('/').pop()}</span>
                    ${data.unsaved ? '<div class="unsaved-indicator"></div>' : ''}
                    <span class="tab-close" onclick="closeFile('${file}', event)">×</span>
                </div>
            `).join('');
        }

        function updateFileTree() {
            const fileTree = document.getElementById('fileTree');
            if (!fileTreeData || !fileTreeData.length) {
                // If no file tree data, try to load it
                loadFileTree();
                return;
            }
            fileTree.innerHTML = renderFileTree(fileTreeData);
        }

        function renderFileTree(items) {
            return items.map(item => {
                if (item.type === 'directory') {
                    return `
                        <div class="file-item folder-item" onclick="toggleFolder(event, this)">
                            <span class="folder-icon">▶</span>
                            <span>📁 ${item.name}</span>
                        </div>
                        <div class="directory-item" style="display: none;">
                            ${renderFileTree(item.children)}
                        </div>
                    `;
                } else {
                    const fileData = openFiles.get(item.path);
                    const ext = item.name.split('.').pop().toLowerCase();
                    return `
                        <div class="file-item" onclick="loadFile('${item.path}', this)" data-ext="${ext}">
                            <span>${item.name}</span>
                            ${fileData?.unsaved ? '<div class="unsaved-indicator"></div>' : ''}
                        </div>
                    `;
                }
            }).join('');
        }

        function saveCurrentFile() {
            if (!currentFile) return;

            const content = editor.getValue();
            
            fetch('/api/save_file.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    file: currentFile,
                    content: content
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const fileData = openFiles.get(currentFile);
                    fileData.unsaved = false;
                    openFiles.set(currentFile, fileData);
                    updateTabs();
                    updateFileTree();
                }
                alert(data.message || 'Failed to save file');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to save file');
            });
        }

        // Add these new functions
        function toggleFolder(event, element) {
            event.stopPropagation();
            const directoryContent = element.nextElementSibling;
            const folderIcon = element.querySelector('.folder-icon');
            
            if (directoryContent.style.display === 'none') {
                directoryContent.style.display = 'block';
                folderIcon.textContent = '▼';
            } else {
                directoryContent.style.display = 'none';
                folderIcon.textContent = '▶';
            }
        }

        function toggleFullscreen(button) {
            const adminSection = document.getElementById('code');
            const isFullscreen = adminSection.classList.toggle('fullscreen');
            document.body.classList.toggle('fullscreen-active', isFullscreen);
            
            // Calculate nav height and set it as a CSS variable
            const navHeight = document.querySelector('nav').offsetHeight;
            const announcementHeight = document.querySelector('.announcement-bar')?.offsetHeight || 0;
            const totalOffset = navHeight + announcementHeight;
            document.documentElement.style.setProperty('--nav-height', `${totalOffset}px`);
            
            // Update button content
            if (isFullscreen) {
                button.innerHTML = `
                    <svg class="fullscreen-icon" viewBox="0 0 24 24">
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <span>Exit Fullscreen</span>
                `;
            } else {
                button.innerHTML = `
                    <svg class="fullscreen-icon" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <span>Fullscreen</span>
                `;
            }

            // Trigger Monaco Editor layout update
            if (editor) {
                setTimeout(() => editor.layout(), 100);
            }
        }

        // Add keyboard shortcut for fullscreen (F11 or Ctrl/Cmd + Shift + F)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F11' || (e.key === 'F' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
                e.preventDefault();
                const button = document.querySelector('.fullscreen-btn');
                if (button) {
                    button.click();
                }
            }
        });
    </script>
</body>
</html>
