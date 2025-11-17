# ngrok Setup Guide

## What is ngrok?
ngrok creates a secure tunnel from a public URL to your local machine, allowing you to test your newsletter app on your phone.

## Setup Steps

### 1. Start ngrok
A PowerShell window should have opened with ngrok running. If not, open a new terminal and run:
```powershell
ngrok http 4200
```

### 2. Get Your ngrok URL
In the ngrok window, you'll see output like:
```
Forwarding   https://abc123-def4-5678.ngrok.io -> http://localhost:4200
```

Copy the **HTTPS URL** (the one starting with `https://`).

### 3. Update Backend Configuration
Open `Newsletter_Remake/backend/.env` and update the `FRONTEND_URL`:

**Before:**
```
FRONTEND_URL=http://localhost:4200
```

**After (replace with your ngrok URL):**
```
FRONTEND_URL=https://abc123-def4-5678.ngrok.io
```

### 4. Restart Backend Server
After updating the `.env` file, restart your backend server:
```powershell
cd Newsletter_Remake/backend
npm start
```

### 5. Test on Your Phone
1. Make sure your Angular app is running on `localhost:4200`
2. Make sure ngrok is running (the PowerShell window should stay open)
3. Make sure your backend is running on port 3001
4. Sign up for the newsletter on your computer
5. Check your email on your phone
6. Click the verification link - it should now work!

## Important Notes

- **Keep ngrok running**: The ngrok window must stay open while testing. If you close it, the URL will stop working.
- **URL changes**: On the free tier, your ngrok URL changes each time you restart ngrok. You'll need to update `FRONTEND_URL` each time.
- **HTTPS only**: Always use the HTTPS URL (not HTTP) from ngrok for email links.

## Troubleshooting

**ngrok not working?**
- Make sure your Angular app is running on port 4200
- Check that ngrok is pointing to the correct port: `ngrok http 4200`
- Verify the ngrok window shows "Session Status: online"

**Link still not working on phone?**
- Double-check that `FRONTEND_URL` in `.env` matches your ngrok URL exactly
- Make sure you restarted the backend after updating `.env`
- Verify ngrok is still running (check the PowerShell window)

**Getting CORS errors?**
- Update `ALLOWED_ORIGINS` in `.env` to include your ngrok URL:
  ```
  ALLOWED_ORIGINS=http://localhost:4200,https://abc123-def4-5678.ngrok.io
  ```

