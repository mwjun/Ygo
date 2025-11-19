# Newsletter App - Complete Deployment Guide

## Overview

This guide covers deploying the newsletter application to production at:
**`http://card-app.kde-us.com/newsletter/ygo_signup/`**

The app supports both:
- **Production deployment** (Apache server)
- **Development/testing with ngrok** (for email verification testing)

---

## 📦 What Was Built

The production build is located in:
```
Newsletter_Remake/newsletter-app/deploy/
```

**All files in this folder are ready for deployment!**

---

## 🚀 Production Deployment (Apache Server)

### Step 1: Upload Files to Server

1. **Open WinSCP** (or your preferred FTP/SFTP client)
2. **Connect to your Apache server** (`card-app.kde-us.com`)
3. **Navigate to the web root directory** (usually `/var/www/html/` or similar)
4. **Create the directory structure** if it doesn't exist:
   ```
   /newsletter/ygo_signup/
   ```
5. **Drag and drop ALL files** from `Newsletter_Remake/newsletter-app/deploy/` to:
   ```
   /newsletter/ygo_signup/
   ```

### Step 2: Verify File Structure

After uploading, your server should have:
```
/newsletter/ygo_signup/
  ├── index.html
  ├── .htaccess
  ├── main-*.js
  ├── polyfills-*.js
  ├── styles-*.css
  ├── assets/
  │   └── img/
  │       ├── konami_logo.png
  │       ├── cr-digital.png
  │       └── ...
  └── ygocard.ico
```

### Step 3: Configure Backend for Production

**Important:** The backend must be running and accessible at:
```
https://card-app.kde-us.com/api/newsletter/signup
```

#### Backend Configuration (`backend/.env`):

```env
# Production Configuration
NODE_ENV=production
PORT=3001

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=mjemailbox91@gmail.com

# Frontend URL (Production)
FRONTEND_URL=https://card-app.kde-us.com/newsletter/ygo_signup

# CORS Allowed Origins (Production)
ALLOWED_ORIGINS=https://card-app.kde-us.com

# reCAPTCHA (if using)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

#### Start Backend Server:

```bash
cd Newsletter_Remake/backend
npm start
```

**The backend must be running and accessible at `https://card-app.kde-us.com/api/`**

---

## 🧪 Development/Testing with ngrok

### Why ngrok?

ngrok is needed for **email verification testing** because:
- Email verification links must be publicly accessible
- `localhost` URLs don't work in emails
- ngrok creates a public HTTPS tunnel to your local machine

### Step 1: Start Backend Server

```bash
cd Newsletter_Remake/backend
npm start
```

### Step 2: Configure Backend for ngrok

Update `backend/.env`:

```env
# Development Configuration
NODE_ENV=development
PORT=3001

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=mjemailbox91@gmail.com

# Frontend URL (ngrok - UPDATE THIS WITH YOUR NGROK URL)
FRONTEND_URL=https://your-ngrok-url.ngrok-free.dev

# CORS Allowed Origins (Development)
ALLOWED_ORIGINS=http://localhost:4200,https://your-ngrok-url.ngrok-free.dev

# reCAPTCHA (if using)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### Step 3: Start ngrok

**Open a NEW terminal window** and run:

```bash
ngrok http 4200
```

**Copy the HTTPS URL** from ngrok output (e.g., `https://abc123.ngrok-free.dev`)

### Step 4: Update Backend .env

Update `FRONTEND_URL` in `backend/.env` with your ngrok URL:

```env
FRONTEND_URL=https://abc123.ngrok-free.dev
```

**Restart the backend server** after updating `.env`:

```bash
cd Newsletter_Remake/backend
npm start
```

### Step 5: Start Frontend (Angular)

**Open another NEW terminal window** and run:

```bash
cd Newsletter_Remake/newsletter-app
npm start
```

This starts Angular on `http://localhost:4200`

### Step 6: Test the Application

1. **Access via ngrok:** Open `https://your-ngrok-url.ngrok-free.dev` in your browser
2. **Complete the signup form**
3. **Check your email** for verification link
4. **Click the verification link** - it should work via ngrok!

---

## 🔧 How the App Detects Environment

The frontend automatically detects the environment and uses the correct backend API URL:

### Production (`card-app.kde-us.com`):
- **Signup API:** `https://card-app.kde-us.com/api/newsletter/signup`
- **Verification API:** `https://card-app.kde-us.com/api/newsletter/verify`

### Development (`localhost`):
- **Signup API:** `http://localhost:3001/api/newsletter/signup`
- **Verification API:** `http://localhost:3001/api/newsletter/verify`

### ngrok (Development Testing):
- **Signup API:** `/api/newsletter/signup` (relative path, proxy forwards to localhost:3001)
- **Verification API:** `/api/newsletter/verify` (relative path, proxy forwards to localhost:3001)

**Note:** The Angular dev server proxy (`proxy.conf.json`) forwards `/api/*` requests to `localhost:3001` when using ngrok.

---

## 📋 Deployment Checklist

### Before Deploying:

- [ ] Backend server is running and accessible
- [ ] Backend `.env` is configured for production
- [ ] SendGrid API key is set in backend `.env`
- [ ] `FRONTEND_URL` in backend `.env` matches production URL
- [ ] `ALLOWED_ORIGINS` in backend `.env` includes production domain
- [ ] Angular production build completed successfully
- [ ] All files are in `deploy/` folder

### After Deploying:

- [ ] Test age gate at `http://card-app.kde-us.com/newsletter/ygo_signup/`
- [ ] Test newsletter signup form
- [ ] Test reCAPTCHA verification
- [ ] Test email verification link
- [ ] Verify backend API is accessible
- [ ] Check browser console for errors
- [ ] Test on mobile device (if applicable)

---

## 🐛 Troubleshooting

### Issue: "Failed to sign up" error

**Possible causes:**
1. Backend server is not running
2. Backend API is not accessible at `https://card-app.kde-us.com/api/newsletter/signup`
3. CORS configuration is incorrect
4. SendGrid API key is invalid

**Solution:**
- Check backend server logs
- Verify backend `.env` configuration
- Test backend API directly: `curl https://card-app.kde-us.com/api/health`

### Issue: Email verification links don't work

**Possible causes:**
1. `FRONTEND_URL` in backend `.env` is incorrect
2. Email links point to wrong URL
3. Backend is not accessible

**Solution:**
- Verify `FRONTEND_URL` in backend `.env` matches production URL exactly
- Check email verification link in received email
- Ensure backend is running and accessible

### Issue: CORS errors in browser console

**Possible causes:**
1. `ALLOWED_ORIGINS` in backend `.env` doesn't include production domain
2. Backend CORS configuration is incorrect

**Solution:**
- Add production domain to `ALLOWED_ORIGINS` in backend `.env`
- Restart backend server after updating `.env`

### Issue: Page shows 404 or blank page

**Possible causes:**
1. `.htaccess` file is missing or incorrect
2. Apache `mod_rewrite` is not enabled
3. Files are in wrong directory

**Solution:**
- Verify `.htaccess` file is in `/newsletter/ygo_signup/` directory
- Check Apache error logs
- Ensure `mod_rewrite` is enabled: `sudo a2enmod rewrite`

---

## 📁 File Structure

### Production Deployment:
```
/newsletter/ygo_signup/          (Apache server)
  ├── index.html                 (Angular app entry point)
  ├── .htaccess                  (Apache routing configuration)
  ├── main-*.js                  (Angular application code)
  ├── polyfills-*.js             (Browser compatibility)
  ├── styles-*.css               (Application styles)
  ├── assets/                    (Images, fonts, etc.)
  └── ygocard.ico                (Favicon)
```

### Backend (Separate Server/Process):
```
/backend/                         (Node.js server)
  ├── server.js                  (Express.js backend)
  ├── .env                       (Environment variables)
  └── models/                    (Database models)
```

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Use HTTPS in production** - Required for secure cookies and CSP
3. **Keep backend server updated** - Regular security patches
4. **Monitor backend logs** - Watch for suspicious activity
5. **Rate limiting is enabled** - Prevents abuse (5 requests per 15 minutes per IP)

---

## 📞 Support

If you encounter issues:
1. Check backend server logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test backend API endpoints directly
5. Review this deployment guide

---

## ✅ Quick Reference

### Production URLs:
- **Frontend:** `http://card-app.kde-us.com/newsletter/ygo_signup/`
- **Backend API:** `https://card-app.kde-us.com/api/newsletter/signup`

### Development URLs:
- **Frontend:** `http://localhost:4200`
- **Backend API:** `http://localhost:3001/api/newsletter/signup`
- **ngrok:** `https://your-ngrok-url.ngrok-free.dev`

### Build Command:
```bash
cd Newsletter_Remake/newsletter-app
npm run build
```

### Backend Start Command:
```bash
cd Newsletter_Remake/backend
npm start
```

---

**Last Updated:** 2025-11-19
**Version:** 3.0.1

