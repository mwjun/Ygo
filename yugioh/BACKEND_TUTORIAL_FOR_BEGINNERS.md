# 🎓 Backend Development Tutorial for Beginners
## Learn Backend Step-by-Step with Real Examples

**Welcome!** This tutorial will teach you backend development using the actual code we just created.

---

## 📚 Table of Contents

### Part 1: Backend Basics
1. [What is a Backend?](#1-what-is-a-backend)
2. [How Backend & Frontend Work Together](#2-how-backend--frontend-work-together)
3. [Understanding the Request-Response Cycle](#3-understanding-the-request-response-cycle)

### Part 2: Understanding Your Backend Files
4. [The Database Connection](#4-the-database-connection)
5. [The API Endpoints](#5-the-api-endpoints)
6. [Security Modules](#6-security-modules)

### Part 3: Following a Real Example
7. [Example: User Takes a Test](#7-example-user-takes-a-test)
8. [Code Walkthrough](#8-code-walkthrough)

---

## 1. What is a Backend?

Think of a website like a restaurant:

### **Frontend = The Menu & Dining Room**
- What customers see
- Where customers interact
- Your Angular app

### **Backend = The Kitchen**
- Where food is prepared (data is processed)
- Where ingredients are stored (database)
- Hidden from customers
- Your PHP API

### **Database = The Pantry**
- Stores all ingredients (questions, answers, results)
- Organized and secure
- Your MySQL database

### **Real Example:**
When you take a test on the website:

```
1. You see the test page (Frontend - Angular)
   ↓
2. You click "Start Test"
   ↓
3. Frontend asks Backend: "Give me questions!"
   ↓
4. Backend goes to Database: "Get me questions"
   ↓
5. Database: "Here are 20 random questions"
   ↓
6. Backend: "Here are the questions for the user"
   ↓
7. Frontend displays the questions
```

**You only see steps 1 and 7. Steps 3-6 happen behind the scenes!**

---

## 2. How Backend & Frontend Work Together

### **Visual Flow:**

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Frontend (Angular - What you see)        │  │
│  │                                                   │  │
│  │  [Test Biztitre: "Demo Judge Test"]             │  │
│  │  [Button: Start Test]                            │  │
│  │                                                   │  │
│  │  When you click "Start Test":                    │  │
│  │  → Sends HTTP Request to Backend                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTP Request: "GET /api/tests/questions.php"
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Backend Server (PHP API)                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Backend receives request                 │  │
│  │                                                   │  │
│  │  → Validates user session                       │  │
│  │  → Connects to database                         │  │
│  │  → Gets questions                               │  │
│  │  → Returns JSON response                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        │ SQL Query: "SELECT * FROM questions..."
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Database (MySQL)                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Database stores questions                 │  │
│  │                                                   │  │
│  │  questions table:                                │  │
│  │  - id: 1, question: "What is...", test: demo... │  │
│  │  - id: 2, question: "When does...", test: demo... │  │
│  │                                                   │  │
│  │  Returns: [20 random questions]                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Understanding the Request-Response Cycle

### **The 4 Steps:**

1. **REQUEST** - Frontend asks for something
2. **PROCESS** - Backend does work
3. **RESPONSE** - Backend sends result
4. **DISPLAY** - Frontend shows result

### **Example: User Takes a Test**

Let's trace through what happens when a user takes the test:

#### **Step 1: Request**
```javascript
// Frontend (Angular) sends request
fetch('http://localhost/api/tests/questions.php?testName=demojudge')
```
**Sends**: HTTP GET request

#### **Step 2: Process (Backend)**
```php
// Backend receives request
$testName = $_GET['testName'];  // Gets 'demojudge'

// Connects to database
$conn = new mysqli(...);

// Gets questions
$result = $conn->query("SELECT * FROM questions...");

// Formats response
$questions = formatData($result);
```

#### **Step 3: Response**
```json
{
  "success": true,
  "questions": [
    {"id": 1, "question": "What is...", "answers": [...]},
    {"id": 2, "question": "When does...", "answers": [...]}
  ]
}
```

#### **Step 4: Display (Frontend)**
```typescript
// Frontend receives response
this.questions = response.questions;
// Displays questions on screen
```

---

## 4. The Database Connection

### **File**: `includes/db_yugioh.php`

**What it does**: Connects your PHP code to the MySQL database

### **Step-by-Step Explanation:**

```php
<?php
// 1. Load environment variables (credentials)
require_once __DIR__ . '/../config/env.php';

// 2. Get language from URL (e.g., ?l=en)
$language = $_REQUEST['l'] ?? 'en';

// 3. Choose database based on language
$databases = [
    'en' => '2018_yugioh_test',
    'sp' => 'yugioh_test_spanish',
    'de' => 'yugioh_test_de'
];
$dbname = $databases[$language] ?? '2018_yugioh_test';

// 4. Connect to database
$conn = new mysqli(
    $_ENV['DB_HOST'],    // Where is database? (localhost)
    $_ENV['DB_USER'],    // Username
    $_ENV['DB_PASS'],    // Password
    $dbname              // Which database?
);

// 5. Set character encoding (for international characters)
$conn->set_charset('utf8mb4');

// 6. Check if connection worked
if ($conn->connect_error) {
    error_log("Database connection failed");  // Log error
    die("Service unavailable");              // Show generic message
}
```

**Think of it like**: A phone connection to the database
- `$_ENV['DB_HOST']` = Phone number
- `$_ENV['DB_USER']` = Account name
- `$_ENV['DB_PASS']` = Password
- Once connected, you can "talk" to the database

---

## 5. The API Endpoints

### **What is an Endpoint?**

An endpoint is like a **specific window at a bank**:

- **Window 1**: Open an account (age verification endpoint)
- **Window 2**: Get account info (get questions endpoint)
- **Window 3**: Make a deposit (submit test endpoint)

### **Your 3 Endpoints:**

#### **Endpoint 1: Age Verification**
**File**: `api/auth/age-verification.php`

**What it does**: Verifies user is 16+, creates session

**How it works**:
```php
// 1. Receive user's birthdate
$input = json_decode(file_get_contents('php://input'), true);
$birthDate = $input['birthDate']; // "2000 Maol-15"

// 2. Calculate age
$age = calculateAge($birthDate);

// 3. Check if old enough
if ($age >= 16) {
    // 4. Create secure session token
    $token = bin2hex(random_bytes(32));
    
    // 5. Save to database
    saveToDatabase($token);
    
    // 6. Return success
    return ["verified": true, "token": "..."];
} else {
    return ["verified": false];
}
```

---

#### **Endpoint 2: Get Questions**
**File**: `api/tests/questions.php`

**What it does**: Returns questions for the test

**How it works**:
```php
// 1. Verify user has valid session
if (!hasValidSession()) {
    return error("Please verify age first");
}

// 2. Get test name from URL
$testName = $_GET['testName']; // "demojudge"

// 3. Query database for questions
$stmt = $conn->prepare("
    SELECT * FROM questions 
    WHERE test_name = ? 
    LIMIT 20
");
$stmt->bind_param("s", $testName);
$stmt->execute();

// 4. Get results
$questions = $stmt->get_result();

// 5. Format and return
return $questions;
```

---

#### **Endpoint 3: Submit Test**
**File**: `api/tests/submit.php`

**What it does**: Saves test results and calculates score

**How it works**:
```php
// 1. Receive user answers
$answers = $_POST['answers'];
// {"question_1": "answer_5", "question_2": "answer_3", ...}

// 2. Check each answer
$correct = 0;
foreach ($answers as $questionId => $answerId) {
    if (isAnswerCorrect($questionId, $answerId)) {
        $correct++;
    }
}

// 3. Calculate score
$score = ($correct / $totalQuestions) * 100;

// 4. Save to database
saveToDatabase($email, $score, $answers);

// 5. Return result
return ["score": 85, "passed": true];
```

---

## 6. Security Modules

### **Why We Need Security Modules**

Think of security like **airport security**:
- **Validation**: Check tickets (inputs) before allowing access
- **Security**: Scan for dangerous items (malicious data)
- **Headers**: Set rules for behavior (security headers)
- **Sessions**: Track who's allowed in (session management)

### **Module 1: Validation** (`validation.php`)

**What it does**: Checks if input data is valid

**Example**:
```php
function validateSubmission($data) {
    $errors = [];
    
    // Check email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email";
    }
    
    // Check name has only letters
    if (!preg_match('/^[a-zA-Z\s]+$/', $data['name'])) {
        $errors[] = "Name must be letters only";
    }
    
    return $errors;
}
```

**Real-life analogy**: Like checking if someone has a valid ID before entering a club.

---

### **Module 2: Security** (`security.php`)

**What it does**: Manages user sessions

**How Sessions Work**:
```php
// 1. User verifies age
// 2. Server creates unique token
$token = bin2hex(random_bytes(32)); // Random string

// 3. Save to database
saveSessionToDatabase($token);

// 4. Give token to user (as cookie)
setcookie('session_token', $token);

// 5. On next request, user sends token
// 6. Server checks: Is this token valid?
if (isTokenInDatabase($token)) {
    // Allow access
} else {
    // Deny access
}
```

**Real-life analogy**: Like getting a wristband at a venue. You can't go in without it.

---

### **Module 3: Headers** (`headers.php`)

**What it does**: Sets security headers for every response

**Example**:
```php
header('X-Frame-Options: DENY');        // Can't be embedded
header('X-XSS-Protection: 1');          // XSS protection
header('Content-Security-Policy: ...'); // Security policy
```

**Real-life analogy**: Like setting house rules for visitors.

---

## 7. Example: User Takes a Test

Let's follow **one complete journey** from start to finish:

### **Scenario: John (age 25) takes the Demo Judge Test**

---

### **Step 1: Age Verification**

**Frontend (User clicks "I'm 16+")**:
```javascript
fetch('/api/auth/age-verification.php', {
    method: 'POST',
    body: JSON.stringify({
        birthDate: '1999-05-15'
    })
})
```

**Backend receives**:
```php
// api/auth/age-verification.php
$input = json_decode(file_get_contents('php://input'));
$birthDate = $input['birthDate']; // "1999-05-15"

// Calculate age
$birth = DateTime::createFromFormat('Y-m-d', $birthDate);
$age = $today->diff($birth)->y; // 25

// Check age
if ($age >= 16) {
    // Create session
    $token = bin2hex(random_bytes(32));
    saveToDatabase($token);
    
    // Return success
    echo json_encode(["verified": true, "token": "abc123..."]);
}
```

**Response**:
```json
{
    "verified": true,
    "token": "abc123def456...",
    "age": 25
}
```

**Frontend displays**: "Age verified! Starting test..."

---

### **Step 2: Get Questions**

**Frontend requests questions**:
```javascript
fetch('/api/tests/questions.php?testName=demojudge')
```

**Backend processes**:
```php
// api/tests/questions.php

// 1. Check session
$token = $_COOKIE['session_token'];
if (!isValidSession($token)) {
    return error("Session expired");
}

// 2. Get test name
$testName = $_GET['testName']; // "demojudge"

// 3. Query database
$result = $conn->query("
    SELECT * FROM questions 
    WHERE test_name = 'demojope' 
    ORDER BY RAND() 
    LIMIT 20
");

// 4. Format questions
$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = [
        'id' => $row['id'],
        'question' => $row['question'],
        'answers' => getAnswersForQuestion($row['id'])
    ];
}

// 5. Return
echo json_encode($questions);
```

**Response**:
```json
{
    "success": true,
    "questions": [
        {
            "id": 5,
            "question": "What is the correct ruling when...",
            "answers": [
                {"id": 23, "answer": "Option A"},
                {"id": 24, "answer": "Option B"},
                {"id": 25, "answer": "Option C"}
            ]
        },
        // ... 19 more questions
    ]
}
```

**Frontend displays**: Shows 20 test questions

---

### **Step 3: Submit Answers**

**User answers all questions and clicks "Submit"**

**Frontend sends answers**:
```javascript
fetch('/api/tests/submit.php', {
    method: 'POST',
    body: JSON.stringify({
        user: {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            cardGameId: '12345678'
        },
        answers: {
            5: 24,    // Question 5, Answer 24 (Option B)
            6: 31,    // Question 6, Answer 31
            // ... all 20 answers
        }
    })
})
```

**Backend processes**:
```php
// api/tests/submit.php

// 1. Validate session
checkSession();

// 2. Validate input
$email = $_POST['email'];
if (!isValidEmail($email)) {
    return error("Invalid email");
}

// 3. Check answers
$correct = 0;
foreach ($answers as $questionId => $answerId) {
    if (isCorrectAnswer($questionId, $answerId)) {
        $correct++;
    }
}

// 4. Calculate score
$score = ($correct / 20) * 100; // 85%

// 5. Save to database
$conn->query("
    INSERT INTO result 
    (email, score, ...) 
    VALUES 
    ('john@example.com', 85, ...)
");

// 6. Return result
echo json_encode([
    "score": 85,
    "passed": true,
    "message": "Congratulations! You passed!"
]);
```

**Response**:
```json
{
    "success": true,
    "score": 85.0,
    "passed": true,
    "correctAnswers": 17,
    "totalQuestions": 20,
    "message": "Congratulations! You've passed the Demo Judge test!"
}
```

**Frontend displays**: "Congratulations! You scored 85%. You passed!"

---

## 8. Code Walkthrough

Let's walk through the **complete code flow** of submitting a test:

### **File Structure**:
```
1. Frontend makes request
   ↓
2. includes/headers.php - Set security headers
   ↓
3. includes/db_yugioh.php - Connect to database
   ↓
4. includes/validation.php - Validate input
   ↓
5. includes/security.php - Check session
   ↓
6. api/tests/submit.php - Process submission
   ↓
7. Response sent back
```

### **Complete Code Flow**:

```php
// ==========================================
// api/tests/submit.php
// ==========================================

// STEP 1: Security Headers
require_once __DIR__ . '/../../includes/headers.php';
SecurityHeaders::setJson();
// Sets: X-Frame-Options, CORS, etc.

// STEP 2: Database Connection
require_once __DIR__ . '/../../includes/db_yugioh.php';
// Now $conn is available (connected to MySQL)

// STEP 3: Security Check
require_once __DIR__ . '/../../includes/security.php';
$security = new SecurityManager($conn);
$security->requireSession(); // Checks if user has valid session
// If no valid session → returns error and stops

// STEP 4: Get Input Data
$input = json_decode(file_get_contents('php://input'), true);
// $input = ["user": {...}, "answers": {...}]

// STEP 5: Validate Input
require_once __DIR__ . '/../../includes/validation.php';
$validation = InputValidator::validateSubmission($input['user']);
if (!$validation['valid']) {
    return error($validation['errors']);
}

// STEP 6: Process Answers
$correct = 0;
foreach ($answers as $questionId => $answerId) {
    // Check if answer is correct (using prepared statement)
    $stmt = $conn->prepare("SELECT id FROM questions WHERE id = ? AND correct_answer_id = ?");
    $stmt->bind_param('ii', $questionId, $answerId);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows > 0) {
        $correct++;
    }
}

// STEP 7: Calculate Score
$score = ($correct / count($answers)) * 100;

// STEP 8: Save to Database
$stmt = $conn->prepare("INSERT INTO result (...) VALUES (?, ?, ?, ...)");
$stmt->bind_param('sdsss', $email, $score, ...);
$stmt->execute();

// STEP 9: Return Response
echo json_encode([
    'success' => true,
    'score' => $score,
    'passed' => $score >= 80
]);
```

---

## 🎓 Key Concepts You've Learned

### 1. **Request-Response Pattern**
- Frontend sends request
- Backend processes
- Backend sends response
- Frontend displays

### 2. **Database Queries**
- Connect to database
- Run SQL query
- Get results
- Return data

### 3. **Security Layers**
- Validate input
- Check sessions
- Use prepared statements
- Set security headers

### 4. **Modular Code**
- Each file has one job
- Files work independently
- Easy to maintain

---

## 🚀 Next Steps

1. **Read the actual code** in your `api/` folder
2. **Trace through an example** following the flow
3. **Try modifying** something small
4. **Test it** to see what happens
5. **Keep learning** - Practice makes perfect!

---

## 📝 Practice Exercise

**Task**: Modify the questions endpoint to return only 10 questions instead of 20.

**Steps**:
1. Open `api/api/tests/questions.php`
2. Find the line `$limit = 20;`
3. Change it to `$limit = 10;`
4. Test by calling the endpoint
5. Verify you get 10 questions back

---

**Congratulations! You now understand how the backend works!** 🎉

Try tracing through the code yourself, and experiment with small changes to see what happens!

