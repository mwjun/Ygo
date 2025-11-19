# Email Verification Troubleshooting Guide

## ⚠️ IMPORTANT: ngrok Setup Required

**If you're using ngrok to tunnel to your frontend, the `FRONTEND_URL` in `.env` MUST be your ngrok URL!**

Verification email links need to point to a publicly accessible URL. If they point to `localhost`, the links won't work when clicked from email.

### Quick Fix:
1. Start ngrok: `ngrok http 4200`
2. Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.dev`)
3. Update `.env`: `FRONTEND_URL=https://abc123.ngrok-free.dev`
4. Restart backend server

---

If you're not receiving verification emails, follow these steps:

## 1. Check Backend Server is Running

```bash
cd Newsletter_Remake/backend
npm start
```

You should see:
```
Newsletter backend server running on port 3001
Environment: development
Frontend URL: http://localhost:4200
```

## 2. Check Environment Variables

Create a `.env` file in `Newsletter_Remake/backend/` with:

```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@domain.com
FRONTEND_URL=http://localhost:4200
NODE_ENV=development
PORT=3001
```

**Important:**
- `SENDGRID_API_KEY` is **REQUIRED** - server will exit if not set
- `SENDGRID_FROM_EMAIL` must be a **verified sender** in SendGrid
- Get your API key from: https://app.sendgrid.com/settings/api_keys

## 3. Check Backend Console Logs

When you submit the form, you should see in the backend console:

```
Attempting to send verification email to: user@example.com
From email: your_verified_email@domain.com
Newsletter type: dl
✓ Verification email sent successfully: dl - use***
```

**If you see errors:**
- Check the error message in the console
- Common issues:
  - Invalid API key
  - Unverified sender email
  - SendGrid account issues

## 4. Check SendGrid Account

1. **Verify Sender Email:**
   - Go to https://app.sendgrid.com/settings/sender_auth
   - Verify your sender email address
   - The `SENDGRID_FROM_EMAIL` must match a verified sender

2. **Check API Key Permissions:**
   - Go to https://app.sendgrid.com/settings/api_keys
   - Ensure your API key has "Mail Send" permissions

3. **Check SendGrid Activity:**
   - Go to https://app.sendgrid.com/activity
   - Look for your email attempts
   - Check if emails are being blocked or bounced

## 5. Check Frontend Console

Open browser DevTools (F12) and check:
- Network tab: Is the request to `/api/newsletter/signup` successful?
- Console tab: Any JavaScript errors?
- Response: Does it show `success: true`?

## 6. Common Issues

### Issue: "SENDGRID_API_KEY is not set"
**Solution:** Add `SENDGRID_API_KEY` to your `.env` file

### Issue: "The from address does not match a verified Sender Identity"
**Solution:** 
- Verify your sender email in SendGrid
- Ensure `SENDGRID_FROM_EMAIL` matches the verified email exactly

### Issue: "Invalid API key"
**Solution:**
- Regenerate your API key in SendGrid
- Update `.env` with the new key
- Restart the backend server

### Issue: "reCAPTCHA verification failed"
**Solution:**
- In development, this is skipped if `RECAPTCHA_SECRET_KEY` is not set
- If you set it, ensure it's valid
- Check browser console for CAPTCHA errors

### Issue: Backend not receiving requests
**Solution:**
- Check if backend is running on port 3001
- Check Angular proxy configuration (`proxy.conf.json`)
- Ensure frontend is using correct API URL

## 7. Test Backend Directly

Test the backend API directly using curl or Postman:

```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "newsletterType": "dl",
    "firstName": "Test",
    "captchaToken": "test-token"
  }'
```

Check the backend console for logs.

## 8. Check Email Spam Folder

- Verification emails might go to spam
- Check your spam/junk folder
- Add the sender to your contacts

## 9. SendGrid Free Tier Limits

- Free tier: 100 emails/day
- Check your SendGrid dashboard for usage
- Upgrade if you've hit the limit

## 10. Enable Detailed Logging

The backend now logs:
- Email sending attempts
- SendGrid API responses
- Error details (in development)

Check the backend console for detailed error messages.

---

## Quick Checklist

- [ ] Backend server is running on port 3001
- [ ] `.env` file exists with `SENDGRID_API_KEY`
- [ ] `SENDGRID_FROM_EMAIL` is verified in SendGrid
- [ ] Frontend can reach backend (check Network tab)
- [ ] No errors in backend console
- [ ] Checked spam folder
- [ ] SendGrid account is active
- [ ] API key has "Mail Send" permissions

---

## Still Not Working?

1. Check backend console for specific error messages
2. Check SendGrid Activity dashboard
3. Verify all environment variables are set correctly
4. Try sending a test email directly from SendGrid dashboard
5. Check if your email provider is blocking SendGrid emails

