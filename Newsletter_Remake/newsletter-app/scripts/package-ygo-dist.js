/**
 * PACKAGE-YGO-DIST.JS
 * 
 * Cross-platform Node.js script to package the Angular build output for deployment.
 * 
 * This script:
 * 1. Cleans any previous zip file (ygo_signup_package.zip)
 * 2. Zips the contents of dist/ygo-signup/ into ygo_signup_package.zip
 * 3. Ensures the zip file's top-level contains the built files directly (not the dist/ygo-signup folder)
 * 
 * USAGE:
 *   node scripts/package-ygo-dist.js
 * 
 * Or via npm:
 *   npm run package:ygo
 * 
 * REQUIREMENTS:
 *   - Node.js (built-in fs and path modules)
 *   - archiver package: npm install archiver --save-dev
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Configuration
const DIST_BASE = path.join(__dirname, '..', 'dist', 'ygo-signup');
const ZIP_FILE = path.join(__dirname, '..', 'ygo_signup_package.zip');

// Angular may output to dist/ygo-signup/browser/ or directly to dist/ygo-signup/
// Check which structure exists
let DIST_DIR = DIST_BASE;
const browserSubdir = path.join(DIST_BASE, 'browser');

if (fs.existsSync(browserSubdir)) {
  // Angular output is in dist/ygo-signup/browser/
  DIST_DIR = browserSubdir;
  console.log('📁 Found build output in dist/ygo-signup/browser/');
} else if (fs.existsSync(DIST_BASE)) {
  // Angular output is directly in dist/ygo-signup/
  DIST_DIR = DIST_BASE;
  console.log('📁 Found build output in dist/ygo-signup/');
} else {
  console.error('❌ Error: dist/ygo-signup directory not found!');
  console.error('   Please run "npm run build:ygo" first.');
  process.exit(1);
}

// Remove previous zip file if it exists
if (fs.existsSync(ZIP_FILE)) {
  console.log('🗑️  Removing previous zip file...');
  fs.unlinkSync(ZIP_FILE);
}

// Create zip file
console.log('📦 Creating zip package...');
const output = fs.createWriteStream(ZIP_FILE);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Handle archive events
output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Package created successfully!`);
  console.log(`   File: ${path.basename(ZIP_FILE)}`);
  console.log(`   Size: ${sizeInMB} MB`);
  console.log(`   Location: ${ZIP_FILE}`);
  console.log('');
  console.log('📤 Next steps:');
  console.log('   1. Upload ygo_signup_package.zip to your server');
  console.log('   2. Extract it to /var/www/html/newsletter/ygo_signup/');
  console.log('   3. Visit: https://card-app.kde-us.com/newsletter/ygo_signup/');
});

archive.on('error', (err) => {
  console.error('❌ Error creating zip:', err);
  process.exit(1);
});

// Pipe archive data to the file
archive.pipe(output);

// Add all files from the build output directory to the zip
// The false parameter ensures files are added directly to the root of the zip (not in a subfolder)
archive.directory(DIST_DIR, false);

// Also ensure .htaccess is included if it exists in the dist base directory
const htaccessInBase = path.join(DIST_BASE, '.htaccess');
const htaccessInBrowser = path.join(browserSubdir, '.htaccess');
if (fs.existsSync(htaccessInBase) && DIST_DIR === browserSubdir) {
  // If .htaccess is in the base but we're zipping from browser/, add it separately
  archive.file(htaccessInBase, { name: '.htaccess' });
  console.log('📄 Including .htaccess file from dist base');
} else if (fs.existsSync(htaccessInBrowser) && DIST_DIR === browserSubdir) {
  // .htaccess should already be included via directory() call above
  console.log('📄 .htaccess file found in build output');
}

// Finalize the archive
archive.finalize();

