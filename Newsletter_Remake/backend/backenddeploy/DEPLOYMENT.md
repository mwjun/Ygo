# Backend Deployment Package

## Contents

This package contains everything needed to deploy the newsletter backend API.

## Files Included

- `server.js` - Main Express.js server
- `package.json` - Node.js dependencies
- `models/` - Database models
- `.env.example` - Environment variables template
- Documentation files

## Deployment Steps

### 1. Upload Files

Upload all files in this folder to your server (e.g., `/var/www/backend/` or `/opt/newsletter-backend/`).

### 2. Install Dependencies

```bash
cd /path/to/backend
npm install --production
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with your actual values
```

**Required environment variables:**
- `SENDGRID_API_KEY` - Your SendGrid API key
- `SENDGRID_FROM_EMAIL` - Verified sender email
- `FRONTEND_URL` - Frontend application URL
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA Secret Key
- `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)

### 4. Start the Server

```bash
npm start
```

Or use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name newsletter-backend
pm2 save
pm2 startup
```

### 5. Verify

Check that the server is running:
```bash
curl http://localhost:3001/api/health
```

## Security Notes

- **Never commit `.env` file** - It contains sensitive keys
- Keep `.env` file permissions restricted: `chmod 600 .env`
- Use a process manager (PM2) for production
- Set up firewall rules to only allow necessary ports
- Use HTTPS in production (set up reverse proxy with nginx/Apache)

## Port Configuration

Default port is `3001`. Change in `.env`:
```
PORT=3001
```

## Process Manager (PM2) Setup

For production, use PM2 to keep the server running:

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name newsletter-backend

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions it provides
```

## Monitoring

```bash
# View logs
pm2 logs newsletter-backend

# View status
pm2 status

# Restart
pm2 restart newsletter-backend

# Stop
pm2 stop newsletter-backend
```

## Troubleshooting

See `TROUBLESHOOTING.md` for common issues and solutions.

---

**Package Created:** 2025-11-19T06:32:26.803Z
