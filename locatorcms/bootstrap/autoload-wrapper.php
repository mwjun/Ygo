<?php

define('LARAVEL_START', microtime(true));

// Suppress all error reporting initially
error_reporting(0);
ini_set('display_errors', '0');

// Custom autoloader wrapper that suppresses PHP 8.3 compatibility errors
spl_autoload_register(function ($class) {
    // First try to load via Composer
    static $composerAutoloader = null;
    if ($composerAutoloader === null) {
        // Load Composer autoloader with error suppression
        $autoloadFile = __DIR__.'/../vendor/autoload.php';
        if (file_exists($autoloadFile)) {
            // Use output buffering and error suppression
            ob_start();
            $oldErrorReporting = error_reporting(0);
            include $autoloadFile;
            error_reporting($oldErrorReporting);
            ob_end_clean();
            $composerAutoloader = true;
        }
    }
    
    // Let Composer handle the class loading
    return false; // Let other autoloaders try
}, true, true);

// Now load Composer's autoloader
require __DIR__.'/../vendor/autoload.php';

