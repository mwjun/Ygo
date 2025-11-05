<?php
declare(strict_types=1);

/**
 * Get Test Questions API Endpoint
 * Single Responsibility: Fetch questions for a test
 * Loosely Coupled: Uses security module, database connection
 */

require_once __DIR__ . '/../../includes/headers.php';

// Set headers
SecurityHeaders::setJson();

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Load validation first; include DB after normalizing language parameter
require_once __DIR__ . '/../../includes/validation.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Normalize language parameter to legacy 'l' so DB selector picks schema
$language = $_GET['language'] ?? 'en';
$_REQUEST['l'] = $language;

// Now include DB (uses $_REQUEST['l'] internally)
require_once __DIR__ . '/../../includes/db_yugioh.php';

// Get parameters
$testName = $_GET['testName'] ?? 'demojudge';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

// Validate inputs
if (!InputValidator::validateTestType($testName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid test type']);
    exit();
}

<<<<<<< HEAD
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
=======
// Fetch questions using legacy-compatible schema (do not filter by test_name because many rows are NULL)
$stmt = $conn->prepare(
    "SELECT id, question AS questionText, version_num AS versionNum,\n           COALESCE(test_name, '') AS testName\n     FROM questions\n     ORDER BY RAND()\n     LIMIT ?"
);
>>>>>>> 1eda1fb (added security analysis)

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit();
}

<<<<<<< HEAD
$stmt->bind_param('si', $testName, $limit);
=======
$stmt->bind_param('i', $limit);
>>>>>>> 1eda1fb (added security analysis)
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    // Fetch answers for this question (legacy schema)
    $answerStmt = $conn->prepare(
        "SELECT id, answer AS answerText\n         FROM answers\n         WHERE question_id = ?\n         ORDER BY id"
    );

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

