# Deployment Instructions for `/newsletter/ygo_signup/`

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build and package:**
   ```bash
   npm run package:ygo
   ```

3. **Upload to server:**
   - Open the `deploy/` folder on your computer
   - Drag and drop ALL files from `deploy/` to `/var/www/html/newsletter/ygo_signup/` on your server
   - Ensure `index.html` is directly inside `/var/www/html/newsletter/ygo_signup/`

4. **Visit:**
   ```
   https://card-app.kde-us.com/newsletter/ygo_signup/
   ```

---

## Detailed Steps

### Step 1: Install Dependencies

If you haven't already installed dependencies:

```bash
cd Newsletter_Remake/newsletter-app
npm install
```

This will install all required packages including `archiver` for the packaging script.

### Step 2: Build and Package

Run the build and packaging script:

```bash
npm run package:ygo
```

This command:
- Builds the Angular app with the `ygoProd` configuration
- Outputs to `dist/ygo-signup/`
- Copies all files to `deploy/` folder ready for deployment

**What the build includes:**
- `baseHref` set to `/newsletter/ygo_signup/`
- `deployUrl` set to `/newsletter/ygo_signup/`
- All assets properly configured for the subfolder path
- `.htaccess` file for Apache routing

### Step 3: Upload to Server

**Option A: Using WinSCP (Recommended)**

1. Open WinSCP and connect to `card-app.kde-us.com`
2. Navigate to `/var/www/html/newsletter/` on the server
3. Open the local `deploy/` folder on your computer
4. **Select all files and folders** inside `deploy/` (index.html, .htaccess, assets/, main.*.js, etc.)
5. **Drag and drop** them into `/var/www/html/newsletter/ygo_signup/` on the server
6. Verify the structure:
   ```
   /var/www/html/newsletter/ygo_signup/
     ├── index.html
     ├── .htaccess
     ├── main-*.js
     ├── polyfills-*.js
     ├── styles-*.css
     ├── assets/
     └── ygocard.ico
   ```

**Option B: Using SSH/SCP**

```bash
# Copy deploy folder to server
scp -r deploy/* user@card-app.kde-us.com:/var/www/html/newsletter/ygo_signup/

# OR using rsync
rsync -avz deploy/ user@card-app.kde-us.com:/var/www/html/newsletter/ygo_signup/
```

### Step 4: Set File Permissions

**Via SSH:**
```bash
cd /var/www/html/newsletter/ygo_signup
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chown -R apache:apache .
# OR if Apache runs as www-data:
# chown -R www-data:www-data .
```

**Via WinSCP:**
- Right-click `ygo_signup` folder → Properties
- Set directories to **755**
- Set files to **644**
- Check "Recurse into subdirectories"

### Step 5: Configure Apache

**IMPORTANT:** Your Apache configuration must allow `.htaccess` files to work:

```apache
Alias /newsletter/ygo_signup /var/www/html/newsletter/ygo_signup
<Directory /var/www/html/newsletter/ygo_signup>
    Options Indexes FollowSymLinks
    AllowOverride All    # ← Change from "None" to "All"
    Require all granted
</Directory>
```

**Why `AllowOverride All` is needed:**
- The `.htaccess` file handles Angular's client-side routing
- Without it, routes like `/home` will return 404 errors
- After changing, restart Apache: `sudo systemctl restart apache2` (or `httpd`)

### Step 6: Verify Deployment

1. **Visit the URL:**
   ```
   https://card-app.kde-us.com/newsletter/ygo_signup/
   ```

2. **Check browser console (F12):**
   - No 404 errors for JavaScript/CSS files
   - No CORS errors
   - Assets load correctly

3. **Test routing:**
   - Navigate through the app
   - All routes should work without 404 errors

---

## Build Configuration Details

### Angular Configuration (`angular.json`)

The `ygoProd` configuration includes:

```json
{
  "outputPath": "dist/ygo-signup",
  "baseHref": "/newsletter/ygo_signup/",
  "deployUrl": "/newsletter/ygo_signup/",
  "optimization": true,
  "outputHashing": "all"
}
```

### Asset Paths

All assets are configured to work with the subfolder path:
- Images: `assets/img/...` (relative paths)
- CSS/JS: Automatically prefixed with `/newsletter/ygo_signup/`
- Favicon: `ygocard.ico` (in root of build output)

---

## Troubleshooting

### Issue: "Forbidden" Error

**Solution:** Fix file permissions (see Step 4 above)

### Issue: Routes return 404

**Solution:** 
- Verify `.htaccess` file exists in `/var/www/html/newsletter/ygo_signup/`
- Change `AllowOverride None` to `AllowOverride All` in Apache config
- Restart Apache

### Issue: Assets not loading

**Solution:**
- Verify `baseHref` in `index.html` is `/newsletter/ygo_signup/`
- Check browser console for 404 errors
- Verify file permissions on `assets/` directory

### Issue: Build fails

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Check that `archiver` is installed: `npm list archiver`
- If missing: `npm install archiver --save-dev`

---

## File Structure

### Build Output (`dist/ygo-signup/`):
```
dist/ygo-signup/
  ├── index.html          (with <base href="/newsletter/ygo_signup/">)
  ├── .htaccess
  ├── main-*.js
  ├── polyfills-*.js
  ├── styles-*.css
  ├── assets/
  │   └── img/
  │       ├── konami_logo.png
  │       └── ...
  └── ygocard.ico
```

### Server Structure (`/var/www/html/newsletter/ygo_signup/`):
```
/var/www/html/newsletter/ygo_signup/
  ├── index.html
  ├── .htaccess
  ├── main-*.js
  ├── polyfills-*.js
  ├── styles-*.css
  ├── assets/
  └── ygocard.ico
```

---

## NPM Scripts Reference

- `npm run build:ygo` - Build only (outputs to `dist/ygo-signup/`)
- `npm run package:ygo` - Build and create zip package

---

## Summary

**Complete deployment workflow:**

```bash
# 1. Install dependencies
npm install

# 2. Build and package
npm run package:ygo

# 3. Upload ygo_signup_package.zip to server
# 4. Extract to /var/www/html/newsletter/ygo_signup/
# 5. Set permissions (755 for dirs, 644 for files)
# 6. Update Apache config (AllowOverride All)
# 7. Restart Apache
# 8. Visit: https://card-app.kde-us.com/newsletter/ygo_signup/
```

---

**Last Updated:** 2025-11-19

