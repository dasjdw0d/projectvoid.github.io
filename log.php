<?php
// Get the POST data
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Get timestamp
$timestamp = date('Y-m-d H:i:s');

// Format log entry
$log_entry = $timestamp . " - IP: " . $data['ip'] . "\n";

// Append to log file
file_put_contents('ip_log.txt', $log_entry, FILE_APPEND);
?>