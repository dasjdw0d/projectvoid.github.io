<?php
session_start();
require_once '../auth.php';

// Verify admin is logged in
if (!isAdminAuthenticated()) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$file = $_GET['file'] ?? '';

if (!isValidFilePath($file)) {
    echo json_encode(["status" => "error", "message" => "Invalid file path"]);
    exit();
}

$fullPath = __DIR__ . '/../' . $file;
if (!file_exists($fullPath)) {
    echo json_encode(["status" => "error", "message" => "File not found"]);
    exit();
}

$content = file_get_contents($fullPath);
echo json_encode([
    "status" => "success",
    "content" => $content
]); 