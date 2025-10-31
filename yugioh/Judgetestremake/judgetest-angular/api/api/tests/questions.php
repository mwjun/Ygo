<?php
declare(strict_types=1);

/**
 * Get Test Questions API Endpoint
 * Single Responsibility: Fetch questions for a test
 * Loosely Coupled: Uses security module, database connection
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

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Validate session
$security = new SecurityManager($conn);
$security->requireSession();

// Get parameters
$testName = $_GET['testName'] ?? 'demojudge';
$language = $_GET['language'] ?? 'en';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

// Validate inputs
if (!InputValidator::validateTestType($testName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid test type']);
    exit();
}

if (!InputValidator::validateLanguage($language)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid language']);
    exit();
}

// Fetch questions using prepared statement
// Note: language column doesn't exist in old database structure, so we query without it
$stmt = $conn->prepare("
    SELECT id, question as questionText, version_num as versionNum, 
           test_name as testName
    FROM questions 
    WHERE version_num = 1.0 
    AND test_name = ? 
    AND (is_active = 1 OR is_active IS NULL)
    ORDER BY RAND() 
    LIMIT ?
");

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit();
}

$stmt->bind_param('si', $testName, $limit);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    // Don't return correct answer ID
    unset($row['correct_answer_id']);
    
    // Fetch answers for this question
    $answerStmt = $conn->prepare("
        SELECT id, answer as answerText, display_order 
        FROM answers 
        WHERE question_id = ? 
        AND is_active = 1 
        ORDER BY display_order, id
    ");
    
    $answerStmt->bind_param('i', $row['id']);
    $answerStmt->execute();
    $answerResult = $answerStmt->get_result();
    
    $answers = [];
    while ($answerRow = $answerResult->fetch_assoc()) {
        $answers[] = $answerRow;
    }
    
    $row['answers'] = $answers;
    $questions[] = $row;
    
    $answerStmt->close();
}

$stmt->close();

// Return questions
echo json_encode([
    'success' => true,
    'testType' => $testName,
    'questions' => $questions,
    'total' => count($questions)
]);

