# Email Verification Checklist

## ⚠️ IMPORTANT: Using ngrok for Frontend?

**If you're using ngrok to tunnel to your frontend, you MUST set `FRONTEND_URL` to your ngrok URL!**

The verification email links need to point to a publicly accessible URL. If they point to `localhost`, the links won't work when clicked from email.

### Quick Setup with ngrok:

1. **Start ngrok for frontend:**
   ```bash
   ngrok http 4200
   ```

2. **Copy your ngrok HTTPS URL** (e.g., `https://abc123.ngrok-free.dev`)

3. **Update backend `.env` file:**
   ```env
   FRONTEND_URL=https://your-ngrok-url.ngrok-free.dev
   ```

4. **Restart backend server** after updating `.env`

5. **The verification email links will now work!**

---

## Quick Diagnosis Steps

### 1. **Check Backend Server is Running**
```bash
cd Newsletter_Remake/backend
npm start
```

**Look for:**
- `Newsletter backend server running on port 3001`
- `✓ SendGrid initialized`
- `From email: your_email@domain.com`

**If you see:**
- `❌ ERROR: SENDGRID_API_KEY is not set` → You need to create a `.env` file

### 2. **Create .env File**

Create `Newsletter_Remake/backend/.env` with:

```env
SENDGRID_API_KEY=your_actual_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@domain.com

# IMPORTANT: If using ngrok, use your ngrok URL here!
# Get it from: ngrok http 4200
FRONTEND_URL=https://your-ngrok-url.ngrok-free.dev

# OR if NOT using ngrok (testing locally only):
# FRONTEND_URL=http://localhost:4200

NODE_ENV=development
PORT=3001
```

**⚠️ Critical:** The `FRONTEND_URL` must be accessible from the internet if you want email links to work. Use ngrok URL if testing from email!

**Where to get these:**
- **SENDGRID_API_KEY**: https://app.sendgrid.com/settings/api_keys
- **SENDGRID_FROM_EMAIL**: Must be verified at https://app.sendgrid.com/settings/sender_auth

### 3. **Test the Form**

1. Fill out the newsletter signup form
2. Complete the CAPTCHA
3. Click "Sign Up Now"
4. **Check the backend console** - you should see:
   ```
   Attempting to send verification email to: your@email.com
   From email: your_verified_email@domain.com
   Newsletter type: dl
   ✓ Verification email sent successfully: dl - you***
   ```

### 4. **If You See Errors in Backend Console**

**Error: "The from address does not match a verified Sender Identity"**
- Solution: Verify your sender email in SendGrid dashboard
- Go to: https://app.sendgrid.com/settings/sender_auth
- Verify the email address
- Make sure `SENDGRID_FROM_EMAIL` matches exactly

**Error: "Invalid API key"**
- Solution: Regenerate API key in SendGrid
- Update `.env` file
- Restart backend server

**Error: "reCAPTCHA verification failed"**
- In development, this is skipped if `RECAPTCHA_SECRET_KEY` is not set
- If you set it, make sure it's valid
- Check browser console for CAPTCHA errors

### 5. **Check Frontend is Connecting to Backend**

Open browser DevTools (F12):
- **Network tab**: Look for request to `/api/newsletter/signup`
- **Status**: Should be `200 OK`
- **Response**: Should show `{"success": true, "message": "..."}`

**If you see:**
- `Failed to fetch` or `Network error` → Backend not running or wrong URL
- `400 Bad Request` → Check error message in response
- `500 Internal Server Error` → Check backend console for details

### 6. **Check SendGrid Activity**

1. Go to: https://app.sendgrid.com/activity
2. Look for your email attempts
3. Check status:
   - **Delivered** → Check spam folder
   - **Bounced** → Email address issue
   - **Blocked** → Sender not verified
   - **Dropped** → SendGrid rejected (check reason)

### 7. **Common Issues**

| Issue | Solution |
|-------|----------|
| No .env file | Create `.env` in `backend/` directory |
| API key not set | Add `SENDGRID_API_KEY` to `.env` |
| Sender not verified | Verify email in SendGrid dashboard |
| Backend not running | Run `npm start` in backend directory |
| Wrong port | Check backend is on port 3001 |
| CORS error | Check `ALLOWED_ORIGINS` in `.env` |
| reCAPTCHA blocking | In dev, leave `RECAPTCHA_SECRET_KEY` unset |

---

## Step-by-Step Setup

1. **Install dependencies:**
   ```bash
   cd Newsletter_Remake/backend
   npm install
   ```

2. **Create .env file:**
   ```bash
   # Create .env file in Newsletter_Remake/backend/
   SENDGRID_API_KEY=SG.your_actual_key_here
   SENDGRID_FROM_EMAIL=your_verified_email@domain.com
   FRONTEND_URL=http://localhost:4200
   NODE_ENV=development
   ```

3. **Start backend:**
   ```bash
   npm start
   ```

4. **Start frontend (in another terminal):**
   ```bash
   cd Newsletter_Remake/newsletter-app
   npm start
   ```

5. **Test signup:**
   - Fill form
   - Complete CAPTCHA
   - Submit
   - Check backend console for logs
   - Check email (and spam folder)

---

## Debug Mode

The backend now logs detailed information:
- Email sending attempts
- SendGrid API responses
- Error details (in development)

**Check backend console for:**
- `Attempting to send verification email to: ...`
- `✓ Verification email sent successfully` (success)
- `❌ SendGrid error occurred:` (error - check details)

---

## Still Not Working?

1. **Check backend console** - it will tell you exactly what's wrong
2. **Check SendGrid Activity** - see if emails are being sent
3. **Verify .env file** - make sure all variables are set correctly
4. **Test API directly** - use Postman or curl to test backend
5. **Check email spam folder** - emails might be filtered

See `TROUBLESHOOTING.md` for more detailed help.

