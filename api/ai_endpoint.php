<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON: ' . json_last_error_msg());
        }
        
        $message = $data['message'] ?? '';

        if (empty($message)) {
            throw new Exception('No message provided');
        }

        $pythonScript = realpath(__DIR__ . "/handler.py");
        if (!$pythonScript) {
            throw new Exception('Could not find Python script');
        }

        $message_arg = escapeshellarg($message);
        $command = "python3 " . escapeshellarg($pythonScript) . " {$message_arg} 2>&1";
        
        $response = shell_exec($command);

        if ($response === null) {
            throw new Exception('Failed to execute Python script');
        }

        if (strpos($response, 'Error:') !== false) {
            throw new Exception($response);
        }

        echo json_encode(['response' => $response]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method']);
}