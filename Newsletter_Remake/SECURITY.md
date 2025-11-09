# Security Implementation Guide

This document outlines all security measures implemented in the SendGrid integration.

## ✅ Security Measures Implemented

### 1. **Input Validation & Sanitization**

#### Backend (`server.js`)
- **Email Validation**:** RFC 5321 compliant email regex validation
- **Input Sanitization**: All user inputs are sanitized to remove HTML tags and dangerous characters
- **Length Limits**: 
  - Email: max 254 characters (RFC limit)
  - First/Last name: max 100 characters
  - Request body: max 10KB
- **Type Validation**: Newsletter type must be one of: 'dl', 'md', 'tcg'

#### Frontend (Angular Components)
- **Email Validation**: Regex validation before sending to API
- **Input Sanitization**: Email trimmed and lowercased
- **Length Checks**: Email length validation (max 254 chars)

### 2. **XSS (Cross-Site Scripting) Protection**

- **HTML Sanitization**: All user inputs (firstName, lastName) are sanitized before being inserted into email HTML
- **Template Escaping**: Email template uses sanitized values only
- **Angular DomSanitizer**: Used for iframe URLs to prevent XSS

### 3. **Rate Limiting**

- **Implementation**: `express-rate-limit` middleware
- **Limits**: 
  - 5 requests per IP per 15 minutes
  - Prevents email spam and API abuse
- **Applied to**: All `/api/` routes

### 4. **CORS (Cross-Origin Resource Sharing)**

- **Strict Origin Validation**: Only allows requests from configured origins
- **Production**: Must explicitly list allowed origins in `ALLOWED_ORIGINS` env variable
- **Development**: Allows `localhost:4200` by default
- **Credentials**: Enabled for authenticated requests

### 5. **Security Headers**

All responses include:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Strict-Transport-Security` (production only) - Forces HTTPS

### 6. **PostMessage Security**

- **Origin Validation**: Strict validation of postMessage origins
- **Allowed Origins**: Only accepts messages from:
  - `https://cdn.forms-content-1.sg-form.com`
  - `https://forms-content-1.sg-form.com`
  - `https://sg-form.com`
- **Email Validation**: Validates email format from postMessage before processing

### 7. **Error Handling**

- **Information Disclosure Prevention**: 
  - Production: Generic error messages only
  - Development: Detailed errors for debugging
- **Error Logging**: Server-side logging without exposing sensitive data
- **Graceful Failures**: API returns appropriate HTTP status codes

### 8. **Request Size Limits**

- **Body Size Limit**: 10KB maximum for JSON and URL-encoded requests
- **Prevents**: DoS attacks via large payloads

### 9. **Environment Variables**

- **API Key Protection**: SendGrid API key stored in `.env` file (never committed)
- **Required Variables**: Server exits if `SENDGRID_API_KEY` is missing
- **Environment Detection**: Different behavior for development vs production

### 10. **Email Content Security**

- **HTML Sanitization**: All dynamic content in email templates is sanitized
- **No Script Injection**: Email HTML doesn't include user-controlled script content
- **Safe Greeting**: User names are sanitized before use in email

## 🔒 Security Checklist

### Before Production Deployment:

- [ ] Set `ALLOWED_ORIGINS` environment variable with your production domain(s)
- [ ] Set `NODE_ENV=production`
- [ ] Verify `SENDGRID_API_KEY` is set and valid
- [ ] Verify `SENDGRID_FROM_EMAIL` is set and verified in SendGrid
- [ ] Use HTTPS for both frontend and backend
- [ ] Review and adjust rate limiting thresholds if needed
- [ ] Set up monitoring/alerting for rate limit violations
- [ ] Test CORS configuration with production domains
- [ ] Review server logs for any security warnings

## 🚨 Security Best Practices

1. **Never commit `.env` files** - Contains sensitive API keys
2. **Use HTTPS in production** - Encrypts data in transit
3. **Regularly rotate API keys** - Change SendGrid API keys periodically
4. **Monitor API usage** - Watch for unusual patterns or abuse
5. **Keep dependencies updated** - Regularly update npm packages for security patches
6. **Use environment-specific configs** - Different settings for dev/staging/prod

## 📊 Rate Limiting Details

Current configuration:
- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Scope**: All `/api/` endpoints

This prevents:
- Email spam/abuse
- API brute force attacks
- Resource exhaustion

Adjust in `server.js` if needed for your use case.

## 🔍 Additional Recommendations

1. **Add CSRF Protection**: Consider adding CSRF tokens for state-changing operations
2. **IP Whitelisting**: For admin endpoints, consider IP whitelisting
3. **Request Logging**: Log all API requests for audit trail
4. **Email Verification**: Consider adding double opt-in for newsletter signups
5. **CAPTCHA**: Consider adding CAPTCHA for the email prompt form

