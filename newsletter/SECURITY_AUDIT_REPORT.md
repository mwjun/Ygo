# Security Audit Report - Newsletter Application
**Date:** November 2025  
**Auditor:** Security Team  
**Application:** Yu-Gi-Oh! Newsletter Signup System  
**Severity Scale:** CRITICAL | HIGH | MEDIUM | LOW | INFO

---

## Executive Summary

This security audit identified **15 vulnerabilities** across multiple security categories. The application has several critical security flaws that could compromise user data, allow bypass of age verification, and enable various attack vectors. Immediate remediation is required before production deployment.

**Risk Summary:**
- **CRITICAL:** 2 vulnerabilities
- **HIGH:** 5 vulnerabilities  
- **MEDIUM:** 6 vulnerabilities
- **LOW:** 2 vulnerabilities

---

## CRITICAL VULNERABILITIES

### CVE-001: Broken Session Validation (CRITICAL)

**Location:** `{newsletter}/agegate.php` (lines 16-17, 227, 231)  
**Risk Level:** **CRITICAL**  
**CVSS Score:** 9.1 (Critical)

**Finding:**
```php
$sesh = preg_replace("/[^0-9?!]/",'',$_REQUEST['sesh']);
if ($sesh != session_id()) header('HTTP/1.0 404 Not Found');
```

**Issues:**
1. `session_start()` is commented out, so `session_id()` returns an empty string
2. Session validation check can be bypassed by submitting empty string
3. `$_REQUEST` includes GET, POST, and COOKIE data - vulnerable to parameter pollution
4. No `exit` after header redirect - code continues executing

**Impact:**
- Age verification can be completely bypassed
- Attackers can set `legal=yes` cookie without proper validation
- CSRF protection is ineffective
- Allows unauthorized access to signup forms

**Exploitation:**
```bash
# Bypass age verification
curl -X POST "http://localhost:8001/newsletter/dl_signup/agegate.php" \
  -d "checkage=1&month=1&day=1&year=2010&sesh="
```

**Solution:**
```php
<?php
// Start session BEFORE any output
session_start();

if(isset($_POST['checkage'])) {
    // Use POST only, not $_REQUEST
    $sesh = isset($_POST['sesh']) ? preg_replace("/[^0-9a-zA-Z]/", '', $_POST['sesh']) : '';
    
    // Validate session token
    if(empty($sesh) || $sesh !== session_id()) {
        http_response_code(403);
        die('Invalid request');
    }
    
    // Validate date inputs
    $day = isset($_POST['day']) && ctype_digit($_POST['day']) ? (int)$_POST['day'] : 0;
    $month = isset($_POST['month']) && ctype_digit($_POST['month']) ? (int)$_POST['month'] : 0;
    $year = isset($_POST['year']) && ctype_digit($_POST['year']) ? (int)$_POST['year'] : 0;
    
    // Validate date range
    if($day < 1 || $day > 31 || $month < 1 || $month > 12 || $year < 1900 || $year > date('Y')) {
        http_response_code(400);
        die('Invalid date');
    }
    
    // Check for valid date (e.g., Feb 30 doesn't exist)
    if(!checkdate($month, $day, $year)) {
        http_response_code(400);
        die('Invalid date');
    }
    
    $birthstamp = mktime(0, 0, 0, $month, $day, $year);
    $diff = time() - $birthstamp;
    $age_years = floor($diff / 31556926);
    
    if($age_years >= 16) {
        setcookie('legal', 'yes', [
            'expires' => time() + 7200,
            'path' => '/newsletter/',
            'domain' => '',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        header('Location: index.php');
        exit; // CRITICAL: Must exit after redirect
    } else {
        setcookie('legal', 'no', [
            'expires' => time() + 7200,
            'path' => '/newsletter/',
            'domain' => '',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        header('Location: redirect.php');
        exit; // CRITICAL: Must exit after redirect
    }
}
?>
```

---

### CVE-002: Insecure Cookie Configuration (CRITICAL)

**Location:** All `agegate.php` files (lines 28, 33)  
**Risk Level:** **CRITICAL**  
**CVSS Score:** 8.8 (High)

**Finding:**
```php
setcookie('legal', 'yes', time()+7200, '/');
```

**Issues:**
1. Missing `HttpOnly` flag - cookies accessible via JavaScript (XSS risk)
2. Missing `Secure` flag - cookies transmitted over HTTP (MITM risk)
3. Missing `SameSite` attribute - vulnerable to CSRF attacks
4. Cookie path set to `/` (entire domain) - scope too broad
5. No domain restriction

**Impact:**
- Cookies can be stolen via XSS attacks
- Cookies transmitted in plaintext over HTTP
- Vulnerable to CSRF attacks
- Cookies accessible to all subdomains

**Exploitation:**
```javascript
// XSS attack - steal cookie
<script>
document.cookie = 'legal=yes; path=/';
// Or steal existing cookie
alert(document.cookie);
</script>
```

**Solution:**
```php
// Use modern setcookie with array syntax
setcookie('legal', 'yes', [
    'expires' => time() + 7200,
    'path' => '/newsletter/',  // Restrict to newsletter path
    'domain' => '',  // Only current domain
    'secure' => true,  // HTTPS only
    'httponly' => true,  // Not accessible via JavaScript
    'samesite' => 'Strict'  // CSRF protection
]);
```

**Note:** For development (HTTP), temporarily set `secure => false`, but ensure HTTPS in production.

---

## HIGH VULNERABILITIES

### CVE-003: Cross-Site Request Forgery (CSRF)

**Location:** All `agegate.php` files  
**Risk Level:** **HIGH**  
**CVSS Score:** 7.5 (High)

**Finding:**
- No CSRF token validation
- Form accepts POST requests without origin verification
- Session-based CSRF protection is broken (session not started)

**Impact:**
- Attackers can force users to submit age verification forms
- Malicious sites can set cookies on victim's browser
- Can bypass age restrictions via CSRF

**Exploitation:**
```html
<!-- Malicious website -->
<form action="https://victim-site.com/newsletter/dl_signup/agegate.php" method="POST">
    <input type="hidden" name="checkage" value="1">
    <input type="hidden" name="month" value="1">
    <input type="hidden" name="day" value="1">
    <input type="hidden" name="year" value="2000">
    <input type="hidden" name="sesh" value="">
</form>
<script>document.forms[0].submit();</script>
```

**Solution:**
```php
<?php
session_start();

// Generate CSRF token
if(empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// In form:
echo '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') . '">';

// On form submission:
if(isset($_POST['checkage'])) {
    if(!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        die('CSRF token validation failed');
    }
    // Continue processing...
}
?>
```

---

### CVE-004: Insufficient Input Validation

**Location:** All `agegate.php` files (lines 18-20)  
**Risk Level:** **HIGH**  
**CVSS Score:** 7.2 (High)

**Finding:**
```php
$day = ctype_digit($_POST['day']) ? $_POST['day'] : '';
$month = ctype_digit($_POST['month']) ? $_POST['month'] : '';
$year = ctype_digit($_POST['year']) ? $_POST['year'] : '';

$birthstamp = mktime(0, 0, 0, $month, $day, $year);
```

**Issues:**
1. Empty strings passed to `mktime()` when validation fails
2. No validation for date ranges (day: 1-31, month: 1-12, year: reasonable range)
3. No validation for invalid dates (e.g., February 30, April 31)
4. `mktime()` accepts invalid dates silently and returns unexpected values
5. No check for future dates

**Impact:**
- Can cause unexpected behavior with invalid dates
- Age calculation may be incorrect
- Potential for logic errors

**Exploitation:**
```bash
# Invalid date causes mktime() to return unexpected timestamp
POST month=13&day=32&year=9999
# mktime() may return -1 or unexpected value
```

**Solution:**
```php
$day = isset($_POST['day']) && ctype_digit($_POST['day']) ? (int)$_POST['day'] : 0;
$month = isset($_POST['month']) && ctype_digit($_POST['month']) ? (int)$_POST['month'] : 0;
$year = isset($_POST['year']) && ctype_digit($_POST['year']) ? (int)$_POST['year'] : 0;

// Validate ranges
if($day < 1 || $day > 31 || $month < 1 || $month > 12 || $year < 1900 || $year > date('Y')) {
    http_response_code(400);
    die('Invalid date range');
}

// Validate actual date exists
if(!checkdate($month, $day, $year)) {
    http_response_code(400);
    die('Invalid date');
}

// Check for future dates
$birthstamp = mktime(0, 0, 0, $month, $day, $year);
if($birthstamp > time()) {
    http_response_code(400);
    die('Date cannot be in the future');
}

$diff = time() - $birthstamp;
$age_years = floor($diff / 31556926);
```

---

### CVE-005: Open Redirect Vulnerability

**Location:** All `agegate.php` files (lines 9-10)  
**Risk Level:** **HIGH**  
**CVSS Score:** 7.1 (High)

**Finding:**
```php
$url = ($_COOKIE['legal'] == 'yes') ? 'index.php' : 'redirect.php';
header ('Location: ' .$url);
```

**Issues:**
1. No validation that `$url` is a safe, relative path
2. If cookie is manipulated, could redirect to external URLs
3. No whitelist validation

**Impact:**
- Phishing attacks
- Redirect to malicious sites
- Session hijacking

**Exploitation:**
```javascript
// If cookie value could be manipulated
document.cookie = "legal=yes; path=/";
// Then redirect could be manipulated if code changes
```

**Solution:**
```php
// Whitelist allowed URLs
$allowed_urls = ['index.php', 'redirect.php', 'agegate.php'];

if(isset($_COOKIE['legal'])) {
    $url = ($_COOKIE['legal'] == 'yes') ? 'index.php' : 'redirect.php';
    
    // Validate URL is in whitelist
    if(!in_array($url, $allowed_urls, true)) {
        $url = 'agegate.php';  // Default safe URL
    }
    
    // Ensure relative path (no protocol, no domain)
    if(strpos($url, '://') !== false || strpos($url, '//') === 0) {
        $url = 'agegate.php';
    }
    
    header('Location: ' . $url);
    exit;
}
```

---

### CVE-006: Information Disclosure in Source Code

**Location:** All PHP files (commented code)  
**Risk Level:** **HIGH**  
**CVSS Score:** 6.5 (Medium-High)

**Finding:**
```php
//session_save_path("/home/users/web/b2704/glo.konamistorage/cgi-bin/tmp");
```

**Issues:**
1. Server file paths exposed
2. Internal directory structure revealed
3. Hosting provider information disclosed
4. Could aid in further attacks

**Impact:**
- Information leakage
- Aids in reconnaissance
- Reveals system architecture

**Solution:**
- Remove all commented code containing paths
- Use `.gitignore` to prevent committing sensitive paths
- Use environment variables for configuration

---

### CVE-007: Missing Security Headers

**Location:** All PHP files  
**Risk Level:** **HIGH**  
**CVSS Score:** 6.8 (Medium-High)

**Finding:**
- No Content-Security-Policy (CSP)
- No X-Frame-Options
- No X-Content-Type-Options
- No Referrer-Policy
- No Permissions-Policy

**Impact:**
- Vulnerable to clickjacking
- XSS attacks easier to execute
- MIME type sniffing attacks
- Information leakage via referrer

**Solution:**
```php
<?php
// Add security headers at the top of each PHP file (before any output)
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.forms-content-1.sg-form.com; frame-src https://cdn.forms-content-1.sg-form.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
?>
```

---

## MEDIUM VULNERABILITIES

### CVE-008: XSS via session_id() Output

**Location:** All `agegate.php` files (lines 227, 231, 352)  
**Risk Level:** **MEDIUM**  
**CVSS Score:** 5.4 (Medium)

**Finding:**
```php
<input type="hidden" name="sesh" value="<?php echo session_id() ?>">
```

**Issues:**
1. `session_id()` output not escaped
2. If session ID contains special characters, could break HTML
3. While session IDs are typically alphanumeric, best practice is to escape

**Impact:**
- Potential XSS if session ID format changes
- HTML injection

**Solution:**
```php
<input type="hidden" name="sesh" value="<?php echo htmlspecialchars(session_id(), ENT_QUOTES, 'UTF-8'); ?>">
```

---

### CVE-009: Missing Rate Limiting

**Location:** All `agegate.php` files  
**Risk Level:** **MEDIUM**  
**CVSS Score:** 5.3 (Medium)

**Finding:**
- No rate limiting on age verification form
- No protection against brute force
- No CAPTCHA

**Impact:**
- Brute force attacks possible
- Automated age verification attempts
- Resource exhaustion

**Solution:**
```php
<?php
session_start();

// Rate limiting
$rate_limit_key = 'age_verify_' . $_SERVER['REMOTE_ADDR'];
$rate_limit_count = isset($_SESSION[$rate_limit_key]) ? $_SESSION[$rate_limit_key] : 0;
$rate_limit_time = isset($_SESSION[$rate_limit_key . '_time']) ? $_SESSION[$rate_limit_key . '_time'] : 0;

// Reset after 15 minutes
if(time() - $rate_limit_time > 900) {
    $rate_limit_count = 0;
}

// Limit to 5 attempts per 15 minutes
if($rate_limit_count >= 5) {
    http_response_code(429);
    die('Too many requests. Please try again later.');
}

if(isset($_POST['checkage'])) {
    // Process form...
    
    // Increment rate limit
    $_SESSION[$rate_limit_key] = $rate_limit_count + 1;
    $_SESSION[$rate_limit_key . '_time'] = time();
}
?>
```

---

### CVE-010: Insecure Direct Object Reference (IDOR)

**Location:** All `index.php` files  
**Risk Level:** **MEDIUM**  
**CVSS Score:** 5.2 (Medium)

**Finding:**
- Cookie validation only checks for existence and value
- No validation that cookie was set by legitimate process
- No timestamp or signature validation

**Impact:**
- Users could manually set cookie to bypass age verification
- Cookie manipulation possible

**Solution:**
```php
<?php
// Use signed cookies
function set_signed_cookie($name, $value, $expires) {
    $secret = 'your-secret-key-change-this';
    $signature = hash_hmac('sha256', $value . $expires, $secret);
    $cookie_value = base64_encode($value . '|' . $expires . '|' . $signature);
    
    setcookie($name, $cookie_value, [
        'expires' => $expires,
        'path' => '/newsletter/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
}

function verify_signed_cookie($name, $secret) {
    if(!isset($_COOKIE[$name])) {
        return false;
    }
    
    $cookie_data = base64_decode($_COOKIE[$name]);
    list($value, $expires, $signature) = explode('|', $cookie_data, 3);
    
    // Verify signature
    $expected_signature = hash_hmac('sha256', $value . $expires, $secret);
    if(!hash_equals($expected_signature, $signature)) {
        return false;
    }
    
    // Check expiration
    if(time() > $expires) {
        return false;
    }
    
    return $value;
}
?>
```

---

### CVE-011: Iframe Security Issues

**Location:** All `index.php` files (line 138)  
**Risk Level:** **MEDIUM**  
**CVSS Score:** 5.1 (Medium)

**Finding:**
```html
<iframe src="https://cdn.forms-content-1.sg-form.com/..." style="border:none;" width="100%" height="600px"></iframe>
```

**Issues:**
1. No `sandbox` attribute
2. No `allow` attribute restrictions
3. No CSP frame-ancestors directive
4. External content loaded without restrictions

**Impact:**
- Clickjacking risks
- If iframe is compromised, could affect parent page
- No isolation between iframe and parent

**Solution:**
```html
<iframe 
    src="https://cdn.forms-content-1.sg-form.com/..." 
    style="border:none;" 
    width="100%" 
    height="600px"
    sandbox="allow-same-origin allow-scripts allow-forms"
    allow="autoplay 'none'"
    loading="lazy">
</iframe>
```

And add to CSP:
```
frame-src https://cdn.forms-content-1.sg-form.com;
frame-ancestors 'self';
```

---

### CVE-012: $_REQUEST Usage

**Location:** All `agegate.php` files (line 16)  
**Risk Level:** **MEDIUM**  
**CVSS Score:** 4.9 (Medium)

**Finding:**
```php
$sesh = preg_replace("/[^0-9?!]/",'',$_REQUEST['sesh']);
```

**Issues:**
1. `$_REQUEST` includes GET, POST, and COOKIE data
2. Parameter pollution vulnerabilities
3. Unclear data source
4. Cookie values can override POST data

**Impact:**
- Parameter confusion attacks
- Unpredictable behavior
- Security bypass possibilities

**Solution:**
```php
// Use specific superglobal
$sesh = isset($_POST['sesh']) ? preg_replace("/[^0-9a-zA-Z]/", '', $_POST['sesh']) : '';
```

---

### CVE-013: Missing Error Handling

**Location:** All PHP files  
**Risk Level:** **MEDIUM**  
**CVSS Score:** 4.5 (Medium)

**Finding:**
- No error handling for `mktime()` failures
- No validation of cookie operations
- No logging of security events

**Impact:**
- Silent failures
- Difficult to detect attacks
- No audit trail

**Solution:**
```php
<?php
// Enable error logging (but don't display to users)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/var/log/php-errors.log');

// Log security events
function log_security_event($event, $details) {
    $log_entry = date('Y-m-d H:i:s') . " - Security: $event - " . json_encode($details) . "\n";
    error_log($log_entry, 3, '/var/log/security.log');
}

// Validate mktime result
$birthstamp = mktime(0, 0, 0, $month, $day, $year);
if($birthstamp === false) {
    log_security_event('INVALID_DATE', ['month' => $month, 'day' => $day, 'year' => $year]);
    http_response_code(400);
    die('Invalid date provided');
}
?>
```

---

## LOW VULNERABILITIES

### CVE-014: Missing Input Length Validation

**Location:** All `agegate.php` files  
**Risk Level:** **LOW**  
**CVSS Score:** 3.2 (Low)

**Finding:**
- No maximum length validation on inputs
- Could cause issues with extremely long values

**Solution:**
```php
$day = isset($_POST['day']) && strlen($_POST['day']) <= 2 && ctype_digit($_POST['day']) ? (int)$_POST['day'] : 0;
$month = isset($_POST['month']) && strlen($_POST['month']) <= 2 && ctype_digit($_POST['month']) ? (int)$_POST['month'] : 0;
$year = isset($_POST['year']) && strlen($_POST['year']) <= 4 && ctype_digit($_POST['year']) ? (int)$_POST['year'] : 0;
```

---

### CVE-015: HTTP Protocol in Links

**Location:** `index.html`, `agegate.php`  
**Risk Level:** **LOW**  
**CVSS Score:** 2.5 (Low)

**Finding:**
```html
<a href="http://www.konami.com/">
```

**Issues:**
- Hardcoded HTTP links (should be HTTPS)
- Mixed content warnings in production

**Solution:**
```html
<a href="https://www.konami.com/">
```

---

## Security Best Practices Not Implemented

### Missing Implementations:

1. **Password/Secret Management**
   - No environment variables for secrets
   - Hardcoded values in code

2. **Logging & Monitoring**
   - No security event logging
   - No intrusion detection
   - No monitoring of failed attempts

3. **Input Sanitization**
   - No comprehensive input validation library
   - No output encoding consistency

4. **Authentication/Authorization**
   - No user authentication system
   - No role-based access control

5. **Data Protection**
   - No encryption for sensitive data
   - No data retention policies

---

## Recommended Immediate Actions

### Priority 1 (Fix Immediately):
1. Fix broken session validation (CVE-001)
2. Implement secure cookie configuration (CVE-002)
3. Add CSRF protection (CVE-003)
4. Fix input validation (CVE-004)
5. Add security headers (CVE-007)

### Priority 2 (Fix Before Production):
6. Fix open redirect (CVE-005)
7. Remove information disclosure (CVE-006)
8. Add rate limiting (CVE-009)
9. Implement signed cookies (CVE-010)

### Priority 3 (Enhancement):
10. Fix XSS output (CVE-008)
11. Secure iframe (CVE-011)
12. Replace $_REQUEST (CVE-012)
13. Add error handling (CVE-013)

---

## Risk Assessment Matrix

| Vulnerability | Severity | Exploitability | Impact | Priority |
|--------------|----------|----------------|--------|----------|
| CVE-001 | CRITICAL | Easy | High | P0 |
| CVE-002 | CRITICAL | Easy | High | P0 |
| CVE-003 | HIGH | Medium | High | P1 |
| CVE-004 | HIGH | Easy | Medium | P1 |
| CVE-005 | HIGH | Medium | Medium | P1 |
| CVE-006 | HIGH | Easy | Low | P1 |
| CVE-007 | HIGH | Easy | Medium | P1 |
| CVE-008 | MEDIUM | Hard | Low | P2 |
| CVE-009 | MEDIUM | Easy | Medium | P2 |
| CVE-010 | MEDIUM | Medium | Medium | P2 |
| CVE-011 | MEDIUM | Hard | Low | P2 |
| CVE-012 | MEDIUM | Medium | Low | P2 |
| CVE-013 | MEDIUM | N/A | Low | P2 |
| CVE-014 | LOW | Hard | Low | P3 |
| CVE-015 | LOW | N/A | Low | P3 |

---

## Security Checklist for Production

- [ ] All CRITICAL vulnerabilities fixed
- [ ] All HIGH vulnerabilities fixed
- [ ] HTTPS enabled with valid certificate
- [ ] Security headers configured
- [ ] CSRF protection implemented
- [ ] Rate limiting enabled
- [ ] Secure cookie flags set
- [ ] Session management properly configured
- [ ] Input validation comprehensive
- [ ] Error handling implemented
- [ ] Security logging enabled
- [ ] Penetration testing completed
- [ ] Code review completed
- [ ] Security documentation updated
- [ ] Incident response plan in place

---

## Additional Recommendations

1. **Implement WAF (Web Application Firewall)**
   - Use ModSecurity or Cloudflare WAF
   - Block common attack patterns

2. **Regular Security Updates**
   - Keep PHP updated
   - Monitor security advisories
   - Regular dependency updates

3. **Security Testing**
   - Automated vulnerability scanning
   - Regular penetration testing
   - Code security audits

4. **Monitoring & Alerting**
   - Set up security event monitoring
   - Alert on suspicious patterns
   - Regular log review

5. **Backup & Recovery**
   - Regular backups
   - Test recovery procedures
   - Disaster recovery plan

---

## Contact & Escalation

For questions regarding this security audit:
- **Security Team:** security@example.com
- **Emergency:** security-incident@example.com

**Report Classification:** CONFIDENTIAL  
**Distribution:** Development Team, Security Team, Management

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Next Review:** December 2025

