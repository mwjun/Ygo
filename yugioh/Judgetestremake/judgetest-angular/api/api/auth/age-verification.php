<?php
declare(strict_types=1);

/**
 * Age Verification API Endpoint
 * Single Responsibility: Handle age verification
 * Loosely Coupled: Uses security and validation modules
 */

require_once __DIR__ . '/../../includes/headers.php';
require_once __DIR__ . '/../../includes/db_yugioh.php';
require_once __DIR__ . '/../../includes/validation.php';
require_once __DIR__ . '/../../includes/security.php';

// Set headers
SecurityHeaders::setJson();

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$validation = InputValidator::validateAgeData($input);
if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $validation['errors']
    ]);
    exit();
}

// Calculate age
$birthDate = DateTime::createFromFormat('Y-m-d', $input['birthDate']);
$today = new DateTime();
$age = $today->diff($birthDate)->y;

// Check minimum age
$minimumAge = $_ENV['MINIMUM_AGE'] ?? 16;
if ($age < $minimumAge) {
    echo json_encode([
        'success' => false,
        'verified' => false,
        'message' => 'Must be ' . $minimumAge . ' or older',
        'age' => $age
    ]);
    exit();
}

// Create session
$security = new SecurityManager($conn);
$session = $security->createSession(
    $_SERVER['REMOTE_ADDR'] ?? '',
    $_SERVER['HTTP_USER_AGENT'] ?? '',
    $input['language'] ?? 'en'
);

if (!$session['success']) {
    http_response_code(500);
    echo json_encode($session);
    exit();
}

// Set secure cookie
setcookie('session_token', $session['token'], [
    'expires' => time() + (2 * 60 * 60),
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Strict',
    'secure' => isset($_SERVER['HTTPS'])
]);

// Return success
echo json_encode([
    'success' => true,
    'verified' => true,
    'sessionToken' => $session['token'],
    'expiresIn' => 7200,
    'age' => $age
]);

