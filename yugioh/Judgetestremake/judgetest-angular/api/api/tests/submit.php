<?php
declare(strict_types=1);

/**
 * Submit Test API Endpoint
 * Single Responsibility: Process test submissions and calculate scores
 * Loosely Coupled: Uses validation, security, and database modules
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

// Validate session
$security = new SecurityManager($conn);
$security->requireSession();

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

$validation = InputValidator::validateSubmission($input['user']);
if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $validation['errors']
    ]);
    exit();
}

// Process answers and calculate score
$testName = $input['testName'] ?? 'demojudge';
$answers = $input['answers'] ?? [];
$correctCount = 0;
$totalQuestions = count($answers);
$qaParts = [];

// Validate each answer using prepared statement
foreach ($answers as $questionId => $answerId) {
    // Ensure integers
    $questionId = (int)$questionId;
    $answerId = (int)$answerId;
    
    if ($questionId <= 0 || $answerId <= 0) {
        continue;
    }
    
    // Check if answer is correct
    $stmt = $conn->prepare("
        SELECT id FROM questions 
        WHERE id = ? 
        AND correct_answer_id = ? 
        AND test_name = ? 
        AND is_active = 1
    ");
    
    if (!$stmt) {
        continue;
    }
    
    $stmt->bind_param('iis', $questionId, $answerId, $testName);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $correctCount++;
    }
    
    $qaParts[] = $questionId . ':' . $answerId;
    $stmt->close();
}

$qa = implode('-', $qaParts) . '-';
$score = ($totalQuestions > 0) ? ($correctCount / $totalQuestions * 100) : 0;

// Save result using prepared statement
$stmt = $conn->prepare("
    INSERT INTO result (
        email, score, qa, created, first_name, last_name, 
        cid, version_num, test_name, ip_address, user_agent
    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, 1.0, ?, ?, ?)
");

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save results']);
    exit();
}

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

$stmt->bind_param(
    'sdssssss',
    $validation['data']['email'],
    $score,
    $qa,
    $input['user']['firstName'],
    $input['user']['lastName'],
    $input['user']['cardGameId'],
    $testName,
    $ipAddress,
    $userAgent
);

if (!$stmt->execute()) {
    error_log("Execute failed: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save results']);
    $stmt->close();
    exit();
}

$stmt->close();

// Determine passing message based on test type
$passingScore = 80;
$passed = $score >= $passingScore;

$messages = [
    'demojudge' => [
        'pass' => "Congratulations! You've passed the Demo Comprehension Level 1 (DC-1) test. Your results are being processed.",
        'fail' => "You did not pass the Demo Comprehension Level 1 (DC-1) test. Please study and try again."
    ],
    'rulings' => [
        'pass' => "Congratulations! You've passed the Rulings Comprehension Level 1 (RC-1) test. Your results are being processed.",
        'fail' => "You did not pass the Rulings Comprehension Level 1 (RC-1) test. Please study and try again."
    ],
    'policy' => [
        'pass' => "Congratulations! You've passed the Policy Comprehension Level 1 (PC-1) test. Your results are being processed.",
        'fail' => "You did not pass the Policy Comprehension Level 1 (PC-1) test. Please study and try again."
    ]
];

$testMessages = $messages[$testName] ?? $messages['demojudge'];
$message = $passed ? $testMessages['pass'] : $testMessages['fail'];

// Return result
echo json_encode([
    'success' => true,
    'score' => round($score, 2),
    'passed' => $passed,
    'correctAnswers' => $correctCount,
    'totalQuestions' => $totalQuestions,
    'message' => $message
]);

