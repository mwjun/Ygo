# Complete SendGrid Integration Tutorial

This is a step-by-step guide to link SendGrid with your newsletter app and test that everything works correctly.

## Table of Contents
1. [Part 1: SendGrid Account Setup](#part-1-sendgrid-account-setup)
2. [Part 2: Backend Configuration](#part-2-backend-configuration)
3. [Part 3: Testing the Integration](#part-3-testing-the-integration)
4. [Part 4: Troubleshooting](#part-4-troubleshooting)

---

## 🧪 Testing on Localhost (No Domain Needed!)

**Perfect for testing!** If you're running your app on `localhost` (like `http://localhost:3001` or `http://localhost:4200`), you can test SendGrid without any domain at all:

✅ **What you need:**
- SendGrid account (free tier works)
- Your personal email (Gmail, Yahoo, Outlook, etc.) - no domain needed!
- API key from SendGrid

✅ **What you DON'T need:**
- ❌ No domain purchase
- ❌ No domain verification
- ❌ No DNS configuration
- ❌ No production server

**How it works:**
1. Verify your personal email in SendGrid (e.g., `yourname@gmail.com`)
2. Use that email as the sender in your `.env` file
3. Test sending emails from localhost - it works perfectly!

**Example for localhost testing:**
- `SENDGRID_FROM_EMAIL=yourname@gmail.com` ← Your personal email is fine!
- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:4200`

When you're ready for production later, you can verify your domain then. For now, just use your personal email!

---

## Part 1: SendGrid Account Setup

**📝 Quick Note:** The order of Steps 1.2 and 1.3 is flexible! You can create the API key (1.3) before verifying a sender email (1.2). However, **you'll need both completed before you can send emails**. Also, **you don't need a domain** - you can use your personal email for testing!

### Step 1.1: Create a SendGrid Account

1. Go to https://sendgrid.com
2. Click **"Start for Free"** or **"Sign Up"**
3. Fill in your information:
   - Email address
   - Password
   - Company name (optional)
4. Verify your email address by clicking the link in the confirmation email

### Step 1.2: Verify Your Sender Email

**Why this is important:** SendGrid requires you to verify the email address you'll be sending FROM. This prevents spam.

**⚠️ Note:** You can do Step 1.3 (Create API Key) before this step if you prefer. However, you'll need to verify at least one sender email before you can actually send emails.

**🎯 For Localhost Testing (What You're Doing):**
- **Just use your personal email!** (Gmail, Yahoo, Outlook, etc.)
- No domain needed at all
- Perfect for testing on `localhost:3001` or `localhost:4200`

1. Log into SendGrid dashboard: https://app.sendgrid.com
2. Go to **Settings** → **Sender Authentication**
3. Click **"Verify a Single Sender"**
4. Fill in the form:
   - **From Email Address**: 
     - **For localhost testing (recommended):** Use your personal email (e.g., `yourname@gmail.com`, `yourname@yahoo.com`)
     - **For production (later):** Use a domain email (e.g., `noreply@yourdomain.com`)
   - **From Name**: Your name or company name
   - **Reply To**: Same as From Email (or different if you want replies to go elsewhere)
   - **Company Address**: Your address
   - **City, State, Zip**: Your location
   - **Country**: Your country
5. Click **"Create"**
6. **Check your email inbox** - SendGrid will send you a verification email
7. **Click the verification link** in that email
8. ✅ Your sender email is now verified!

**Important Notes:**
- **✅ Perfect for localhost testing:** Use your personal email (Gmail, Yahoo, Outlook, etc.) - works great on `localhost`!
- **✅ No domain needed:** You can test everything on localhost without any domain
- **Later for production:** When you deploy to production, you can verify your domain then
- **You can verify multiple emails:** You can verify multiple sender emails if needed

### Step 1.3: Create an API Key

**✅ You can do this step BEFORE Step 1.2 if you want!** The API key doesn't require a verified sender email. However, you'll still need to verify a sender email (Step 1.2) before you can actually send emails.

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"** (top right)
3. Give it a name: `Newsletter App` or `Yu-Gi-Oh Newsletter`
4. Choose permissions:
   - **Full Access** (easiest for testing) - OR
   - **Restricted Access** → Select only **"Mail Send"** permission
5. Click **"Create & View"**
6. **⚠️ IMPORTANT:** Copy the API key immediately! It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You'll only see this once
   - If you lose it, you'll need to create a new one
7. Save it somewhere safe (we'll use it in the next step)

---

## Part 2: Backend Configuration

### Step 2.1: Navigate to Backend Directory

Open your terminal and navigate to the backend folder:

```bash
cd /Users/matthewjun/Desktop/Ygo/Newsletter_Remake/backend
```

### Step 2.2: Install Dependencies

Make sure all required packages are installed:

```bash
npm install
```

This installs:
- `express` - Web server
- `@sendgrid/mail` - SendGrid email library
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `express-rate-limit` - Rate limiting for security

### Step 2.3: Create `.env` File

Create a `.env` file in the `backend` directory. This file stores your sensitive configuration (API keys, etc.).

**Create the file:**
```bash
touch .env
```

**Or create it manually:**
- Create a new file named `.env` (with the dot at the beginning)
- Location: `/Users/matthewjun/Desktop/Ygo/Newsletter_Remake/backend/.env`

**Add this content to `.env`:**
```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=your-verified-email@example.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:4200

# CORS Configuration (optional - for production)
ALLOWED_ORIGINS=http://localhost:4200
```

**Replace these values:**
- `SENDGRID_API_KEY`: Paste the API key you copied from Step 1.3
- `SENDGRID_FROM_EMAIL`: Use the email address you verified in Step 1.2

**Example `.env` file:**
```env
SENDGRID_API_KEY=SG.abc123xyz789...
SENDGRID_FROM_EMAIL=noreply@mydomain.com
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
ALLOWED_ORIGINS=http://localhost:4200
```

**⚠️ Security Note:** Never commit the `.env` file to git! It contains your secret API key.

### Step 2.4: Verify Your Configuration

Check that your `.env` file is correct:

```bash
# On Mac/Linux, you can view it (be careful not to share this!)
cat .env
```

Make sure:
- ✅ `SENDGRID_API_KEY` starts with `SG.`
- ✅ `SENDGRID_FROM_EMAIL` matches the email you verified in SendGrid
- ✅ No extra spaces or quotes around the values

### Step 2.5: Start the Backend Server

Start your backend server:

```bash
npm start
```

**Expected output:**
```
Newsletter backend server running on port 3001
Environment: development
```

**If you see an error:**
- `ERROR: SENDGRID_API_KEY is not set` → Check your `.env` file exists and has the API key
- `Cannot find module` → Run `npm install` again
- `Port 3001 already in use` → Another process is using port 3001, stop it or change PORT in `.env`

**Keep this terminal window open** - the server needs to keep running!

---

## Part 3: Testing the Integration

Now let's test that SendGrid is working properly with your app!

### Test 1: Health Check

First, verify the server is running:

**Option A: Using Browser**
1. Open your browser
2. Go to: `http://localhost:3001/api/health`
3. You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "environment": "development"
}
```

**Option B: Using Terminal (curl)**
```bash
curl http://localhost:3001/api/health
```

✅ **Success:** If you see `"status": "ok"`, your server is running!

### Test 2: Send a Test Newsletter Signup

This will actually send an email through SendGrid!

**Option A: Using Terminal (curl)**

Replace `your-test-email@example.com` with a real email address you can check:

```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@example.com",
    "newsletterType": "dl",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Option B: Using Postman**

1. Open Postman (or download from https://postman.com)
2. Create a new request:
   - **Method:** `POST`
   - **URL:** `http://localhost:3001/api/newsletter/signup`
   - **Headers:** 
     - Key: `Content-Type`
     - Value: `application/json`
   - **Body:** Select "raw" and "JSON", then paste:
```json
{
  "email": "your-test-email@example.com",
  "newsletterType": "dl",
  "firstName": "Test",
  "lastName": "User"
}
```
3. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Please check your email to confirm your subscription"
}
```

**What Should Happen:**
1. ✅ You get a success response
2. ✅ Check your email inbox (and spam folder!)
3. ✅ You should receive a verification email from SendGrid
4. ✅ The email should have a "Confirm Subscription" button

**Newsletter Types:**
- `"dl"` = Yu-Gi-Oh! Duel Links
- `"md"` = Yu-Gi-Oh! Master Duel
- `"tcg"` = Yu-Gi-Oh! Trading Card Game

### Test 3: Verify Email Delivery in SendGrid Dashboard

1. Go to https://app.sendgrid.com
2. Navigate to **Activity** → **Email Activity**
3. You should see:
   - Your test email listed
   - Status: "Delivered" (green checkmark)
   - Recipient email address (partially hidden)
   - Timestamp

**If you see errors:**
- **Bounced:** Check that the email address is valid
- **Blocked:** Your sender email might not be verified
- **Pending:** Still processing, wait a moment

### Test 4: Test Email Verification Flow

1. **Check your email** for the verification email
2. **Click the "Confirm Subscription" button** in the email
3. You should be redirected to: `http://localhost:4200/subscription-confirmed?type=dl`
4. **Check your email again** - you should receive a welcome email!

### Test 5: Test Error Handling

**Test Invalid Email:**
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email", "newsletterType": "dl"}'
```

**Expected:** Error response with "Invalid email format"

**Test Missing Fields:**
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected:** Error response with "Email and newsletter type are required"

**Test Invalid Newsletter Type:**
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "newsletterType": "invalid"}'
```

**Expected:** Error response with "Invalid newsletter type"

### Test 6: Check Backend Logs

Look at your terminal where the server is running. You should see:

```
Verification email sent: dl - tes***
```

This confirms the email was sent successfully!

---

## Part 4: Troubleshooting

### Problem: "SENDGRID_API_KEY is not set"

**Solution:**
1. Make sure `.env` file exists in the `backend` directory
2. Check the file has `SENDGRID_API_KEY=SG.xxx...`
3. Make sure there are no spaces: `SENDGRID_API_KEY = SG.xxx` ❌ (wrong)
4. Restart the server after creating/editing `.env`

### Problem: "Email not received"

**Check these:**
1. **Spam/Junk folder** - Check there first!
2. **SendGrid Activity Dashboard:**
   - Go to https://app.sendgrid.com → Activity → Email Activity
   - See if email shows as "Delivered" or has an error
3. **Backend logs:** Check terminal for error messages
4. **API Key permissions:** Make sure it has "Mail Send" permission
5. **Sender email verified:** Check Settings → Sender Authentication

### Problem: "Invalid sender email" or "Sender not verified"

**Solution:**
1. Go to SendGrid → Settings → Sender Authentication
2. Make sure your sender email shows as "Verified" ✅
3. If not verified, click "Verify a Single Sender" again
4. Check your email and click the verification link
5. Make sure `SENDGRID_FROM_EMAIL` in `.env` matches exactly

### Problem: "CORS error" (when testing from frontend)

**Solution:**
Add to your `.env` file:
```env
ALLOWED_ORIGINS=http://localhost:4200
```

Or for multiple origins:
```env
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

### Problem: "Cannot find module"

**Solution:**
```bash
cd Newsletter_Remake/backend
npm install
```

### Problem: "Port 3001 already in use"

**Solution:**
1. Find what's using port 3001:
   ```bash
   lsof -i :3001
   ```
2. Kill that process, or change PORT in `.env`:
   ```env
   PORT=3002
   ```

### Problem: SendGrid API returns 403 Forbidden

**Possible causes:**
1. API key doesn't have "Mail Send" permission
2. API key is incorrect
3. Account is suspended (check SendGrid dashboard)

**Solution:**
1. Create a new API key with proper permissions
2. Update `.env` with the new key
3. Restart server

### Problem: Rate limiting errors

**What it means:** You're sending too many requests too quickly (more than 5 per 15 minutes from same IP)

**Solution:** Wait 15 minutes, or test from a different IP address

---

## Quick Reference: Testing Commands

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Signup (Duel Links):**
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "newsletterType": "dl"}'
```

**Signup (Master Duel):**
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "newsletterType": "md"}'
```

**Signup (TCG):**
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "newsletterType": "tcg"}'
```

---

## Success Checklist

Before considering the integration complete, verify:

- [ ] SendGrid account created
- [ ] Sender email verified in SendGrid
- [ ] API key created and saved
- [ ] `.env` file created with correct values
- [ ] Backend server starts without errors
- [ ] Health endpoint returns OK
- [ ] Test signup sends verification email
- [ ] Verification email received in inbox
- [ ] Verification link works
- [ ] Welcome email received after verification
- [ ] SendGrid Activity dashboard shows delivered emails
- [ ] Error handling works (invalid email, missing fields, etc.)

---

## Next Steps

Once everything is working:

1. **Test from Frontend:** Start your Angular app and test the full user flow
2. **Production Setup:** 
   - Verify your domain in SendGrid (instead of single email)
   - Update `FRONTEND_URL` to production URL
   - Set `NODE_ENV=production`
   - Configure production CORS origins
3. **Monitor:** Regularly check SendGrid Activity dashboard for delivery rates

---

## Need More Help?

- **SendGrid Documentation:** https://docs.sendgrid.com
- **SendGrid Support:** Available in dashboard
- **Check Backend Logs:** Look at terminal output for detailed error messages
- **SendGrid Activity Dashboard:** Shows delivery status and errors

---

**Congratulations!** 🎉 If you've completed all the tests successfully, SendGrid is properly linked and working with your app!

