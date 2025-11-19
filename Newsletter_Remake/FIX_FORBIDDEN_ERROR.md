# Fix "Forbidden" Error - Apache Permissions Guide

## Problem
When accessing `https://card-app.kde-us.com/newsletter/ygo_signup/`, you see:
```
Forbidden - You don't have permission to access this resource
```

## Solution: Fix File Permissions

This is almost always a **file permissions issue**. Apache needs proper read/execute permissions to serve files.

---

## Quick Fix (SSH/Terminal)

If you have SSH access to your server, run these commands:

### Step 1: Navigate to the directory

```bash
cd /var/www/html/newsletter/ygo_signup
# OR wherever your files are located
# Common paths: /var/www/html/, /home/user/public_html/, /usr/local/apache2/htdocs/
```

### Step 2: Set directory permissions (755)

```bash
# Set all directories to 755 (read, write, execute for owner; read and execute for others)
find . -type d -exec chmod 755 {} \;
```

### Step 3: Set file permissions (644)

```bash
# Set all files to 644 (read and write for owner; read for others)
find . -type f -exec chmod 644 {} \;
```

### Step 4: Set ownership (if needed)

```bash
# Set ownership to Apache user (adjust user/group as needed)
# Common Apache users: apache, www-data, httpd, _www
chown -R apache:apache .
# OR
chown -R www-data:www-data .
```

### Step 5: Verify .htaccess is readable

```bash
# Make sure .htaccess is readable
chmod 644 .htaccess
```

### Step 6: Test

Visit: `https://card-app.kde-us.com/newsletter/ygo_signup/`

---

## Alternative: Fix via WinSCP

If you don't have SSH access, you can fix permissions via WinSCP:

### Step 1: Connect to Server

1. Open WinSCP
2. Connect to your server

### Step 2: Navigate to Directory

Navigate to: `/var/www/html/newsletter/ygo_signup/` (or your actual path)

### Step 3: Set Permissions

1. **Right-click** on the `ygo_signup` folder
2. Select **Properties** (or **Change Attributes**)
3. Set permissions:
   - **Owner (User):** Read ✓, Write ✓, Execute ✓
   - **Group:** Read ✓, Execute ✓
   - **Others:** Read ✓, Execute ✓
   - This equals: **755** for directories
4. Check **"Recurse into subdirectories"**
5. Click **OK**

### Step 4: Set File Permissions

1. **Select all files** (Ctrl+A) inside `ygo_signup/`
2. **Right-click** → **Properties**
3. Set permissions:
   - **Owner (User):** Read ✓, Write ✓
   - **Group:** Read ✓
   - **Others:** Read ✓
   - This equals: **644** for files
4. Click **OK**

### Step 5: Verify .htaccess

1. Find `.htaccess` file
2. Right-click → **Properties**
3. Ensure it has **644** permissions (readable by Apache)

---

## Verify Apache Configuration

### Check if mod_rewrite is enabled

```bash
# Check if mod_rewrite is loaded
apache2ctl -M | grep rewrite
# OR
httpd -M | grep rewrite
```

If not enabled, enable it:
```bash
# Ubuntu/Debian
sudo a2enmod rewrite
sudo systemctl restart apache2

# CentOS/RHEL
sudo systemctl restart httpd
```

### Check AllowOverride setting

Your Apache configuration should allow `.htaccess` overrides:

```apache
<Directory "/var/www/html/newsletter/ygo_signup/">
    AllowOverride All
    Require all granted
</Directory>
```

**Location of Apache config:**
- Ubuntu/Debian: `/etc/apache2/sites-available/000-default.conf` or `/etc/apache2/apache2.conf`
- CentOS/RHEL: `/etc/httpd/conf/httpd.conf`

After editing, restart Apache:
```bash
# Ubuntu/Debian
sudo systemctl restart apache2

# CentOS/RHEL
sudo systemctl restart httpd
```

---

## Verify File Structure

Make sure your files are in the correct location:

```
/var/www/html/newsletter/ygo_signup/
  ├── index.html          ← Must exist!
  ├── .htaccess           ← Must exist!
  ├── main-*.js
  ├── polyfills-*.js
  ├── styles-*.css
  ├── assets/
  └── ygocard.ico
```

**Check if files exist:**
```bash
ls -la /var/www/html/newsletter/ygo_signup/
```

You should see:
- `index.html`
- `.htaccess`
- JavaScript files
- CSS files
- `assets/` directory

---

## Common Issues

### Issue 1: Files uploaded to wrong location

**Symptom:** 404 or Forbidden error

**Solution:**
- Verify files are in `/var/www/html/newsletter/ygo_signup/`
- Check Apache document root: `grep DocumentRoot /etc/apache2/sites-enabled/*`

### Issue 2: .htaccess file missing

**Symptom:** Routes don't work (404 on navigation)

**Solution:**
- Re-upload `.htaccess` file from `deploy/` folder
- Ensure it's named exactly `.htaccess` (with the dot at the beginning)

### Issue 3: SELinux blocking access (CentOS/RHEL)

**Symptom:** Permissions look correct but still Forbidden

**Solution:**
```bash
# Set SELinux context for web files
sudo chcon -R -t httpd_sys_content_t /var/www/html/newsletter/ygo_signup/
sudo chcon -R -t httpd_sys_rw_content_t /var/www/html/newsletter/ygo_signup/
```

### Issue 4: Parent directory permissions

**Symptom:** Can't access subdirectory even with correct permissions

**Solution:**
```bash
# Fix parent directories too
chmod 755 /var/www/html/newsletter/
chmod 755 /var/www/html/
```

---

## Complete Permission Fix Script

Run this complete script to fix everything at once:

```bash
#!/bin/bash
# Fix permissions for newsletter app

APP_DIR="/var/www/html/newsletter/ygo_signup"
APACHE_USER="apache"  # Change to: www-data, httpd, or _www as needed

# Navigate to directory
cd "$APP_DIR" || exit 1

# Set directory permissions (755)
find . -type d -exec chmod 755 {} \;

# Set file permissions (644)
find . -type f -exec chmod 644 {} \;

# Set ownership
chown -R $APACHE_USER:$APACHE_USER .

# Ensure .htaccess is readable
chmod 644 .htaccess

# Fix parent directories
chmod 755 /var/www/html/newsletter/
chmod 755 /var/www/html/

echo "✓ Permissions fixed!"
echo "✓ Test at: https://card-app.kde-us.com/newsletter/ygo_signup/"
```

**Save as `fix-permissions.sh` and run:**
```bash
chmod +x fix-permissions.sh
sudo ./fix-permissions.sh
```

---

## Test After Fixing

1. **Visit the URL:**
   ```
   https://card-app.kde-us.com/newsletter/ygo_signup/
   ```

2. **Check browser console** (F12):
   - Should see no 403/404 errors
   - JavaScript files should load
   - CSS should load

3. **Check Apache error logs:**
   ```bash
   tail -f /var/log/apache2/error.log
   # OR
   tail -f /var/log/httpd/error_log
   ```

---

## Still Not Working?

### Check Apache Error Logs

```bash
# View recent errors
sudo tail -50 /var/log/apache2/error.log
# OR
sudo tail -50 /var/log/httpd/error_log
```

Look for:
- Permission denied errors
- File not found errors
- Configuration errors

### Verify Apache User

Find out which user Apache runs as:

```bash
# Ubuntu/Debian
ps aux | grep apache2 | head -1

# CentOS/RHEL
ps aux | grep httpd | head -1
```

Then set ownership to match:
```bash
chown -R apache:apache /var/www/html/newsletter/ygo_signup/
# OR
chown -R www-data:www-data /var/www/html/newsletter/ygo_signup/
```

---

## Quick Checklist

- [ ] Files uploaded to correct directory
- [ ] `index.html` exists in `ygo_signup/` directory
- [ ] `.htaccess` file exists and is readable (644)
- [ ] Directory permissions are 755
- [ ] File permissions are 644
- [ ] Ownership is set to Apache user
- [ ] `mod_rewrite` is enabled
- [ ] `AllowOverride All` is set in Apache config
- [ ] Apache has been restarted after config changes

---

**After fixing permissions, the app should work!** 🎉

If you still have issues, check the Apache error logs for specific error messages.

