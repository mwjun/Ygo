<?php
declare(strict_types=1);

/**
 * Security Headers Module
 * Single Responsibility: Set HTTP security headers
 * Highly Cohesive: All related to security headers
 * Loosely Coupled: No dependencies on other modules
 */

class SecurityHeaders {
    
    /**
     * Set security headers for API responses
     */
    public static function set(): void {
        // Prevent clickjacking
        header('X-Frame-Options: DENY');
        
        // Prevent MIME sniffing
        header('X-Content-Type-Options: nosniff');
        
        // Enable XSS filtering
        header('X-XSS-Protection: 1; mode=block');
        
        // Content Security Policy
        header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
        
        // Referrer policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // CORS for Angular app (adjust domain as needed)
        header('Access-Control-Allow-Origin: http://localhost:4200');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        
        // Only set HSTS in production with HTTPS
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }
        
        // Remove server identification
        header_remove('X-Powered-By');
    }
    
    /**
     * Set JSON response headers
     */
    public static function setJson(): void {
        header('Content-Type: application/json; charset=utf-8');
        self::set();
    }
}

