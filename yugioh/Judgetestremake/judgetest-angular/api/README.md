# Judge Test API Backend

## 📁 Structure (Highly Cohesive, Loosely Coupled)

```
api/
├── config/                      # Configuration (Single Purpose)
│   ├── .env.example            # Environment template
│   └── env.php                 # Environment loader
├── includes/                    # Reusable Modules (High Cohesion)
│   ├── db_yugioh.php          # Database connection
│   ├── headers.php             # Security headers
│   ├── validation.php          # Input validation
│   └── security.php            # Session management
├── api/                        # API Endpoints (Loosely Coupled)
│   ├── auth/
│   │   └── age-verification.php
│   └── tests/
│       ├── questions.php
│       └── submit.php
├── .htaccess                   # Apache configuration
├── setup-database.sql          # Database setup script
└── test-connection.php         # Connection test
```

## 🏗️ Architecture Principles

### **High Cohesion** (Each module does one thing well):
- `headers.php` → Only handles HTTP security headers
- `validation.php` → Only validates input data
- `security.php` → Only manages sessions
- `db_yugioh.php` → Only handles database connection

### **Loose Coupling** (Minimal dependencies):
- Endpoints depend on modules, not on each other
- Modules don't depend on specific endpoints
- Easy to test and modify independently

## 🚀 Setup Instructions

### Step 1: Environment Configuration
```bash
# Copy example environment file
cp config/.env.example config/.env

# Edit with your database credentials
nano config/.env
```

### Step 2: Database Setup
```bash
# Run the SQL setup script
mysql -u your_user -p your_database < setup-database.sql
```

### Step 3: Test Connection
```bash
# Visit in browser
http://localhost/api/test-connection.php
```

## 📡 API Endpoints

### POST `/api/auth/age-verification.php`
**Purpose**: Verify user age and create secure session

**Request**:
```json
{
  "birthDate": "2000-01-15",
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "verified": true,
  "sessionToken": "...",
  "expiresIn": 7200,
  "age": 24
}
```

### GET `/api/tests/questions.php?testName=demojudge&language=en&limit=20`
**Purpose**: Fetch questions for a test

**Response**:
```json
{
  "success": true,
  "testType": "demojudge",
  "questions": [...],
  "total": 20
}
```

### POST `/api/tests/submit.php`
**Purpose**: Submit test answers for grading

**Request**:
```json
{
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "cardGameId": "12345678"
  },
  "testName": "demojudge",
  "answers": {
    "1": 5,
    "2": 8,
    "3": 12
  }
}
```

**Response**:
```json
{
  "success": true,
  "score": 85.0,
  "passed": true,
  "correctAnswers": 17,
  "totalQuestions": 20,
  "message": "Congratulations!..."
}
```

## 🔐 Security Features

✅ **Prepared Statements** - All queries use parameter binding  
✅ **Input Validation** - Comprehensive validation on all inputs  
✅ **Session Management** - Cryptographically secure tokens  
✅ **Security Headers** - CORS, XSS protection, CSRF prevention  
✅ **Error Handling** - No information disclosure  
✅ **Environment Variables** - No hardcoded credentials  

## 🧪 Testing

```bash
# Test database connection
php test-connection.php

# Test age verification
curl -X POST http://localhost/api/auth/age-verification.php \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"2000-01-15","language":"en"}'
```

## 📝 Notes

- All endpoints return JSON responses
- Session required for protected endpoints (except age-verification)
- CORS enabled for Angular app (localhost:4200)
- All database queries use prepared statements
- Error messages don't expose system information

