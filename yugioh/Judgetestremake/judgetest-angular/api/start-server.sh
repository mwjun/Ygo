#!/bin/bash
# Start PHP Development Server
# Usage: ./start-server.sh

# Use full path to PHP
PHP_PATH="/opt/homebrew/bin/php"

echo "🚀 Starting PHP Development Server..."
echo "📍 Server will run at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start server
cd "$(dirname "$0")"
$PHP_PATH -S localhost:8000

