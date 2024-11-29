<?php
session_start();
require_once '../auth.php';

if (!isAdminAuthenticated()) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

function scanDirectory($dir) {
    $result = [];
    $files = scandir($dir);
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..' || $file === '.git') continue;
        
        $path = $dir . '/' . $file;
        $relativePath = str_replace(__DIR__ . '/../', '', $path);
        
        if (is_dir($path)) {
            $result[] = [
                'name' => $file,
                'path' => $relativePath,
                'type' => 'directory',
                'children' => scanDirectory($path)
            ];
        } else {
            $result[] = [
                'name' => $file,
                'path' => $relativePath,
                'type' => 'file'
            ];
        }
    }
    
    // Sort directories first, then files
    usort($result, function($a, $b) {
        if ($a['type'] === $b['type']) {
            return strcasecmp($a['name'], $b['name']);
        }
        return $a['type'] === 'directory' ? -1 : 1;
    });
    
    return $result;
}

$tree = scanDirectory(__DIR__ . '/..');
echo json_encode(["status" => "success", "tree" => $tree]); 