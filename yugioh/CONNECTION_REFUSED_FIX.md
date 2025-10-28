# ✅ FIXED: Connection Refused Error

## 🐛 The Problem

Your Angular app was trying to connect to `http://localhost/api` (port 80) instead of `http://localhost:8000/api` (where your PHP server is running).

**Error**: `net::ERR_CONNECTION_REFUSED`

---

## ✅ The Fix

I just updated both service files to use port 8000:

**Changed**:
- ❌ `http://localhost/api` 
- ✅ `http://localhost:8000/api`

**Files Updated**:
- ✅ `src/app/services/age-gate.ts` - Line 18
- ✅ `src/app/services/test.ts` - Line 23

---

## 🔄 What You Need to Do Now

### **Option 1: Restart Angular** (Recommended)

Since Angular was already running, you need to restart it to pick up the changes:

1. Go to the terminal running Angular
2. Press `Ctrl+C` to stop it
3. Restart it:
   ```bash
   cd Judgetestremake/judgetest-angular
   npm start
   ```

4. Wait for it to compile (should say "Compiled successfully")

5. Refresh your browser at http://localhost:4200

### **Option 2: Just Refresh** (Try First)

Sometimes a hard refresh works:
- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

---

## ✅ Now Test Again

1. Go to http://localhost:4200
2. Navigate to age gate
3. Enter birthdate
4. Click "Enter"
5. Check DevTools → Network tab

**You should now see**:
- ✅ `POST http://localhost:8000/api/auth/age-verification.php`
- ✅ Status: 200 OK
- ✅ Response: `{"verified": true, "sessionToken": "..."}`

---

## 🎉 Success Indicators

After refreshing, you should see:

1. **No more ERR_CONNECTION_REFUSED**
2. **200 OK** status in Network tab
3. **Session token** cookie created
4. **Redirect** to home page

---

**Just restart your Angular dev server and try again!** 🚀

