# 🎓 Backend Development Tutorial Guide
## Learn How to Build Secure Backend Code - Step by Step

**For**: Developers new to backend development  
**Goal**: Understand backend concepts, security, and how to implement them  
**Approach**: Learn by doing, with practical examples

---

## 📚 Table of Contents

### Part 1: Backend Fundamentals (Week 1)
1. [What is Backend Development?](#lesson-1-what-is-backend-development)
2. [How Websites Work](#lesson-2-how-websites-work)
3. [Understanding Your Current Code](#lesson-3-understanding-your-current-code)

### Part 2: Security Basics (Week 2)
4. [SQL Injection Explained](#lesson-4-sql-injection-explained)
5. [Input Validation](#lesson-5-input-validation)
6. [Session Management](#lesson-6-session-management)

### Part 3: Implementation (Week 3-4)
7. [Environment Variables](#lesson-7-environment-variables)
8. [Prepared Statements](#lesson-8-prepared-statements)
9. [Security Headers](#lesson-9-security-headers)
10. [Testing Your Code](#lesson-10-testing-your-code)

### Part 4: Advanced Topics (Week 5)
11. [Error Handling](#lesson-11-error-handling)
12. [Logging and Monitoring](#lesson-12-logging-and-monitoring)
13. [Performance Optimization](#lesson-13-performance-optimization)

---

## 🎯 Part 1: Backend Fundamentals

### Lesson 1: What is Backend Development?

**Learning Objective**: Understand what backend code does

#### What You'll Learn:
- What backend vs frontend means
- What server-side code does
- How data flows from browser to database

#### Concepts:

**Frontend (What Users See)**:
```
User's Browser (Angular app)
    ↓
    Sends Request: "Give me questions for test"
    ↓
Backend Server
```

**Backend (What Happens on Server)**:
```
Backend Server Receives Request
    ↓
    Validates Input
    ↓
    Connects to Database
    ↓
    Fetches Questions
    ↓
    Returns Data
    ↓
Frontend Receives Response
```

#### Example from Your Code:

**Frontend** (Angular) sends:
```javascript
// User clicks "Start Test" button
fetch('/api/get-questions')
```

**Backend** (PHP) receives and processes:
```php
<?php
// Get questions from database
$result = $conn->query("SELECT * FROM questions LIMIT 20");
// Send back to frontend
echo json_encode($result);
?>
```

#### Exercise 1:
Look at your `demojudge.php` file:
- Find where it receives data from the browser (hint: `$_POST`)
- Find where it connects to database (hint: `db_yugioh.php`)
- Find where it sends data back (hint: `echo`)

**Your Answer**: ____________________________________________

---

### Lesson 2: How Websites Work

**Learning Objective**: Understand the request-response cycle

#### The Communication Flow:

```
1. User types URL or clicks button
   ↓
2. Browser sends HTTP Request to Server
   ↓
3. Server processes request (runs PHP code)
   ↓
4. PHP code connects to MySQL database
   ↓
5. MySQL returns data
   ↓
6. PHP formats response
   ↓
7. Server sends HTTP Response back
   ↓
8. Browser displays result
```

#### Real Example from Your Code:

**When user submits test**:

```
Step 1: Browser sends HTTP POST request
POST /demojudge.php
Data: email=user@test.com&fname=John&lname=Doe&answers=...

Step 2: PHP receives data
<?php
$email = $_POST['email'];  // Gets data from browser
$fname = $_POST['fname'];
?>

Step 3: PHP connects to database
<?php
include("includes/db_yugioh.php");
// Now we're connected to MySQL
?>

Step 4: PHP saves to database
<?php
$conn->query("INSERT INTO result (...) VALUES (...)");
?>

Step 5: PHP sends response back
<?php
echo "Congratulations! You scored 85%";
?>
```

#### Exercise 2:
Draw a diagram showing what happens when:
1. User visits agegate.php
2. User enters birthdate
3. Age verification happens
4. User gets redirected

**Your Diagram**:
```
[Draw here]
[User] → ?
```

---

### Lesson 3: Understanding Your Current Code

**Learning Objective**: Read and understand existing PHP code

#### Your Current Files:

1. **`agegate.php`** - Age verification page
2. **`demojudge.php`** - Demo judge test
3. **`policy.php`** - Policy test
4. **`rulings.php`** - Rulings test
5. **`includes/db_yugioh.php`** - Database connection

#### Reading PHP Code - Key Elements:

**1. Variables**:
```php
$email = $_POST['email'];  // $ means it's a variable
$right = 0;                // Stores a number
$name = "John";            // Stores text
```

**2. Arrays**:
```php
$_POST['email']    // $_POST is an array (form data)
$_GET['l']         // $_GET is an array (URL parameters)
```

**3. Functions**:
```php
$conn->query("...")           // Runs SQL query
mysqli_real_escape_string()   // Escapes special characters
htmlentities()                // Converts HTML to safe text
```

**4. If-else Logic**:
```php
if ($age >= 16) {
    // User is old enough
} else {
    // User is too young
}
```

**5. Loops**:
```php
foreach ($_POST['question'] as $key => $value) {
    // Process each question
}
```

#### Exercise 3: Code Reading
Look at your `demojudge.php` lines 123-142:

```php
if ($_REQUEST['submit']) {
    $right = 0;
    $qa = "";
    foreach ($_POST['question'] as $key => $value) {
        $qa .= $conn->real_escape_string(htmlentities($value . ":" . $_POST['answer'][$value] . "-"));
        $a_result = $conn->query("SELECT * FROM questions where id = '" . 
            $conn->real_escape_string(htmlentities($value)) . "' and correct_answer_id = '" . 
            $conn->real_escape_string(htmlentities($_POST['answer'][$value])) . "'");
        if ($a_row = $a_result->fetch_array()) {
            $right++;
        }
    }
    $per = $right / 20 * 100;
}
```

**Explain what this code does**:
- Line 123: ____________________________________________
- Line 124-125: ____________________________________________
- Line 126: ____________________________________________
- Line 130-131: ____________________________________________
- Line 136: ____________________________________________

**Answer Key** (Check after you try):
<details>
<summary>Click to reveal answers</summary>

- Line 123: Checks if form was submitted
- Line 124-125: Initializes counter ($right) and string ($qa)
- Line 126: Loops through each question in the form
- Line 130-131: Queries database to check if answer is correct
- Line 136: Calculates percentage score

</details>

---

## 🛡️ Part 2: Security Basics

### Lesson 4: SQL Injection Explained

**Learning Objective**: Understand what SQL injection is and how to prevent it

#### What is SQL Injection?

**Your Vulnerable Code**:
```mentors
// OLD (INSECURE)
$a_result = $conn->query("SELECT * FROM questions where id = '" . $value . "'");
```

**The Problem**: Attacker can inject malicious SQL

**Attack Example**:
```
Normal input: user enters "123"
Safe SQL: SELECT * FROM questions WHERE id = '123'
✅ Works fine

Attack input: user enters "1' OR '1'='1"
Malicious SQL: SELECT * FROM questions WHERE id = '1' OR '1'='1'
❌ Returns ALL questions (bypasses security!)
```

#### How Prepared Statements Work:

**Your Code (Fixed)**:
```php
// NEW (SECURE)
$stmt = $conn->prepare("SELECT * FROM questions WHERE id = ?");
$stmt->bind_param("i", $value);  // "i" means integer
$stmt->execute();
```

**Why This Works**:
1. Query structure is **fixed** (can't be changed)
2. User data is **bound as data** (not code)
3. Database **separates code from data**

Think of it like this:
- **Bad**: Writing SQL with user input as part of the code
- **Good**: Writing SQL template, then filling in user data separately

#### Exercise 4: Fix SQL Injection

**Problematic Code**:
```php
$query = "SELECT * FROM users WHERE email = '" . $_POST['email'] .线条 "'";
$result = $conn->query($query);
```

**Your Fixed Version**:
```php
// Write your fixed code here:
$stmt = $conn->prepare("____________________________________________");
$stmt->bind_param("____", ____________________________________________);
$stmt->execute();
$result = $stmt->get_result();
```

**Answer Key**:
<details>
<summary>Click to reveal answer</summary>

```php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $_POST['email']);  // "s" means string
$stmt->execute();
$result = $stmt->get_result();
```

</details>

---

### Lesson 5: Input Validation

**Learning Objective**: Validate user input before using it

#### Why Validate Input?

**Problem Without Validation**:
```php
$email = $_POST['email'];  // Could be anything!
// Could be: "admin@test.com"
// Could be: "<script>alert('hack')</script>"
// Could be: "'; DROP TABLE users; --"
```

#### What to Validate:

1. **Email Format**:
```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
if (!$email) {
    die("Invalid email!");
}
```

2. **Text Length**:
```php
if (strlen($_POST['fname']) > 50) {
    die("Name too long!");
}
```

3. **Allowed Characters**:
```php
if (!preg_match('/^[a-zA-Z\s\-\.]+$/', $_POST['fname'])) {
    die("Invalid characters in name!");
}
```

4. **Integer Values**:
```php
$id = (int)$_POST['id'];  // Convert to integer
if ($id <= 0) {
    die("Invalid ID!");
}
```

#### Exercise 5: Write Validation Function

**Task**: Create a validation function for user data

```php
<?php
function validateUserInput($data) {
    $errors = [];
    
    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        ____________________________________________
    }
    
    // Validate name (only letters, spaces, hyphens)
    if (!preg_match('/^[a-zA-Z\s\-\']+$/', $data['name'])) {
        ____________________________________________
    }
    
    // Validate length
    if (strlen($data['name']) > 50) {
        ____________________________________________
    }
    
    return $errors;
}
?>
```

**Answer Key**:
<details>
<summary>Click to reveal answer</summary>

```php
$errors[] = "Invalid email";
$errors[] = "Name contains invalid characters";
$errors[] = "Name too long";
```

</details>

---

### Lesson 6: Session Management

**Learning Objective**: Understand sessions and secure session handling

#### What is a Session?

Think of it like an ID card for a website visit:
1. User visits website
2. Server gives them a **session ID** (like a ticket number)
3. User shows session ID on each request
4. Server knows "this is the same user"

#### Insecure Session (Your Old Code):

```php
// OLD (INSECURE)
setcookie('legal', 'yes', time()+7200);
// Problem: User can change 'yes' to 'no' easily!
```

**Why This is Bad**:
```
User opens browser developer tools
Finds cookie: legal=no
Changes to: legal=yes
Refreshes page
✅ Now has access (even if under 16!)
```

#### Secure Session (New Code):

```php
// NEW (SECURE)
$token = bin2hex(random_bytes(32));  // Random, unguessable token
$hashed_token = hash('sha256', $token);  // Store hash in database

// Save to database
$stmt = $conn->prepare("INSERT INTO test_sessions (session_token_hash) VALUES (?)");
$stmt->bind_param("s", $hashed_token);
$stmt->execute();

// Give user token
setcookie('session_token', $token, [
    'expires' => time() + 7200,
    'httponly' => true,     // JavaScript can't access it
    'secure' => true,       // HTTPS only
    'samesite' => 'Strict' // CSRF protection
]);
```

#### Exercise 6: Session Validation

**Task**: Write code to validate a session token

```php
function isSessionValid($token) {
    // Step 1: Hash the token
    $hashed_token = ____________________________________________;
    
    // Step 2: Check if it exists in database
    $stmt = $conn->prepare("SELECT id FROM test_sessions WHERE session_token_hash = ? AND expires_at > NOW()");
    $stmt->bind_param("s", ____________________________________________);
    $stmt->execute();
    $result = ____________________________________________;
    
    // Step 3: Return true/false
    return ____________________________________________;
}
```

**Answer Key**:
<details>
<summary>Click to reveal answer</summary>

```php
$hashed_token = hash('sha256', $token);
$stmt->bind_param("s", $hashed_token);
$result = $stmt->get_result();
return $result->num_rows > 0;
```

</details>

---

## 🔧 Part 3: Implementation

### Lesson 7: Environment Variables

**Learning Objective**: Store credentials securely outside code

#### Why Environment Variables?

**Bad** (Hardcoded credentials):
```php
// db_yugioh.php
$dbpass = 'L0c@l3!135';  // ❌ Credential exposed in code!
```
- If code is leaked → credential is leaked
- Can't use different passwords for dev/production
- Can't change password without modifying code

**Good** (Environment variables):
```php
// config/.env (not in git)
DB_PASSWORD=my_secure_password_here

// db_yugioh.php
$dbpass = $_ENV['DB_PASSWORD'];  // ✅ Loads from file
```

#### Setting Up Environment Variables:

**Step 1**: Create `.env` file
```bash
# config/.env
DB_HOST=localhost
DB_USER=apphost
DB_PASS=your_secure_password
DB_NAME=yugioh_test
```

**Step 2**: Create loader file
```php
<?php
// config/env.php
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env');
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}
?>
```

**Step 3**: Load in your code
```php
<?php
require_once 'config/env.php';

$dbpass = $_ENV['DB_PASS'];
?>
```

#### Exercise 7: Set Up Environment Variables

**Task**: Create your own `.env` file and loader

1. Create `config/.env` with these variables:
   ```
   SECRET_KEY=________________________________
   DB_PASSWORD=________________________________
   APP_NAME=________________________________
   ```

2. Load them in code:
   ```php
   <?php
   require_once 'config/env.php';
   echo $_ENV['SECRET_KEY'];
   ?>
   ```

---

### Lesson 8: Prepared Statements

**Learning Objective**: Use prepared statements everywhere

#### Prepared Statements - The Complete Guide

**Basic Prepared Statement**:
```php
// Step 1: Prepare the query (with ? as placeholders)
$stmt = $conn->prepare("SELECT * FROM questions WHERE id = ?");

// Step 2: Bind parameters ("s" = string, "i" = integer)
$stmt->bind_param("i", $question_id);

// Step 3: Execute
$stmt->execute();

// Step 4: Get result
$result = $stmt->get_result();

// Step 5: Close
$stmt->close();
```

#### Parameter Types:

```
"s" - String
"i" - Integer
"d" - Double (decimal number)
"b" - Blob (binary data)
```

#### Multiple Parameters:

```php
$stmt = $conn->prepare("INSERT INTO result (email, score, first_name) VALUES (?, ?, ?)");
$stmt->bind_param("sds", $email, $score, $first_name);
//                                ↑
//                          three types: string, double, string
```

#### Exercise 8: Fix Your Code

**Your Vulnerable Code**:
```php
$conn->query("insert into result (email,score,qa,first_name,last_name,cid) values ('"
    . $conn->real_escape_string($_POST['email']) . "'," . $per . ",'" . $qa . "','"
    . $conn->real_escape_string($_POST['fname']) . "','"
    . $conn->real_escape_string($_POST['lname']) . "','"
    . $conn->real_escape_string($_POST['cid']) . "')");
```

**Your Fixed Code**:
```php
$stmt = $conn->prepare("INSERT INTO result (email, score, qa, first_name, last_name, cid) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("_____", ____________________________________________, ____________________________________________, ____________________________________________, ____________________________________________, ____________________________________________, ____________________________________________);
$stmt->execute();
$stmt->close();
```

**Answer Key**:
<details>
<summary>Click to reveal answer</summary>

```php
$stmt = $conn->prepare("INSERT INTO result (email, score, qa, first_name, last_name, cid) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdssss", $_POST['email'], $per, $qa, $_POST['fname'], $_POST['lname'], $_POST['cid']);
$stmt->execute();
$stmt->close();
```

</details>

---

### Lesson 9: Security Headers

**Learning Objective**: Add security headers to responses

#### What Are Security Headers?

Special HTTP headers that tell the browser how to behave:
- X-Frame-Options → Prevents being embedded in iframes
- X-XSS-Protection → Enables browser XSS filtering
- Content-Security-Policy → Controls what resources can load

#### Adding Security Headers:

```php
<?php
// Set security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000');

// Your existing code...
?>
```

#### Creating a Reusable Function:

```php
<?php
// includes/headers.php
function setSecurityHeaders() {
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('X-XSS-Protection: 1; mode=block');
    header('Content-Security-Policy: default-src \'self\'');
}
?>

// In your files:
<?php
include('includes/headers.php');
setSecurityHeaders();
?>
```

#### Exercise 9: Add Headers to Your Code

**Task**: Add security headers to your `demojudge.php`

```php
<?php
// At the top of demojudge.php
____________________________________________
____________________________________________
____________________________________________

include("includes/db_yugioh.php");
// ... rest of your code
?>
```

**Answer Key**:
<details>
<summary>Click to reveal answer</summary>

```php
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
```

</details>

---

### Lesson 10: Testing Your Code

**Learning Objective**: Test that your security fixes work

#### Test Checklist:

**1. SQL Injection Test**:
```php
// Try to inject SQL in email field
Email: test@test.com' OR '1'='1
Expected: Should not affect query
```

**2. XSS Test**:
```php
// Try to inject JavaScript in name field
First Name: <script>alert('XSS')</script>
Expected: Should be displayed as text, not executed
```

**3. Session Bypass Test**:
```php
// Try to manipulate cookie
Cookie: legal=yes (manually changed)
Expected: Should be rejected (server validates)
```

#### Creating Test Cases:

```php
<?php
// tests/security_test.php
function testSQLInjection() {
    $_POST['email'] = "test@test.com' OR '1'='1";
    // Run your code
    // Check if query still works correctly
    echo "✅ SQL Injection test: PASSED\n";
}

function testXSS() {
    $_POST['fname'] = "<script>alert('XSS')</script>";
    $output = htmlspecialchars($_POST['fname']);
    // Should output: &lt;script&gt;alert... (encoded)
    echo "✅ XSS test: PASSED\n";
}

// Run all tests
testSQLInjection();
testXSS();
?>
```

#### Exercise 10: Write a Test

**Task**: Write a test for age verification

```php
<?php
function testAgeVerification() {
    // Test under 16
    $birthdate = new DateTime('2010-01-01');  // 14 years old
    $age = calculateAge($birthdate);
    if ($age < 16) {
        echo "✅ Under 16 correctly rejected\n";
    }
    
    // Test over 16
    $birthdate = new DateTime('2005-01-01');  // 19 years old
    $age = calculateAge($birthdate);
    if ($age >= 16) {
        echo "✅ Over 16 correctly allowed\n";
    }
}
?>
```

---

## 📚 Part 4: Advanced Topics

### Lesson 11: Error Handling

**Learning Objective**: Handle errors securely

#### Secure Error Handling:

**Bad** (Discloses information):
```php
if ($conn->connect_error) {
    echo "Failed: " . $conn->connect_error;  // ❌ Shows database info!
}
```

**Good** (Logs errors, shows generic message):
```php
if ($conn->connect_error) {
    error_log("Database error: " . $conn->connect_error);  // ✅ Log it
    http_response_code(500);
    die("Service temporarily unavailable");  // ✅ Generic message
}
```

---

### Lesson 12: Logging and Monitoring

**Learning Objective**: Track what happens in your application

#### What to Log:

```php
// Security events
error_log("Age verification failed for IP: " . $_SERVER['REMOTE_ADDR']);

// Database errors
error_log("Query failed: " . $stmt->error);

// Suspicious activity
error_log("Unusual submission detected from " . $_SERVER['REMOTE_ADDR']);
```

---

### Lesson 13: Performance Optimization

**Learning Objective**: Make your code run faster

#### Common Optimizations:

1. **Use Prepared Statements** (faster than string concatenation)
2. **Cache Queries** (don't repeat expensive queries)
3. **Index Database** (faster lookups)
4. **Limit Results** (don't fetch more than needed)

---

## 🎓 Practice Exercises

### Exercise A: Complete Implementation
**Task**: Fix one of your test files completely

**Steps**:
1. Open `demojudge.php`
2. Replace all queries with prepared statements
3. Add input validation
4. Add output encoding
5. Add security headers
6. Test that it works

---

### Exercise B: Code Review
**Task**: Find all vulnerabilities in given code

**Code**:
```php
<?php
$email = $_GET['email'];
$query = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($query);
while ($row = $result->fetch_array()) {
    echo "<各行 user>" . $row['name'] . "</user>";
}
?>
```

**Your Finding**: List all security issues you see:

1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

---

### Exercise C: Build Security Module
**Task**: Create a reusable security module

**Create `includes/secure_submit.php`**:
```php
<?php
function secureSubmit($conn, $table, $data) {
    // Add your implementation here
    // Should include: validation, prepared statements, error handling
    
    // Your code:
    
}
?>
```

---

## 📖 Additional Resources

### Recommended Reading:
1. [OWASP PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
2. [PHP.net Security Manual](https://www.php.net/manual/en/security.php)
3. [MySQLi Prepared Statements](https://www.php.net/manual/en/mysqli.quickstart.prepared-statements.php)

### Practice Sites:
- [HackTheBox](https://www.hackthebox.com/) - Practice security
- [PortSwigger Web Security](https://portswigger.net/web-security) - Learn web vulnerabilities

---

## ✅ Final Checklist

Before deploying your code:

- [ ] All SQL queries use prepared statements
- [ ] All user input is validated
- [ ] All output is encoded (htmlspecialchars)
- [ ] Credentials are in .env file
- [ ] Security headers are set
- [ ] Errors are logged, not displayed
- [ ] Sessions are secure
- [ ] Code is tested

---

## 🎯 Congratulations!

You now understand:
- ✅ How backend code works
- ✅ Security vulnerabilities
- ✅ How to fix them
- ✅ Best practices
- ✅ How to implement secure code

**Next Steps**: Follow the `IMPLEMENTATION_CHECKLIST.md` to actually implement these fixes in your code!

---

*Take your time, practice each concept, and don't hesitate to re-read lessons as needed!*

