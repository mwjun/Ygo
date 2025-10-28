# 🧪 Complete Testing Guide
## How to Test Your Judge Test Application

Follow these steps to verify everything works end-to-end!

---

## 📋 Prerequisites

### **1. Install Required Software**

If you haven't already:

**For Backend (PHP)**:
```bash
# Check if you have PHP
php -v

# Check if you have MySQL
mysql --version
```

**For Frontend (Angular)**:
```bash
# Check if you have Node.js
node -v

# If not, install from nodejs.org
```

---

## 🔧 Step-by-Step Setup

### **Step 1: Setup Backend**

#### **1.1: Configure Database**

```bash
# Navigate to API folder
cd Judgetestremake/judgetest-angular/api

# Copy environment file
cp config/.env.example config/.env

# Edit with your database credentials
# Windows: notepad config/.env
# Mac/Linux: nano config/.env
```

**Update these values**:
```bash
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=yugioh_test
```

#### **1.2: Setup Session Table**

```bash
# Connect to MySQL
mysql -u your_username -p

# Run SQL setup script
source setup-database.sql;

# Or manually:
mysql -u your_username -p your_database < setup-database.sql
```

#### **1.3: Verify Database Connection**

```bash
# Start a local PHP server (or use your existing setup)
cd Judgetestremake/judgetest-angular/api
php -S localhost:8000

# In another terminal, test connection
curl http://localhost:8000/test-connection.php
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Database connection successful"
}
```

---

### **Step 2: Setup Frontend**

#### **2.1: Install Dependencies**

```bash
# Navigate to Angular app
cd Judgetestremake/judgetest-angular

# Install dependencies (if not done already)
npm install
```

#### **2.2: Update API URL (if needed)**

Check `src/app/services/test.ts` and `src/app/services/age-gate.ts`:
```typescript
private readonly API_BASE_URL = 'http://localhost:8000/api';
// Adjust port to match your PHP server
```

#### **2.3: Start Dev Server**

```bash
ng serve
# or
npm start
```

**Expected Output**:
```
✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:4200 **
```

---

## 🧪 Testing Scenarios

### **Test 1: Age Verification**

**Step 1**: Open browser to `http://localhost:4200`

**Step 2**: Navigate to age gate or try to access a protected route

**Step 3**: Enter birthdate (16+ years old)

**Step 4**: Open **Browser DevTools** (F12)
- Go to **Network** tab
- Click "Enter"

**What to Look For**:
```
✅ Request Type: POST
✅ URL: http://localhost:8000/api/auth/age-verification.php
✅ Status: 200 OK
✅ Response: {"verified": true, "sessionToken": "...", "age": 25}
✅ Cookie: session_token should be set
```

**Expected Result**: Redirects to home or protected page

---

### **Test 2: Fetch Questions**

**Step 1**: After age verification, navigate to a test (e.g., `/rulings`)

**Step 2**: Open DevTools → Network tab

**Step 3**: Reload page

**What to Look For**:
```
✅ Request Type: GET
✅ URL: http://localhost:8000/api/tests/questions.php?testName=rulings&language=en&limit=20
✅ Status: 200 OK
✅ Response: {"success": true, "questions": [...]}
```

**Expected Result**: Questions should load (or show message if none)

**Troubleshooting**:
- **401 Error**: Session expired, re-verify age
- **404 Error**: API URL wrong, check `API_BASE_URL`
- **500 Error**: Database issue, check connection

---

### **Test 3: Submit Test**

**Step 1**: Fill out test form (email, name, card game ID)

**Step 2**: Select answers

**Step 3**: Click Submit

**Step 4**: Check Network tab

**What to Look For**:
```
✅ Request Type: POST
✅ URL: http://localhost:8000/api/tests/submit.php
✅ Status: 200 OK
✅ Response: {"success": true, "score": 85, "passed": true, ...}
```

**Expected Result**: Shows score and pass/fail message

---

## 🔍 Manual Testing Checklist

### **Backend Tests**

```bash
# Test 1: Database connection
curl http://localhost:8000/api/test-connection.php
Expected: {"status": "success"}

# Test 2: Age verification (too young)
curl -X POST http://localhost:8000/api/auth/age-verification.php \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"2010-01-15","language":"en"}'
Expected: {"verified": false}

# Test 3: Age verification (old enough)
curl -X POST http://localhost:8000/api/auth/age-verification.php \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"2000-01-15","language":"en"}'
Expected: {"verified": true, "sessionToken": "..."}

# Note: Use the sessionToken from above for next tests

# Test 4: Get questions (requires session)
curl "http://localhost:8000/api/tests/questions.php?testName=rulings&language=en" \
  -H "Cookie: session_token=YOUR_TOKEN_HERE"
Expected: {"success": true, "questions": [...]}
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: CORS Error**

**Error**:
```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' from origin 
'http://localhost:4200' has been blocked by CORS policy
```

**Solution**:
Check that `.htaccess` has CORS headers:
```apache
Header always set Access-Control-Allow-Origin "http://localhost:4200"
```

Or update backend to allow Angular origin.

---

### **Issue 2: 404 Not Found**

**Error**:
```
GET http://localhost:8000/api/tests/questions.php 404 (Not Found)
```

**Solutions**:
1. Check PHP server is running: `php -S localhost:8000`
2. Check API folder structure is correct
3. Check URL in service matches your server

---

### **Issue 3: Session Not Working**

**Error**: Always redirected to age-gate

**Solution**:
1. Check DevTools → Application → Cookies
2. Verify `session_token` cookie exists
3. Check cookie has valid token (long random string)
4. Verify backend session validation is working

---

### **Issue 4: Database Connection Failed**

**Error**:
```
{"success": false, "message": "Service temporarily unavailable"}
```

**Solutions**:
1. Check `.env` file has correct credentials
2. Test MySQL connection: `mysql -u your_user -p`
3. Check database exists: `SHOW DATABASES;`
4. Check `test_sessions` table exists: `SHOW TABLES;`

---

## 📊 What Success Looks Like

### **Browser DevTools - Network Tab**

When everything works, you'll see:

```
Age Verification:
POST /api/auth/age-verification.php
Status: 200
Response: {verified: true, sessionToken: "abc123..."}

Get Questions:
GET /api/tests/questions.php?testName=rulings
Status: 200
Response: {success: true, questions: [...]}

Submit Test:
POST /api/tests/submit.php
Status: 200
Response: {success: true, score: 85, passed: true}
```

### **Browser DevTools - Console Tab**

Should be clean with no errors:
```
(empty or just Angular framework messages)
```

### **Database**

Check that results are saved:
```sql
SELECT * FROM result ORDER BY created DESC LIMIT 5;
```

Should show recent test submissions.

---

## 🎯 Quick Test Commands

### **Test Backend Only**:
```bash
# Start PHP server
php -S localhost:8000

# Test age verification
curl -X POST http://localhost:8000/api/auth/age-verification.php \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"2000-01-15","language":"en"}'
```

### **Test Frontend Only**:
```bash
# Start Angular dev server
cd Judgetestremake/judgetest-angular
ng serve

# Open http://localhost:4200
# Check browser console for errors
```

### **Test Both Together**:
```bash
# Terminal 1: Backend
cd Judgetestremake/judgetest-angular/api
php -S localhost:8000

# Terminal 2: Frontend
cd Judgetestremake/judgetest-angular
ng serve

# Browser: http://localhost:4200
# Follow testing scenarios above
```

---

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Database connection works
- [ ] Frontend starts without errors
- [ ] Age verification creates session
- [ ] Cookie is set correctly
- [ ] Questions load from database
- [ ] Test submission calculates score
- [ ] Results are saved to database
- [ ] No errors in browser console
- [ ] No CORS errors

---

## 🆘 Still Having Issues?

### **Check Backend Logs**:
```bash
# PHP error log
tail -f /var/log/apache2/error.log
# or check your PHP error log location
```

### **Check Database**:
```bash
# Check if tables exist
mysql -u your_user -p your_database -e "SHOW TABLES;"

# Options to try:
# - Check table exists
# - Check data exists in questions table
# - Verify session table was created
```

### **Enable Debug Mode**:
In `config/env.php`, temporarily enable debug:
```php
$_ENV['DEBUG'] = 'true';
```

(Remember to disable in production!)

---

**Follow these steps and your app will be fully tested and working!** 🚀

