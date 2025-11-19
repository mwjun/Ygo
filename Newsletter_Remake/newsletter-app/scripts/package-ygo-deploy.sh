#!/bin/bash
# PACKAGE-YGO-DEPLOY.SH
#
# Bash script to package the Angular build output for deployment to IP server.
#
# This script:
# 1. Cleans any previous deploy folder
# 2. Copies all files from dist/ygo-signup/ to deploy/
# 3. Ensures all files are ready for drag-and-drop deployment to Apache server
#
# USAGE:
#   bash scripts/package-ygo-deploy.sh
#
# Or via npm:
#   npm run package:ygo-ip
#
# REQUIREMENTS:
#   - bash (available on macOS, Linux, WSL)
#   - cp command (standard on Unix-like systems)
#
# Run: chmod +x scripts/package-ygo-deploy.sh

set -e  # Exit on error

# Configuration
BUILD_DIR="dist/ygo-signup"
DEPLOY_DIR="deploy"

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Angular may output to dist/ygo-signup/browser/ or directly to dist/ygo-signup/
# Check which structure exists
ACTUAL_BUILD_DIR="$BUILD_DIR"
BROWSER_SUBDIR="$BUILD_DIR/browser"

if [ -d "$BROWSER_SUBDIR" ]; then
  # Angular output is in dist/ygo-signup/browser/
  ACTUAL_BUILD_DIR="$BROWSER_SUBDIR"
  echo "📁 Found build output in $BROWSER_SUBDIR/"
elif [ -d "$BUILD_DIR" ]; then
  # Angular output is directly in dist/ygo-signup/
  ACTUAL_BUILD_DIR="$BUILD_DIR"
  echo "📁 Found build output in $BUILD_DIR/"
else
  echo "❌ Error: $BUILD_DIR directory not found!"
  echo "   Please run 'npm run build:ygo-ip' first."
  exit 1
fi

# Remove previous deploy folder if it exists
if [ -d "$DEPLOY_DIR" ]; then
  echo "🗑️  Removing previous deploy folder..."
  rm -rf "$DEPLOY_DIR"
fi

# Create deploy directory
echo "📦 Copying files to deploy folder..."
mkdir -p "$DEPLOY_DIR"

# Copy all files from build output to deploy folder
cp -r "$ACTUAL_BUILD_DIR"/* "$DEPLOY_DIR/"

# Also ensure .htaccess is included if it exists in the dist base directory
if [ -f "$BUILD_DIR/.htaccess" ] && [ "$ACTUAL_BUILD_DIR" = "$BROWSER_SUBDIR" ]; then
  echo "📄 Copying .htaccess file from dist base"
  cp "$BUILD_DIR/.htaccess" "$DEPLOY_DIR/.htaccess"
elif [ -f "$ACTUAL_BUILD_DIR/.htaccess" ]; then
  echo "📄 .htaccess file included in deploy folder"
fi

echo ""
echo "✅ Files ready in deploy/ folder for deployment!"
echo "   Location: $PROJECT_ROOT/$DEPLOY_DIR"
echo ""
echo "📤 Next steps:"
echo "   1. Drag and drop all files from deploy/ to your Apache server"
echo "   2. Upload to /var/www/html/NEWSLETTER/ygo_signup/"
echo "   3. Set permissions (755 for dirs, 644 for files)"
echo "   4. Visit: http://54.183.163.113/NEWSLETTER/ygo_signup/"

