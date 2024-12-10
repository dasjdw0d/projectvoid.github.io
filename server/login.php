<?php
// Start output buffering
ob_start();

// Define a constant for security
define('aosw98e3398hdhb', true);

// Include necessary configuration and initialization files
require_once "../xiconfig/config.php";
require_once "../xiconfig/init.php";

// Validate the HTTP referer
if (empty($_SERVER["HTTP_REFERER"]) || !filter_var($_SERVER["HTTP_REFERER"], FILTER_VALIDATE_URL)) {
    header("Location: ../index");
    exit;
}

// Redirect if user is already logged in
if ($user->LoggedIn($odb)) {
    header('Location: home');
    exit();
}

// Sanitize and retrieve input parameters
$type = filter_input(INPUT_GET, 'type', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$token = htmlspecialchars($_SESSION['token'], ENT_QUOTES, 'UTF-8');

// Function to record failed login attempts
function recordFailedLogin($username) {
	global $odb;
    $stmt = $odb->prepare("INSERT INTO `login_attempts` (username, attempt_time) VALUES (:username, NOW())");
    $stmt->execute([':username' => $username]);
}

// Function to clear login attempts
function clearLoginAttempts($username) {
	global $odb;
    $stmt = $odb->prepare("DELETE FROM `login_attempts` WHERE `username` = :username");
    $stmt->execute([':username' => $username]);
}

// Function to return a JSON error response
function jsonError($message) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => $message]);
    exit;
}

function jsonSuccess($message) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => $message]);
    exit;
}

// Login case
if ($type === "login") {
    // Sanitize and retrieve login parameters
    $csrftoken = filter_input(INPUT_POST, 'csrf', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Check if fields are empty
    if (empty($username) || empty($password)) {
        jsonError("Please fill in all fields.");
    }
    
    // Check if username is alphanumeric and length is within valid range
    if (!ctype_alnum($username)) {
        jsonError("Username should only contain alphanumeric characters.");
    } elseif (strlen($username) < 6 || strlen($username) > 20) {
        jsonError("Username must be between 6 and 20 characters.");
    }
    
    // Check if password length is within valid range
    if (strlen($password) < 7 || strlen($password) > 30) {
        jsonError("Password must be between 7 and 30 characters.");
    }

    // Validate the CSRF token
    if (empty($csrftoken) || !$xWAF->verifyCSRF($csrftoken)) {
        jsonError('CSRF token has expired. Refreshing the page...<meta http-equiv="refresh" content="2;URL=index">');
    }

    // Define lockout parameters
    $max_attempts = 5;
    $lockout_time = 15 * 60; // 15 minutes

    // Calculate the time threshold in UTC
    $time_threshold_utc = gmdate('Y-m-d H:i:s', time() - $lockout_time);

    // Check login attempts
    $stmt = $odb->prepare("SELECT COUNT(*) AS attempts, MAX(attempt_time) AS `last_attempt` FROM `login_attempts` WHERE `username` = :username AND `attempt_time` > :time_threshold");
    $stmt->execute([
        ':username' => $username,
        ':time_threshold' => $time_threshold_utc
    ]);
    $attempt_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($attempt_data['attempts'] >= $max_attempts) {
        $user_timezone = 'America/Toronto'; // Replace with the user's timezone
        $last_attempt_time = new DateTime($attempt_data['last_attempt'], new DateTimeZone('UTC'));
        $last_attempt_time->setTimezone(new DateTimeZone($user_timezone));

        $current_time = new DateTime('now', new DateTimeZone($user_timezone));
        $remaining_time = $lockout_time - ($current_time->getTimestamp() - $last_attempt_time->getTimestamp());

        jsonError("Too many failed login attempts. Please try again after " . ceil(htmlspecialchars($remaining_time) / 60) . " minutes.");
    }

    // Check login details
    $statement = $odb->prepare("SELECT * FROM `users` WHERE `username` = :username LIMIT 1");
    $statement->execute([':username' => $username]);
    $result = $statement->fetch();

    if ($result && password_verify($password, $result["password"])) {
        // Check if the user is banned
        $SQL = $odb->prepare("SELECT `status` FROM `users` WHERE `username` = :username");
        $SQL->execute([':username' => $username]);
        $status = $SQL->fetchColumn();
        if ($status == 1) {
            jsonError("This account has been suspended.");
        }

        // Regenerate session ID and delete old session
        session_regenerate_id(true);

        // Generate a new session token
        $sessionToken = bin2hex(random_bytes(32));

        // Update the user's session token in the database
        $updateTokenStmt = $odb->prepare("UPDATE `users` SET `session_token` = :session_token WHERE `ID` = :id");
        $updateTokenStmt->execute([
            ':session_token' => $sessionToken,
            ':id' => $result['ID']
        ]);

        // Set session and cookie
        $_SESSION['username'] = $result['username'];
        $_SESSION['ID'] = $result['ID'];
        setcookie('token', $sessionToken, [
            'expires' => time() + 3600, // 1 hour
            'path' => '/',
            'domain' => '',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        // Clear login attempts on successful login
        clearLoginAttempts($username);

        jsonSuccess('Logged in successfully. Redirecting to the homepage...<meta http-equiv="refresh" content="2;URL=home">');
    } else {
        // Record failed login attempt
        recordFailedLogin($username);
        jsonError("The provided username or password is incorrect. ".$attempt_data['attempts']."");
    }
}

?>