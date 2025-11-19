# reCAPTCHA Setup Guide

## Current Status

The app is currently using Google's **test reCAPTCHA key** which only works on `localhost`. For production, you need to set up a real reCAPTCHA.

## Step 1: Get reCAPTCHA Keys from Google

1. Go to: https://www.google.com/recaptcha/admin/create
2. Sign in with your Google account
3. Fill out the form:
   - **Label:** Newsletter Signup (or any name you prefer)
   - **reCAPTCHA type:** Select **reCAPTCHA v2** → **Challenge based** (this is the "I'm not a robot" checkbox)
     - Note: "Score based" is reCAPTCHA v3 (different implementation)
     - We need "Challenge based" for the checkbox version
   - **Domains:** Add your domains:
     - `localhost` (for development)
     - `54.183.163.113` (your IP server)
     - `card-app.kde-us.com` (if you're using that domain)
   - Accept the reCAPTCHA Terms of Service
4. Click **Submit**
5. You'll get two keys:
   - **Site Key** (public - goes in frontend)
   - **Secret Key** (private - goes in backend .env)

## Step 2: Update Frontend (Angular)

### Option A: Update directly in code (Quick)

Edit `Newsletter_Remake/newsletter-app/src/app/components/home/home.ts`:

Find this line (around line 141):
```typescript
readonly RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google reCAPTCHA test key (works on localhost only)
```

Replace with your real Site Key:
```typescript
readonly RECAPTCHA_SITE_KEY = 'YOUR_SITE_KEY_HERE'; // Your reCAPTCHA Site Key
```

### Option B: Use environment variable (Recommended for production)

1. Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  recaptchaSiteKey: 'YOUR_SITE_KEY_HERE'
};
```

2. Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test key for development
};
```

3. Update `home.ts` to import and use:
```typescript
import { environment } from '../../environments/environment';
...
readonly RECAPTCHA_SITE_KEY = environment.recaptchaSiteKey;
```

## Step 3: Update Backend (.env file)

Edit `Newsletter_Remake/backend/.env`:

Add your Secret Key:
```env
RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY_HERE
```

**Important:** 
- Never commit the Secret Key to git
- Keep it in `.env` file (which should be in `.gitignore`)
- The Secret Key is different from the Site Key

## Step 4: Rebuild and Deploy

After updating the keys:

1. **Frontend:**
   ```bash
   cd Newsletter_Remake/newsletter-app
   npm run package:ygo-ip
   ```

2. **Backend:**
   - Restart the backend server after updating `.env`
   ```bash
   cd Newsletter_Remake/backend
   npm start
   ```

## Step 5: Test

1. Visit your deployed site
2. Fill out the newsletter signup form
3. Click "Sign Up"
4. The reCAPTCHA should appear
5. Complete the CAPTCHA
6. Submit the form
7. Check backend logs to verify reCAPTCHA validation is working

## Troubleshooting

### CAPTCHA doesn't appear
- Check browser console for errors
- Verify the Site Key is correct
- Make sure the domain is added in Google reCAPTCHA admin
- Check that `https://www.google.com/recaptcha/api.js` is loading

### "reCAPTCHA verification failed" error
- Verify Secret Key is set in backend `.env`
- Check backend logs for detailed error messages
- Make sure you're using the correct Secret Key (not the Site Key)
- Verify the domain matches what's registered in Google reCAPTCHA

### CAPTCHA works on localhost but not on server
- Add your server domain/IP to Google reCAPTCHA admin
- For IP addresses, add: `54.183.163.113`
- For domains, add: `card-app.kde-us.com` (if using)

## Security Notes

- **Site Key** (frontend): Public, safe to expose in code
- **Secret Key** (backend): Private, must be kept secret
- Never share your Secret Key
- Use different keys for development and production if needed

## Quick Reference

**Frontend file to update:**
- `Newsletter_Remake/newsletter-app/src/app/components/home/home.ts` (line ~141)

**Backend file to update:**
- `Newsletter_Remake/backend/.env` (add `RECAPTCHA_SECRET_KEY`)

**Google reCAPTCHA Admin:**
- https://www.google.com/recaptcha/admin

