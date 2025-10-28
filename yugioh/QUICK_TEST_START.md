# ⚡ Quick Test Start
## Fastest Way to Test Your App

---

## 🚀 Ultra-Quick Start (3 Commands)

### **Step 1: Start Backend**
```bash
cd Judgetestremake/judgetest-angular/api
php -S localhost:8000
```

### **Step 2: Start Frontend** (New Terminal)
```bash
cd Judgetestremake/judgetest-angular
ng serve
```

### **Step 3: Open Browser**
```
http://localhost:4200
```

---

## ✅ Quick Test

1. **Age Verification**:
   - Enter birthdate: January 15, 2000
   - Click "Enter"
   - Should redirect to home page

2. **Check Network** (F12 → Network tab):
   - Should see API calls
   - Status should be 200 OK

3. **Check Cookie** (F12 → Application → Cookies):
   - Should see `session_token` cookie

---

## 🐛 If Something's Wrong

### **Backend Not Starting?**
- Check PHP is installed: `php -v`
- Try different port: `php -S localhost:8080`

### **Frontend Not Starting?**
- Install dependencies: `npm install`
- Check Node version: `node -v` (need 16+)

### **CORS Error?**
- Backend should allow `localhost:4200`
- Check `.htaccess` file

---

**That's it! Your app should be working now.** 🎉

For detailed testing, see `TESTING_GUIDE.md`

