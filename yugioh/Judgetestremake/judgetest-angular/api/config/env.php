<?php
declare(strict_types=1);

/**
 * Load environment variables from .env file
 */

// Load from .env file if it exists
$env_file = __DIR__ . '/.env';
if (file_exists($env_file)) {
    $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Set defaults if not in environment
$_ENV['DB_HOST'] = $_ENV['DB_HOST'] ?? 'localhost';
$_ENV['DB_USER'] = $_ENV['DB_USER'] ?? 'root';
$_ENV['DB_PASS'] = $_ENV['DB_PASS'] ?? '';
$_ENV['DB_NAME'] = $_ENV['DB_NAME'] ?? 'yugioh_test';
$_ENV['APP_ENV'] = $_ENV['APP_ENV'] ?? 'production';
$_ENV['DEBUG'] = $_ENV['DEBUG'] ?? 'false';
$_ENV['MINIMUM_AGE'] = $_ENV['MINIMUM_AGE'] ?? 16;
$_ENV['SESSION_EXPIRY_HOURS'] = $_ENV['SESSION_EXPIRY_HOURS'] ?? 2;

