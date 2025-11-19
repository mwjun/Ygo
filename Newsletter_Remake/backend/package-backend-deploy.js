/**
 * PACKAGE-BACKEND-DEPLOY.JS
 * 
 * Cross-platform Node.js script to package the backend for deployment.
 * 
 * This script:
 * 1. Cleans any previous backenddeploy folder
 * 2. Copies all necessary backend files to backenddeploy/
 * 3. Excludes sensitive files (.env, node_modules, logs)
 * 4. Includes .env.example as a template
 * 
 * USAGE:
 *   node package-backend-deploy.js
 * 
 * REQUIREMENTS:
 *   - Node.js (built-in fs and path modules)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_DIR = __dirname;
const DEPLOY_DIR = path.join(BACKEND_DIR, 'backenddeploy');

// Files and directories to include
const FILES_TO_INCLUDE = [
  'server.js',
  'package.json',
  'README.md',
  'SETUP_ENV.md',
  'TROUBLESHOOTING.md',
  '.gitignore',
  '.env.example'
];

const DIRS_TO_INCLUDE = [
  'models'
];

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.env',           // Actual .env with secrets (use .env.example instead)
  '*.log',
  'package-lock.json',  // Can be regenerated with npm install
  'backenddeploy'   // Don't copy the deploy folder into itself
];

console.log('📦 Packaging backend for deployment...');

// Remove previous deploy folder if it exists
if (fs.existsSync(DEPLOY_DIR)) {
  console.log('🗑️  Removing previous backenddeploy folder...');
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}

// Create deploy directory
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// Function to check if a path should be excluded
function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(BACKEND_DIR, filePath);
  
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      // Simple glob pattern matching
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(fileName) || regex.test(relativePath)) {
        return true;
      }
    } else {
      if (fileName === pattern || relativePath === pattern || relativePath.startsWith(pattern + path.sep)) {
        return true;
      }
    }
  }
  return false;
}

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (shouldExclude(srcPath)) {
      continue; // Skip excluded files/directories
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy individual files
console.log('📄 Copying files...');
for (const file of FILES_TO_INCLUDE) {
  const srcPath = path.join(BACKEND_DIR, file);
  const destPath = path.join(DEPLOY_DIR, file);
  
  if (fs.existsSync(srcPath)) {
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`   ✓ ${file}`);
    }
  } else {
    console.log(`   ⚠️  ${file} not found (skipping)`);
  }
}

// Copy directories
console.log('📁 Copying directories...');
for (const dir of DIRS_TO_INCLUDE) {
  const srcPath = path.join(BACKEND_DIR, dir);
  const destPath = path.join(DEPLOY_DIR, dir);
  
  if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
    copyDirectory(srcPath, destPath);
    console.log(`   ✓ ${dir}/`);
  } else {
    console.log(`   ⚠️  ${dir}/ not found (skipping)`);
  }
}

// Create .env.example if it doesn't exist
const envExamplePath = path.join(DEPLOY_DIR, '.env.example');
if (!fs.existsSync(envExamplePath)) {
  const envExampleContent = `# Backend Environment Variables
# Copy this file to .env and fill in your actual values
# DO NOT commit .env to git

# Server Configuration
NODE_ENV=production
PORT=3001

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_email@example.com

# Frontend URL (for email verification links)
# Production: Use your production URL
# Example: http://54.183.163.113/newsletter/ygo_signup
FRONTEND_URL=http://54.183.163.113/newsletter/ygo_signup

# CORS Allowed Origins (comma-separated)
# Add all domains/IPs that will access the API
ALLOWED_ORIGINS=http://54.183.163.113,http://localhost:4200

# reCAPTCHA Secret Key (from Google reCAPTCHA admin)
# Get your keys from: https://www.google.com/recaptcha/admin
# Your Secret Key: 6LfzfxEsAAAAALEfwOTc2jaZvBv4V5pR_gsExRpw
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
`;
  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('   ✓ .env.example (created)');
}

// Create a deployment README
const deployReadme = `# Backend Deployment Package

## Contents

This package contains everything needed to deploy the newsletter backend API.

## Files Included

- \`server.js\` - Main Express.js server
- \`package.json\` - Node.js dependencies
- \`models/\` - Database models
- \`.env.example\` - Environment variables template
- Documentation files

## Deployment Steps

### 1. Upload Files

Upload all files in this folder to your server (e.g., \`/var/www/backend/\` or \`/opt/newsletter-backend/\`).

### 2. Install Dependencies

\`\`\`bash
cd /path/to/backend
npm install --production
\`\`\`

### 3. Configure Environment

\`\`\`bash
cp .env.example .env
nano .env  # Edit with your actual values
\`\`\`

**Required environment variables:**
- \`SENDGRID_API_KEY\` - Your SendGrid API key
- \`SENDGRID_FROM_EMAIL\` - Verified sender email
- \`FRONTEND_URL\` - Frontend application URL
- \`RECAPTCHA_SECRET_KEY\` - reCAPTCHA Secret Key
- \`ALLOWED_ORIGINS\` - CORS allowed origins (comma-separated)

### 4. Start the Server

\`\`\`bash
npm start
\`\`\`

Or use a process manager like PM2:

\`\`\`bash
npm install -g pm2
pm2 start server.js --name newsletter-backend
pm2 save
pm2 startup
\`\`\`

### 5. Verify

Check that the server is running:
\`\`\`bash
curl http://localhost:3001/api/health
\`\`\`

## Security Notes

- **Never commit \`.env\` file** - It contains sensitive keys
- Keep \`.env\` file permissions restricted: \`chmod 600 .env\`
- Use a process manager (PM2) for production
- Set up firewall rules to only allow necessary ports
- Use HTTPS in production (set up reverse proxy with nginx/Apache)

## Port Configuration

Default port is \`3001\`. Change in \`.env\`:
\`\`\`
PORT=3001
\`\`\`

## Process Manager (PM2) Setup

For production, use PM2 to keep the server running:

\`\`\`bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name newsletter-backend

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions it provides
\`\`\`

## Monitoring

\`\`\`bash
# View logs
pm2 logs newsletter-backend

# View status
pm2 status

# Restart
pm2 restart newsletter-backend

# Stop
pm2 stop newsletter-backend
\`\`\`

## Troubleshooting

See \`TROUBLESHOOTING.md\` for common issues and solutions.

---

**Package Created:** ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'DEPLOYMENT.md'), deployReadme);

console.log('');
console.log('✅ Backend deployment package created successfully!');
console.log(`   Location: ${DEPLOY_DIR}`);
console.log('');
console.log('📋 Package contents:');
const files = fs.readdirSync(DEPLOY_DIR, { withFileTypes: true });
for (const file of files) {
  const icon = file.isDirectory() ? '📁' : '📄';
  console.log(`   ${icon} ${file.name}${file.isDirectory() ? '/' : ''}`);
}
console.log('');
console.log('📤 Next steps:');
console.log('   1. Upload all files from backenddeploy/ to your server');
console.log('   2. Run: npm install --production');
console.log('   3. Copy .env.example to .env and configure it');
console.log('   4. Start server: npm start (or use PM2)');
console.log('   5. See DEPLOYMENT.md for detailed instructions');

