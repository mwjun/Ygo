/**
 * PACKAGE-YGO-DEPLOY.JS
 * 
 * Cross-platform Node.js script to package the Angular build output for deployment to IP server.
 * 
 * This script:
 * 1. Cleans any previous deploy folder
 * 2. Copies all files from dist/ygo-signup/ to deploy/
 * 3. Ensures all files are ready for drag-and-drop deployment to Apache server
 * 
 * USAGE:
 *   node scripts/package-ygo-deploy.js
 * 
 * Or via npm:
 *   npm run package:ygo-ip
 * 
 * REQUIREMENTS:
 *   - Node.js (built-in fs and path modules)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = path.join(__dirname, '..', 'dist', 'ygo-signup');
const DEPLOY_DIR = path.join(__dirname, '..', 'deploy');

// Angular may output to dist/ygo-signup/browser/ or directly to dist/ygo-signup/
// Check which structure exists
let ACTUAL_BUILD_DIR = BUILD_DIR;
const browserSubdir = path.join(BUILD_DIR, 'browser');

if (fs.existsSync(browserSubdir)) {
  // Angular output is in dist/ygo-signup/browser/
  ACTUAL_BUILD_DIR = browserSubdir;
  console.log('📁 Found build output in dist/ygo-signup/browser/');
} else if (fs.existsSync(BUILD_DIR)) {
  // Angular output is directly in dist/ygo-signup/
  ACTUAL_BUILD_DIR = BUILD_DIR;
  console.log('📁 Found build output in dist/ygo-signup/');
} else {
  console.error('❌ Error: dist/ygo-signup directory not found!');
  console.error('   Please run "npm run build:ygo-ip" first.');
  process.exit(1);
}

// Remove previous deploy folder if it exists
if (fs.existsSync(DEPLOY_DIR)) {
  console.log('🗑️  Removing previous deploy folder...');
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}

// Create deploy directory
console.log('📦 Copying files to deploy folder...');
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy all files from build output to deploy folder
copyDirectory(ACTUAL_BUILD_DIR, DEPLOY_DIR);

// Also ensure .htaccess is included if it exists in the dist base directory
const htaccessInBase = path.join(BUILD_DIR, '.htaccess');
const htaccessInDeploy = path.join(DEPLOY_DIR, '.htaccess');
if (fs.existsSync(htaccessInBase) && ACTUAL_BUILD_DIR === browserSubdir) {
  // If .htaccess is in the base but we copied from browser/, copy it separately
  fs.copyFileSync(htaccessInBase, htaccessInDeploy);
  console.log('📄 Copied .htaccess file from dist base');
} else if (fs.existsSync(path.join(browserSubdir, '.htaccess')) && ACTUAL_BUILD_DIR === browserSubdir) {
  // .htaccess should already be copied via copyDirectory above
  console.log('📄 .htaccess file included in deploy folder');
}

console.log('');
console.log('✅ Files ready in deploy/ folder for deployment!');
console.log(`   Location: ${DEPLOY_DIR}`);
console.log('');
console.log('📤 Next steps:');
console.log('   1. Drag and drop all files from deploy/ to your Apache server');
console.log('   2. Upload to /var/www/html/newsletter/ygo_signup/');
console.log('   3. Set permissions (755 for dirs, 644 for files)');
console.log('   4. Visit: http://54.183.163.113/newsletter/ygo_signup/');

