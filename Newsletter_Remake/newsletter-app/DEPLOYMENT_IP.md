# Deployment Instructions for IP Server

## Target Deployment

- **URL:** `http://54.183.163.113/newsletter/ygo_signup/`
- **Server Path:** `/var/www/html/newsletter/ygo_signup`

## Step-by-Step Deployment

### 1) Install dependencies:
```bash
npm install
```

### 2) Build and package for the IP server:
```bash
npm run package:ygo-ip
```

### 3) This creates:
```
deploy/
```
folder in the project root with all deployment files.

### 4) Upload all files from `deploy/` folder to the server:
```
/var/www/html/newsletter/ygo_signup
```

**Using WinSCP or similar:**
- Open the local `deploy/` folder
- Drag and drop all files to `/var/www/html/newsletter/ygo_signup/` on the server

After uploading, `/var/www/html/newsletter/ygo_signup` should contain:
- `index.html`
- `main-*.js`
- `polyfills-*.js`
- `styles-*.css`
- `assets/...`

### 5) Visit the app in the browser at:
```
http://54.183.163.113/newsletter/ygo_signup/
```

---

## Notes

- The build output is in `dist/ygo-signup/` (or `dist/ygo-signup/browser/` if Angular creates a subdirectory)
- All files are copied to the `deploy/` folder, ready for drag-and-drop deployment
- All asset paths are configured to work with the `/newsletter/ygo_signup/` base path
- The `index.html` will have `<base href="/newsletter/ygo_signup/">` set correctly
- After uploading, set file permissions: directories 755, files 644

