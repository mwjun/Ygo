<?php
declare(strict_types=1);

/**
 * Secure Database Connection
 * - Uses environment variables for credentials
 * - Proper error handling (no information disclosure)
 * - UTF8MB4 encoding for full Unicode support
 */

require_once __DIR__ . '/../config/env.php';

// Get language from request (safely)
$language = isset($_REQUEST['l']) ? strtolower(preg_replace("/[^a-z]/", '', $_REQUEST['l'])) : 'en';

// Map language to database name
$language_databases = [
    'en' => $_ENV['DB_NAME_EN'] ?? '2018_yugioh_test',
    'sp' => $_ENV['DB_NAME_SP'] ?? 'yugioh_test_spanish',
    'de' => $_ENV['DB_NAME_DE'] ?? 'yugioh_test_de',
    'fr' => $_ENV['DB_NAME_FR'] ?? 'yugioh_test_fr',
    'it' => $_ENV['DB_NAME_IT'] ?? 'yugioh_test_it'
];

$dbname = $language_databases[$language] ?? $language_databases['en'];

try {
    // Create connection using environment variables
    $conn = new mysqli(
        $_ENV['DB_HOST'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        $dbname
    );
    
    // Set charset to UTF8MB4 for full Unicode support
    $conn->set_charset('utf8mb4');
    
    // Check connection
    if ($conn->connect_error) {
        // Log error securely (don't expose to user)
        error_log("Database connection failed: " . $conn->connect_error);
        
        // Return generic error to user
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Service temporarily unavailable. Please try again later.'
        ]);
        exit();
    }
    
} catch (Exception $e) {
    // Log the error
    error_log("Database error: " . $e->getMessage());
    
    // Return generic error
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Service temporarily unavailable. Please try again later.'
    ]);
    exit();
}

