# How to Start Everything

## Quick Start Guide

You need **3 things running** for the newsletter app to work:

1. **Backend Server** (port 3001) ✅ Already running!
2. **Frontend (Angular)** (port 4200) - Need to start
3. **ngrok** (tunnels to port 4200) - Need to start

---

## Step-by-Step

### 1. Backend Server ✅ (Already Running!)

You already have this running:
```
✓ Server running on port 3001
✓ Frontend URL: https://miguel-biotic-dorcas.ngrok-free.dev
```

**Keep this terminal window open!**

---

### 2. Start ngrok for Frontend

Open a **NEW terminal window** and run:

```bash
ngrok http 4200
```

**What to look for:**
```
Forwarding   https://miguel-biotic-dorcas.ngrok-free.dev -> http://localhost:4200
```

**Important:**
- ✅ If the URL matches `miguel-biotic-dorcas.ngrok-free.dev` → Perfect! Continue
- ❌ If the URL is different → Update `.env` with the new URL and restart backend

**Keep this terminal window open!** ngrok must stay running.

---

### 3. Start Frontend (Angular)

Open **another NEW terminal window** and run:

```bash
cd Newsletter_Remake/newsletter-app
npm start
```

This will start Angular on `http://localhost:4200`

---

## Summary - 3 Terminal Windows

**Terminal 1: Backend** (already running)
```bash
cd Newsletter_Remake/backend
npm start
# ✅ Running on port 3001
```

**Terminal 2: ngrok** (start this)
```bash
ngrok http 4200
# ✅ Tunnels to localhost:4200
```

**Terminal 3: Frontend** (start this)
```bash
cd Newsletter_Remake/newsletter-app
npm start
# ✅ Running on localhost:4200
```

---

## Verify Everything is Working

1. **Backend:** Should show your ngrok URL in startup logs ✅
2. **ngrok:** Should show "Session Status: online" ✅
3. **Frontend:** Should open at `http://localhost:4200` ✅

---

## Test Email Verification

1. Open browser: `http://localhost:4200`
2. Fill out newsletter signup form
3. Complete CAPTCHA
4. Submit form
5. **Watch backend console** - should show email sending logs
6. Check your email for verification link
7. Click link - should work via ngrok!

---

## Troubleshooting

### ngrok URL doesn't match?
- Free tier ngrok URLs change each time you restart
- Update `FRONTEND_URL` in `backend/.env` with new URL
- Restart backend server

### Can't access frontend?
- Make sure Angular is running on port 4200
- Check ngrok is pointing to port 4200 (not 3001)

### Email links don't work?
- Make sure ngrok is still running
- Verify `FRONTEND_URL` in `.env` matches your ngrok URL
- Check backend console for errors

