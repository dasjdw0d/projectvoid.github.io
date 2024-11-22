<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $message = $data['message'] ?? '';

    if (empty($message)) {
        echo json_encode(['error' => 'No message provided']);
        exit;
    }

    // Call Python script with the message
    $command = escapeshellcmd("python3 " . __DIR__ . "/handler.py " . escapeshellarg($message));
    $response = shell_exec($command);

    if ($response === null) {
        echo json_encode(['error' => 'Failed to execute Python script']);
        exit;
    }

    // Log for debugging
    error_log("Python Response: " . $response);

    echo json_encode(['response' => $response]);
} else {
    echo json_encode(['error' => 'Invalid request method']);
} 