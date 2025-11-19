# Quick Deployment Guide

## ✅ Everything is Ready!

All files are packaged into the `deploy` folder, ready for drag-and-drop deployment.

## 🚀 Deploy in 3 Steps

### Step 1: Build and Package
```bash
cd Newsletter_Remake/newsletter-app
npm install          # (if you haven't already)
npm run package:ygo
```

This will:
- Build the Angular app with correct baseHref (`/newsletter/ygo_signup/`)
- Copy all files to `deploy/` folder

### Step 2: Upload to Server

**Using WinSCP:**
1. Connect to `card-app.kde-us.com`
2. Navigate to `/var/www/html/newsletter/` on the server
3. Open the local `deploy/` folder on your computer
4. **Drag and drop ALL files** from `deploy/` to `/var/www/html/newsletter/ygo_signup/` on the server
5. Verify structure:
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

### Step 3: Set Permissions & Configure Apache

**Set File Permissions (via SSH or WinSCP):**
- Directories: **755**
- Files: **644**

**Update Apache Config:**
```apache
Alias /newsletter/ygo_signup /var/www/html/newsletter/ygo_signup
<Directory /var/www/html/newsletter/ygo_signup>
    Options Indexes FollowSymLinks
    AllowOverride All    # ← Must be "All" (not "None")
    Require all granted
</Directory>
```

**Restart Apache:**
```bash
sudo systemctl restart apache2
# OR
sudo systemctl restart httpd
```

### Step 4: Test
Visit: `https://card-app.kde-us.com/newsletter/ygo_signup/`

---

## 📋 What Changed

✅ **Removed:**
- Old `deploy` folder setup
- `copy-deploy.js` script
- References to `deploy` in build process

✅ **New Setup:**
- Build outputs to `dist/ygo-signup/`
- Packaging script creates `ygo_signup_package.zip`
- All files ready for Apache deployment

---

## 🔧 Build Configuration

- **Output Path:** `dist/ygo-signup`
- **Base Href:** `/newsletter/ygo_signup/`
- **Deploy URL:** `/newsletter/ygo_signup/`
- **All assets:** Properly configured for subfolder deployment

---

## ⚠️ Important Notes

1. **Apache `AllowOverride`:** Must be set to `All` (not `None`) for `.htaccess` to work
2. **File Permissions:** Directories need 755, files need 644
3. **Extract Location:** Extract zip so `index.html` is directly in `/var/www/html/newsletter/ygo_signup/`

---

**That's it! Your app is ready for deployment.** 🎉

