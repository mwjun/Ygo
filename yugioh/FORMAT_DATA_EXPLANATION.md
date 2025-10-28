# What is `formatData()`? 🤔

**Short Answer**: It was a **simplified example** in the tutorial, not actual code!

---

## 🎯 What I Meant (Simplified Example)

In the tutorial, I wrote this as a **conceptual example**:

```php
// This is simplified/pseudocode
$questions = formatData($result);
```

This was meant to say: "The backend takes the raw database results and formats them nicely for the frontend."

---

## ✅ What Actually Happens (Real Code)

Here's the **real code** from `api/api/tests/questions.php`:

```php
// Get questions from database
$result = $stmt->get_result();

// Initialize empty array
$questions = [];

// Loop through each question
while ($row = $result->fetch_assoc()) {
    // Remove correct answer (we don't want to send it to frontend)
    unset($row['correct_answer_id']);
    
    // For each question, get its answers
    $answerStmt = $conn->prepare("
        SELECT id, answer as answerText, display_order 
        FROM answers 
        WHERE question_id = ? 
        ORDER BY display_order
    ");
    
    $answerStmt->bind_param('i', $row['id']);
    $answerStmt->execute();
    $answerResult = $answerStmt->get_result();
    
    // Store all answers in an array
    $answers = [];
    while ($answerRow = $answerResult->fetch_assoc()) {
        $answers[] = $answerRow;
    }
    
    // Add the answers to the question
    $row['answers'] = $answers;
    
    // Add the complete question to our list
    $questions[] = $row;
    
    $answerStmt->close();
}
```

---

## 📊 What the Data Looks Like

### **From Database (Raw)**:
```php
$result->fetch_assoc() gives us:
[
    'id' => 1,
    'question' => 'What is the ruling?',
    'test_name' => 'demojudge',
    'correct_answer_id' => 5
]
```

### **After "Formatting" (Final)**:
```json
{
    'id' => 1,
    'question' => 'What is the ruling?',
    'test_name' => 'demojudge',
    'answers' => [
        {'id' => 3, 'answer' => 'Option A'},
        {'id' => 4, 'answer' => 'Option B'},
        {'id' => 5, 'answer' => 'Option C'}
    ]
}
```

**Notice**:
- ❌ `correct_answer_id` is removed (security - don't tell user which is correct)
- ✅ `answers` array is added (with all possible answers)
- ✅ Data is organized for easy use in Angular

---

## 🔍 Breaking Down the Real Code

### **Step 1: Get Question**
```php
while ($row = $result->fetch_assoc()) {
    // $row = one question from database
    // Example: ['id' => 1, 'question' => '...', 'correct_answer_id' => 5]
}
```

### **Step 2: Remove Correct Answer**
```php
unset($row['correct_answer_id']);
// Now $row = ['id' => 1, 'question' => '...'] (no correct answer!)
```

### **Step 3: Get Answers for This Question**
```php
$answerStmt = $conn->prepare("SELECT * FROM answers WHERE question_id = ?");
$answerStmt->bind_param('i', $row['id']);  // Use question ID
// Gets all answer options for question 1
```

### **Step 4: Build Answers Array**
```php
$answers = [];
while ($answerRow = $answerResult->fetch_assoc()) {
    $answers[] = $answerRow;  // Add each answer to array
}
// $answers now contains all answer options
```

### **Step 5: Attach Answers to Question**
```php
$row['answers'] = $answers;
// Now $row has the question AND all its answers
// $row = ['id' => 1, 'question' => '...', 'answers' => [...]]
```

### **Step 6: Save Complete Question**
```php
$questions[] = $row;
// Add this complete question (with answers) to our list
```

---

## 💡 Why This "Formatting" is Needed

### **Database Storage** (Separate):
```
questions table:
- id: 1
- question: "What is the ruling?"

answers table:
- question_id: 1, id: 3, answer: "Option A"
- question_id: 1, id: 4, answer: "Option B"
- question_id: 1, id: 5, answer: "Option C"
```

### **What Frontend Needs** (Combined):
```json
{
  "id": 1,
  "question": "What is the ruling?",
  "answers": [
    {"id": 3, "answer": "Option A"},
    {"id": 4, "answer": "Option B"},
    {"id": 5, "answer": "Option C"}
  ]
}
```

**The "formatData" step** is really **combining related data** from multiple tables into one structure!

---

## 🎓 In Simple Terms

**`formatData()` concept** = Taking raw database data and organizing it nicely for the frontend to use.

**What actually happens**:
1. Get question from database
2. Get all answers for that question
3. Put them together
4. Remove sensitive info (correct answer)
5. Return organized data

---

## 📝 Summary

- ❌ **Not a real function** - Just a concept I used in the tutorial
- ✅ **What it represents** - Taking raw database results and organizing them
- ✅ **Real implementation** - The code in lines 76-103 of `questions.php`

**The tutorial simplified it as `formatData($result)` to make it easier to understand the flow!**

---

Does this make more sense now? Feel free to ask about any other part of the code! 😊

