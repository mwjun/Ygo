<?php

/**
 * Router script for PHP built-in server
 * Routes requests to public_html directory
 * Includes error suppression for PHP 8.3 compatibility
 */

// Suppress PHP 8.3 compatibility warnings/errors for Laravel 5.4
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Custom error handler to suppress specific PHP 8.3 compatibility errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // Suppress ArrayAccess return type compatibility warnings
    if (strpos($errstr, 'ArrayAccess::offsetExists') !== false) {
        return true;
    }
    // Suppress ReflectionParameter::getClass() deprecated warnings
    if (strpos($errstr, 'ReflectionParameter::getClass()') !== false) {
        return true;
    }
    // Suppress return type compatibility warnings
    if (strpos($errstr, 'should either be compatible with') !== false) {
        return true;
    }
    return false; // Let other errors through
}, E_ALL);

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// Serve static files directly from public_html
$filePath = __DIR__.'/public_html'.$uri;
if ($uri !== '/' && file_exists($filePath) && is_file($filePath)) {
    // Determine MIME type
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'ico' => 'image/x-icon',
        'svg' => 'image/svg+xml',
        'json' => 'application/json',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject'
    ];
    
    $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
    header('Content-Type: '.$mimeType);
    readfile($filePath);
    return true;
}

// Route all other requests to Laravel's compatibility index.php
require_once __DIR__.'/public_html/index-compat.php';

