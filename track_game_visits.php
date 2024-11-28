<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Add these headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Use relative paths from the root directory
$dataFile = __DIR__ . '/data/game_visits.txt';
$logFile = __DIR__ . '/data/debug.log';

// Log function
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    error_log("[$timestamp] $message"); // Also log to server error log
    @file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Ensure data directory exists
$dataDir = dirname($dataFile);
if (!file_exists($dataDir)) {
    logMessage("Creating data directory: $dataDir");
    if (!@mkdir($dataDir, 0755, true)) {
        logMessage("Failed to create data directory: " . error_get_last()['message']);
        http_response_code(500);
        echo "Failed to create data directory";
        exit;
    }
}

// Log current permissions and ownership
logMessage("Data directory permissions: " . substr(sprintf('%o', fileperms($dataDir)), -4));
logMessage("Data directory owner: " . posix_getpwuid(fileowner($dataDir))['name']);
if (file_exists($dataFile)) {
    logMessage("Data file permissions: " . substr(sprintf('%o', fileperms($dataFile)), -4));
    logMessage("Data file owner: " . posix_getpwuid(fileowner($dataFile))['name']);
}

// Get the game title from the POST request
$gameTitle = $_POST['gameTitle'] ?? '';

if (empty($gameTitle)) {
    http_response_code(400);
    echo "Game title is required";
    exit;
}

// Read existing data
$visits = [];
if (file_exists($dataFile)) {
    $visits = array_filter(explode("\n", file_get_contents($dataFile)));
}

// Parse existing visits into an associative array
$visitsArray = [];
foreach ($visits as $visit) {
    list($game, $count) = explode(':', $visit);
    $visitsArray[$game] = (int)$count;
}

// Increment visit count for the game
$visitsArray[$gameTitle] = ($visitsArray[$gameTitle] ?? 0) + 1;

// Convert back to string format and save
$newData = [];
foreach ($visitsArray as $game => $count) {
    $newData[] = "$game:$count";
}

// Save to file with error checking
$saveResult = file_put_contents($dataFile, implode("\n", $newData));
if ($saveResult === false) {
    error_log("Failed to save game visits to $dataFile");
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save data']);
} else {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Visit recorded successfully']);
}

// Debug output
error_log("Game visit recorded: $gameTitle");
error_log("Current data: " . implode(", ", $newData));
  