# 🎯 Start Here - Testing Your App

## ✅ Good News!

Both your servers are **already running**:
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:4200

---

## 🧪 How to Test Right Now

### **Step 1: Open Browser**
Go to: **http://localhost:4200**

### **Step 2: Test Age Verification**

1. You should see the age gate page or home page
2. If you see home page, click on a test link (e.g., "Rulings Test")
3. You'll be redirected to age verification
4. **Enter a birthdate** (must be 16+ years old):
   - Month: January
   - Day: 15
   - Year: 2000
5. Click "Enter"

### **Step 3: Check if it Worked**

**Open Browser DevTools** (F12 or Right-click → Inspect):

**Go to Network tab**:
- Should see a POST request to `/api/auth/age-verification.php`
- Status should be 200
- Click on it to see the response

**Go to Application tab → Cookies**:
- Should see a cookie named `session_token`
- Should have a long random value

### **Step 4: Test Loading Questions**

1. After age verification, navigate to a test page
2. Open DevTools → Network tab
3. Reload the page
4. Look for: GET request to `/api/tests/questions.php`

**If You See Questions**: Success! ✅  
**If You See Error**: Check the next section

---

## 🔍 What You Should See

### **Success Indicators**:

✅ **Age Verification**:
- Requests sent to backend
- Session token cookie created
- Redirects to home/test page

✅ **Questions Loading**:
- API calls to `/api/tests/questions.php`
- Questions display on page
- Multiple choice answers shown

✅ **Test Submission**:
- Answer all questions
- Click Submit
- Shows score and pass/fail message

---

## 🐛 Troubleshooting

### **If You See CORS Errors**:

**Check**: Backend CORS is enabled in `.htaccess`  
**Fix**: The backend should already have this configured

### **If Questions Don't Load**:

**Possible Issues**:
1. No questions in database
2. Session expired (re-verify age)
3. Wrong API URL

**Quick Fix**:
1. Check `src/app/services/test.ts` line 23
2. Make sure `API_BASE_URL = 'http://localhost:8000/api'`
3. Try again

### **If Backend is Not Running**:

Run this:
```bash
cd Judgetestremake/judgetest-angular/api
./start-server.sh
```

---

## 📊 Complete Test Flow

```
1. Open http://localhost:4200
   ↓
2. Age Gate appears
   ↓
3. Enter birthdate (16+)
   ↓
4. Click "Enter"
   ↓
5. Check DevTools → Network → Should see POST to age-verification.php
   ↓
6. Check DevTools → Application → Cookies → Should see session_token
   ↓
7. Navigate to a test (e.g., Rulings)
   ↓
8. Should see form and questions OR message
   ↓
9. If questions load, test is working! ✅
```

---

## 🎯 Quick Status Check

Open these URLs in your browser to verify:

**Backend Connection**:
http://localhost:8000/test-connection.php

**Expected**: JSON with "Database connection successful"

**Frontend**:
http://localhost:4200

**Expected**: Your Angular app loads

---

## 🚀 You're Ready to Test!

**Just open**: http://localhost:4200

And follow the steps above!

---

**Need help? Check the Network tab in DevTools to see what API calls are being made!**

