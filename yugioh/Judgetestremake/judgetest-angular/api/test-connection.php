<?php
/**
 * Test Database Connection
 * Use this to verify your database connection is working
 */

require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/includes/db_yugioh.php';

header('Content-Type: application/json');

echo json_encode([
    'status' => 'success',
    'message' => 'Database connection successful',
    'server_info' => [
        'host' => $_ENV['DB_HOST'],
        'user' => $_ENV['DB_USER'],
        'database' => $dbname
    ]
]);

