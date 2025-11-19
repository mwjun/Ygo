# ngrok Setup for Email Verification

## Why ngrok is Needed

When SendGrid sends verification emails, the links in those emails need to be **publicly accessible**. If the links point to `localhost:4200`, they won't work when clicked from an email because:

1. **Email clients can't access localhost** - they need a public URL
2. **SendGrid may reject localhost URLs** - some email providers block localhost links
3. **Mobile devices can't access localhost** - if you test on your phone, localhost won't work

**Solution:** Use ngrok to create a public tunnel to your local frontend!

---

## Setup Steps

### 1. Start ngrok for Frontend

```bash
ngrok http 4200
```

**Keep this terminal window open!** ngrok must stay running.

### 2. Get Your ngrok URL

In the ngrok window, you'll see:
```
Forwarding   https://abc123-def4-5678.ngrok-free.dev -> http://localhost:4200
```

**Copy the HTTPS URL** (the one starting with `https://`)

### 3. Update Backend .env File

Open `Newsletter_Remake/backend/.env` and set:

```env
# Use your ngrok URL here!
FRONTEND_URL=https://abc123-def4-5678.ngrok-free.dev

# Other required settings
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_email@domain.com
NODE_ENV=development
PORT=3001
```

### 4. Restart Backend Server

After updating `.env`, restart the backend:

```bash
cd Newsletter_Remake/backend
npm start
```

You should see:
```
Frontend URL: https://abc123-def4-5678.ngrok-free.dev
```

### 5. Test Email Verification

1. Make sure:
   - ✅ Angular app is running on `localhost:4200`
   - ✅ ngrok is running (tunneling to port 4200)
   - ✅ Backend is running on port 3001
   - ✅ Backend `.env` has your ngrok URL

2. Submit the newsletter signup form

3. Check your email - the verification link should now work!

---

## How It Works

1. **User submits form** → Frontend sends request to backend
2. **Backend creates verification link** using `FRONTEND_URL` from `.env`
3. **SendGrid sends email** with link pointing to your ngrok URL
4. **User clicks link** → Opens ngrok URL → ngrok forwards to localhost:4200
5. **Frontend loads** → Calls backend to verify subscription

---

## Important Notes

### ngrok URL Changes
- **Free tier:** URL changes every time you restart ngrok
- **Solution:** Update `FRONTEND_URL` in `.env` each time
- **Paid tier:** Can get a static URL

### Keep ngrok Running
- ngrok must stay running while testing
- If you close ngrok, email links will stop working
- Keep the ngrok terminal window open

### HTTPS Required
- Always use the **HTTPS** URL from ngrok (not HTTP)
- Email links should use HTTPS for security

### CORS Configuration
- Backend automatically allows ngrok domains in development
- No additional CORS setup needed

---

## Troubleshooting

### Email links still don't work?
1. **Check ngrok is running** - look at the ngrok terminal window
2. **Verify FRONTEND_URL** - must match your ngrok URL exactly
3. **Restart backend** - after changing `.env`, always restart
4. **Check backend console** - should show the ngrok URL in logs

### ngrok URL changed?
- Update `FRONTEND_URL` in `.env`
- Restart backend server
- Test again

### Getting "ngrok warning page"?
- This is normal for free tier
- Click "Visit Site" to proceed
- The verification will still work

### Backend can't connect?
- Make sure backend is on port 3001
- Check Angular proxy configuration
- Verify CORS allows ngrok origin

---

## Example .env File

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_key_here
SENDGRID_FROM_EMAIL=your_verified_email@domain.com

# Frontend URL - MUST be ngrok URL if using ngrok!
FRONTEND_URL=https://abc123-def4-5678.ngrok-free.dev

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS (optional - ngrok is auto-allowed in development)
# ALLOWED_ORIGINS=https://abc123-def4-5678.ngrok-free.dev
```

---

## Quick Test

1. Start ngrok: `ngrok http 4200`
2. Copy HTTPS URL
3. Update `.env`: `FRONTEND_URL=<your-ngrok-url>`
4. Restart backend
5. Submit form
6. Check email - link should work! ✅

