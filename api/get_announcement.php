<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Access-Control-Allow-Origin: https://projectvoid.is-not-a.dev/');
header('Access-Control-Allow-Methods: GET');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

$announcementsFile = dirname(__DIR__) . '/data/announcements.json';

if (file_exists($announcementsFile)) {
    $content = file_get_contents($announcementsFile);
    if ($content === false) {
        http_response_code(500);
        die(json_encode(['error' => 'Failed to read announcements']));
    }
    echo htmlspecialchars($content, ENT_NOQUOTES, 'UTF-8');
} else {
    echo json_encode(['message' => null, 'active' => false]);
} 