<?php

if (!defined("allowed")) {
    http_response_code(404);
    exit();
}

ob_start();
define('aosw98e3398hdhb', true);
require_once "xiconfig/config.php";
require_once "xiconfig/init.php";

//if (!$user->LoggedIn($odb)) {
   // header("Location: index.php");
   // exit();
//}
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
    <title>Project Void - <?= htmlspecialchars($page, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="stylesheet" href="css/styles.css?v=<?php echo time(); ?>">
	
	<?php
    $cssFiles = [
        'Settings' => 'settings.css',
        'Forms' => 'forms.css',
        'Chatroom' => 'chat.css',
        'Display' => 'display.css',
        'AI Chat' => 'ai.css',
        'Home' => 'home.css',
        'Updates' => 'updates.css',
        'Games' => 'games.css',
        'Misc' => 'misc.css'
    ];
    
    if (isset($cssFiles[$page])) {
        echo '<link rel="stylesheet" href="css/' . $cssFiles[$page] . '?v=' . time() . '">';
    }
	?>
	
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="particles-js"></div>
    <?php include 'loading-screen.php'; ?>

    <nav>
        <div class="nav-logo">
            <img src="images/favicon.png" alt="Project Void Logo" class="nav-logo-img">
        </div>
        <div class="nav-links">
            <a href="home.php">Home</a>
            <a href="games.php">Games</a>
            <a href="ai.php">AI Chat</a>
            <a href="forms.php">Forms</a>
            <a href="settings.php" class="active">Settings</a>
            <a href="updates.php">Updates</a>
            <a href="misc.php">Misc</a>
        </div>
    </nav>
</body>
</html>