# Backend Environment Setup

## Quick Setup

1. **Copy the example file:**
   ```bash
   cd Newsletter_Remake/backend
   cp .env.example .env
   ```

2. **Edit `.env` and add your actual values:**
   ```env
   # Required for reCAPTCHA validation
   RECAPTCHA_SECRET_KEY=6LfzfxEsAAAAALEfwOTc2jaZvBv4V5pR_gsExRpw
   
   # Your SendGrid API key
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   
   # Your SendGrid verified sender email
   SENDGRID_FROM_EMAIL=your_email@example.com
   
   # Frontend URL (for email verification links)
   FRONTEND_URL=http://localhost:4200
   # OR for production:
   # FRONTEND_URL=http://54.183.163.113/newsletter/ygo_signup
   
   # CORS origins
   ALLOWED_ORIGINS=http://localhost:4200,http://54.183.163.113
   ```

3. **Save the file** - `.env` is already in `.gitignore` so it won't be committed

## reCAPTCHA Secret Key

Your reCAPTCHA Secret Key has been configured:
```
RECAPTCHA_SECRET_KEY=6LfzfxEsAAAAALEfwOTc2jaZvBv4V5pR_gsExRpw
```

**Important:** 
- This key is already set in your `.env` file (if it exists)
- If you don't have a `.env` file, create one using `.env.example` as a template
- Never commit the `.env` file to git

## Verification

After setting up `.env`, restart your backend server:
```bash
cd Newsletter_Remake/backend
npm start
```

The server will log whether reCAPTCHA validation is enabled or not.

