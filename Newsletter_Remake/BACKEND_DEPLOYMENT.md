# Backend Deployment Guide

## Quick Start

1. **Package the backend:**
   ```bash
   cd Newsletter_Remake/backend
   npm run package
   ```

2. **Upload to server:**
   - Upload all files from `backenddeploy/` folder to your server
   - Example location: `/opt/newsletter-backend/` or `/var/www/backend/`

3. **Install dependencies:**
   ```bash
   cd /path/to/backend
   npm install --production
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your actual values
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

   Or use PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name newsletter-backend
   pm2 save
   pm2 startup
   ```

---

## Package Contents

The `backenddeploy/` folder contains:

- ✅ `server.js` - Main Express.js server
- ✅ `package.json` - Dependencies configuration
- ✅ `models/` - Database models directory
- ✅ `.env.example` - Environment variables template
- ✅ `DEPLOYMENT.md` - Detailed deployment instructions
- ✅ Documentation files (README.md, SETUP_ENV.md, TROUBLESHOOTING.md)
- ✅ `.gitignore` - Git ignore rules

**Excluded (for security):**
- ❌ `.env` - Actual environment file with secrets (not included)
- ❌ `node_modules/` - Dependencies (install on server)
- ❌ `package-lock.json` - Can be regenerated

---

## Environment Variables Required

After copying `.env.example` to `.env`, configure:

```env
# Server
NODE_ENV=production
PORT=3001

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email@example.com

# Frontend URL (for email verification links)
FRONTEND_URL=http://54.183.163.113/newsletter/ygo_signup

# CORS
ALLOWED_ORIGINS=http://54.183.163.113,http://localhost:4200

# reCAPTCHA
RECAPTCHA_SECRET_KEY=6LfzfxEsAAAAALEfwOTc2jaZvBv4V5pR_gsExRpw
```

---

## Production Setup with PM2

**Install PM2:**
```bash
npm install -g pm2
```

**Start server:**
```bash
pm2 start server.js --name newsletter-backend
```

**Save configuration:**
```bash
pm2 save
```

**Set up auto-start on boot:**
```bash
pm2 startup
# Follow the instructions it provides
```

**Useful PM2 commands:**
```bash
pm2 status              # View status
pm2 logs newsletter-backend  # View logs
pm2 restart newsletter-backend  # Restart
pm2 stop newsletter-backend     # Stop
```

---

## Verification

Test the API:
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","message":"Newsletter API is running"}
```

---

## Security Checklist

- [ ] `.env` file has correct permissions: `chmod 600 .env`
- [ ] `.env` is not committed to git
- [ ] Firewall configured (only necessary ports open)
- [ ] Using HTTPS in production (reverse proxy)
- [ ] Process manager (PM2) configured
- [ ] Logs are being monitored

---

**Package Location:** `Newsletter_Remake/backend/backenddeploy/`

