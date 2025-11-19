# Newsletter App Deployment Guide

This guide explains how to deploy the Angular newsletter application to Apache at the URL:
**http://card-app.kde-us.com/newsletter/ygo_signup/**

## Prerequisites

- Node.js and npm installed
- Apache web server with mod_rewrite enabled
- Access to the Apache server directory
- Backend API server running (for SendGrid integration)

## Build Steps

### 1. Navigate to the Angular app directory

```bash
cd Newsletter_Remake/newsletter-app
```

### 2. Install dependencies (if not already installed)

```bash
npm install
```

### 3. Build the production version

```bash
npm run build
```

This will create a `deploy/` directory containing all the production files ready for deployment.

### 4. Verify the build output

The build should include:
- `index.html` (with base href set to `/newsletter/ygo_signup/`)
- JavaScript bundles (main.*.js, polyfills.*.js, etc.)
- CSS files
- Assets folder with images
- `.htaccess` file (for Apache routing)

## Apache Deployment

### 1. Upload files to Apache server

**Using WinSCP (Drag and Drop):**
1. Open WinSCP and connect to your Apache server
2. Navigate to the server directory: `/path/to/newsletter/ygo_signup/`
3. Open the local `deploy/` folder on your computer
4. **Select all files and folders** inside `deploy/` (index.html, .htaccess, assets/, main.*.js, etc.)
5. **Drag and drop** them into the `/newsletter/ygo_signup/` directory on the server
6. The URL `http://card-app.kde-us.com/newsletter/ygo_signup/` should now work!

**Server Directory Path:**
```
/var/www/html/newsletter/ygo_signup/
```
or
```
/path/to/your/apache/document/root/newsletter/ygo_signup/
```

**Note:** The `deploy/` folder contains all files ready for deployment. All files are directly in `deploy/` (no subdirectories to navigate). Simply drag and drop everything from `deploy/` to your Apache server's `/newsletter/ygo_signup/` directory.

**Important:** The directory structure must match the base href path exactly.

### 2. Verify .htaccess file is present

Ensure the `.htaccess` file is in the `ygo_signup/` directory. This file handles Angular's client-side routing.

### 3. Apache Configuration

Make sure your Apache server has the following enabled:

```apache
# Enable mod_rewrite
LoadModule rewrite_module modules/mod_rewrite.so

# Allow .htaccess overrides
<Directory "/path/to/newsletter/ygo_signup/">
    AllowOverride All
    Require all granted
</Directory>
```

### 4. Set proper file permissions

```bash
# Set ownership (adjust user/group as needed)
chown -R apache:apache /path/to/newsletter/ygo_signup/

# Set directory permissions
find /path/to/newsletter/ygo_signup/ -type d -exec chmod 755 {} \;

# Set file permissions
find /path/to/newsletter/ygo_signup/ -type f -exec chmod 644 {} \;
```

## Backend API Configuration

The frontend expects the backend API to be available at:
```
https://card-app.kde-us.com/api/newsletter/signup
```

### Update Backend API URL

If your backend API is at a different location, update the `SendGridService` in:
```
Newsletter_Remake/newsletter-app/src/app/services/sendgrid.ts
```

Change the production URL in the `getApiUrl()` method:

```typescript
} else if (hostname === 'card-app.kde-us.com') {
  return 'https://your-actual-backend-url.com/api/newsletter/signup';
}
```

Then rebuild the application:
```bash
npm run build
```

## Verification

After deployment, verify the following:

1. **Main page loads**: Visit `http://card-app.kde-us.com/newsletter/ygo_signup/`
   - Should show the age gate page

2. **Routing works**: Navigate through the app
   - Age gate → Newsletter selection → Confirmation
   - All routes should work without 404 errors

3. **Assets load**: Check browser console for any 404 errors
   - Images should load correctly
   - CSS should be applied

4. **API calls work**: Test the signup form
   - Check browser Network tab for API requests
   - Verify requests go to the correct backend URL

## Troubleshooting

### 404 errors on routes

- Verify `.htaccess` file is present and readable
- Check Apache `AllowOverride` is set to `All`
- Verify `mod_rewrite` is enabled
- Check Apache error logs: `tail -f /var/log/apache2/error.log`

### Assets not loading (404 on images/CSS)

- Verify base href in `index.html` matches the deployment path
- Check file permissions on assets directory
- Ensure paths in HTML are relative (not absolute)

### API calls failing

- Verify backend API URL in `sendgrid.ts`
- Check CORS settings on backend server
- Verify backend API is accessible from the frontend domain
- Check browser console for CORS errors

### Blank page

- Check browser console for JavaScript errors
- Verify all JavaScript bundles are loading
- Check Apache error logs
- Verify base href matches the deployment path exactly

## File Structure

### Build Output Structure (deploy/ folder)
All files are directly in the `deploy/` folder - ready for drag-and-drop deployment:

```
Newsletter_Remake/newsletter-app/deploy/
├── index.html          ← Main HTML file
├── .htaccess          ← Apache routing configuration
├── main.*.js          ← Main JavaScript bundle
├── polyfills.*.js      ← Polyfills bundle
├── styles.*.css        ← CSS styles
├── ygocard.ico         ← Favicon
└── assets/            ← All images and static assets
    ├── img/
    │   ├── konami_logo.png
    │   └── ...
    └── ...
```

**Important:** All these files should be uploaded to your Apache server at `/newsletter/ygo_signup/`

### Apache Server Structure (after deployment)
```
/path/to/apache/document/root/
└── newsletter/
    └── ygo_signup/
        ├── index.html
        ├── .htaccess
        ├── main.*.js
        ├── polyfills.*.js
        ├── styles.*.css
        ├── ygocard.ico
        └── assets/
            ├── images/
            │   ├── konami_logo.png
            │   ├── dl_logo.png
            │   ├── md_logo.png
            │   └── tcg_logo.png
            └── ...
```

## Quick Deploy Script

You can create a deploy script to automate the process:

```bash
#!/bin/bash
# deploy.sh

cd Newsletter_Remake/newsletter-app
npm run build
rsync -avz --delete deploy/ user@server:/path/to/newsletter/ygo_signup/
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Notes

- The base href is set to `/newsletter/ygo_signup/` in both `index.html` and `angular.json`
- All routes are client-side, so Apache must redirect all requests to `index.html`
- The `.htaccess` file handles this redirection
- Production builds are optimized and minified for performance
- Source maps are not included in production builds

