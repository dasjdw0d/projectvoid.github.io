<?php
session_start();
require_once '../auth.php';

if (!isAdminAuthenticated()) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$file = $data['file'] ?? '';
$content = $data['content'] ?? '';

if (!isValidFilePath($file)) {
    echo json_encode(["status" => "error", "message" => "Invalid file path"]);
    exit();
}

$fullPath = __DIR__ . '/../' . $file;

if (!is_writable($fullPath)) {
    echo json_encode(["status" => "error", "message" => "File is not writable"]);
    exit();
}

if (file_put_contents($fullPath, $content) !== false) {
    echo json_encode(["status" => "success", "message" => "File saved successfully"]);
} else {
    $error = error_get_last();
    echo json_encode([
        "status" => "error", 
        "message" => "Failed to save file: " . ($error['message'] ?? 'Unknown error')
    ]);
} 