# Testing SendGrid Integration

This guide will help you test the SendGrid email functionality step by step.

## Prerequisites

1. **SendGrid Account**: Sign up at https://sendgrid.com (free tier available)
2. **API Key**: Generate an API key in SendGrid dashboard
3. **Verified Sender Email**: Verify your sender email in SendGrid

## Step 1: Set Up Backend

### 1.1 Install Backend Dependencies

```bash
cd Newsletter_Remake/backend
npm install
```

### 1.2 Create `.env` File

Create a `.env` file in the `backend` directory:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:4200
```

**Important**: Replace `SG.your_actual_api_key_here` with your actual SendGrid API key.

### 1.3 Get Your SendGrid API Key

1. Go to https://app.sendgrid.com
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it (e.g., "Newsletter App")
5. Select **Full Access** or **Restricted Access** with "Mail Send" permission
6. Copy the API key (you'll only see it once!)

### 1.4 Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your email details
4. Check your email and click the verification link
5. Use this verified email in `SENDGRID_FROM_EMAIL`

### 1.5 Start Backend Server

```bash
cd Newsletter_Remake/backend
npm start
```

You should see:
```
Newsletter backend server running on port 3001
Environment: development
```

## Step 2: Test Backend API Directly

### 2.1 Test Health Endpoint

Open your browser or use curl:

```bash
# Browser
http://localhost:3001/api/health

# Or curl
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T...",
  "environment": "development"
}
```

### 2.2 Test Newsletter Signup (Double Opt-In)

Use Postman, curl, or your browser's fetch:

**Using curl:**
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

**Using Postman:**
- Method: `POST`
- URL: `http://localhost:3001/api/newsletter/signup`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "your-test-email@example.com",
  "newsletterType": "dl",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Please check your email to confirm your subscription"
}
```

**What Happens:**
1. Backend creates an unverified subscription
2. Sends verification email to the provided email
3. Check your email inbox for the verification email

### 2.3 Test Email Verification

1. Check your email inbox
2. Open the verification email
3. Click the "Confirm Subscription" button
4. You should be redirected to: `http://localhost:4200/subscription-confirmed?type=dl`
5. Check your email again - you should receive a welcome email

### 2.4 Test Unsubscribe

1. In the welcome email, click the "Unsubscribe" link
2. You should be redirected to: `http://localhost:4200/unsubscribed?type=dl`
3. No more emails will be sent to that address

## Step 3: Test from Frontend

### 3.1 Start Frontend

```bash
cd Newsletter_Remake/newsletter-app
npm start
```

The app should open at `http://localhost:4200`

### 3.2 Test Full Flow

1. **Navigate to Newsletter Signup:**
   - Go to `http://localhost:4200`
   - Click on a newsletter (e.g., "Duel Links")
   - Complete age gate (enter age >= 16)
   - Accept terms and conditions

2. **Submit Form:**
   - Fill out the iframe form (third-party form)
   - OR use the email prompt that appears after 5 seconds
   - Enter your email in the prompt
   - Click "Send Confirmation Email"

3. **Check Email:**
   - You should receive a verification email
   - Click the verification link
   - You should see the "Subscription Confirmed" page
   - Check email again for welcome email

## Step 4: Test Different Scenarios

### Test 1: Invalid Email
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "newsletterType": "dl"}'
```

**Expected:** Error response with "Invalid email format"

### Test 2: Missing Required Fields
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected:** Error response with "Email and newsletter type are required"

### Test 3: Invalid Newsletter Type
```bash
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "newsletterType": "invalid"}'
```

**Expected:** Error response with "Invalid newsletter type"

### Test 4: Rate Limiting
Try sending 6+ requests quickly:

```bash
# Run this 6 times quickly
curl -X POST http://localhost:3001/api/newsletter/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "newsletterType": "dl"}'
```

**Expected:** After 5 requests, you'll get rate limit error

## Step 5: Check Backend Logs

Watch the backend console for:
- `Verification email sent: dl - tes***`
- `Subscription verified: dl - tes***`
- `Unsubscribed: dl - tes***`
- Any error messages

## Step 6: Verify SendGrid Dashboard

1. Go to https://app.sendgrid.com
2. Navigate to **Activity** → **Email Activity**
3. You should see:
   - Verification emails sent
   - Welcome emails sent
   - Email delivery status
   - Any bounces or errors

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install` in the backend directory

### Issue: "SENDGRID_API_KEY is not set"
**Solution:** Make sure `.env` file exists and has `SENDGRID_API_KEY` set

### Issue: "Email not received"
**Check:**
1. Spam/junk folder
2. SendGrid Activity dashboard for delivery status
3. Backend logs for errors
4. SendGrid API key permissions

### Issue: "CORS error"
**Solution:** Make sure `ALLOWED_ORIGINS` in `.env` includes `http://localhost:4200`

### Issue: "Invalid sender email"
**Solution:** 
1. Verify sender email in SendGrid dashboard
2. Use the exact verified email in `SENDGRID_FROM_EMAIL`

## Quick Test Checklist

- [ ] Backend server starts without errors
- [ ] Health endpoint returns OK
- [ ] Signup endpoint accepts valid requests
- [ ] Verification email received
- [ ] Verification link works
- [ ] Welcome email received
- [ ] Unsubscribe link works
- [ ] Frontend can call backend API
- [ ] Email prompt appears on signup page
- [ ] All three newsletter types work (dl, md, tcg)

## Testing with Real Email

**Recommended Test Email Services:**
- Use your personal email for initial testing
- Use services like:
  - Mailinator.com (temporary emails)
  - 10minutemail.com (temporary emails)
  - Your own email account

## Production Testing

Before going to production:
1. Test with production SendGrid account
2. Verify production sender email/domain
3. Update `FRONTEND_URL` to production URL
4. Update `ALLOWED_ORIGINS` in `.env`
5. Test unsubscribe flow thoroughly
6. Monitor SendGrid dashboard for delivery rates

## Need Help?

If emails aren't sending:
1. Check SendGrid Activity dashboard
2. Check backend console logs
3. Verify API key has "Mail Send" permission
4. Verify sender email is verified in SendGrid
5. Check spam folder
6. Verify `.env` file is correct

