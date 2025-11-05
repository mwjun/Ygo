<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 * Compatibility wrapper for PHP 8.3
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

// Suppress PHP 8.3 compatibility errors
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Custom error handler to catch and suppress compatibility errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (strpos($errstr, 'ArrayAccess::offsetExists') !== false ||
        strpos($errstr, 'ReflectionParameter::getClass()') !== false ||
        strpos($errstr, 'should either be compatible with') !== false ||
        strpos($errstr, 'Return type of') !== false) {
        return true; // Suppress
    }
    return false;
}, E_ALL | E_STRICT);

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our application. We just need to utilize it! We'll simply require it
| into the script here so that we don't have to worry about manual
| loading any of our classes later on. It feels nice to relax.
|
*/

// Use custom autoload wrapper that handles PHP 8.3 compatibility
require __DIR__.'/../bootstrap/autoload-wrapper.php';

/*
|--------------------------------------------------------------------------
| Turn On The Lights
|--------------------------------------------------------------------------
|
| We need to illuminate PHP development, so let us turn on the lights.
| This bootstraps the framework and gets it ready for use, then it
| will load up this application so that we can run it and send
| the responses back to the browser and delight our users.
|
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request
| through the kernel, and send the associated response back to
| the client's browser allowing them to enjoy the creative
| and wonderful application we have prepared for them.
|
*/

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);

