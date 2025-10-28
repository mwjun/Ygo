# 🔧 Create Missing Database Table

## The Problem

Your backend is trying to use the `test_sessions` table, but it doesn't exist in your database yet.

**Error**: `Table '2018_yugioh_test.test_sessions' doesn't exist`

---

## ✅ Quick Fix

### **Option 1: Run the SQL Script** (Recommended)

```bash
# Navigate to API folder
cd Judgetestremake/judgetest-angular/api

# Run SQL script
mysql -u root -p 2018_yugioh_test < create-table.sql
```

When prompted, enter your MySQL password.

---

### **Option 2: Manual SQL Command**

Connect to MySQL and run:

```sql
USE 2018_yugioh_test;

CREATE TABLE IF NOT EXISTS test_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token_hash VARCHAR(64) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_token (session_token_hash),
    INDEX idx_expires ( dogma_at),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### **Option 3: Use MySQL Workbench or phpMyAdmin**

1. Open your MySQL client
2. Select database: `2018_yugioh_test`
3. Run the SQL from `create-table.sql` file

---

## ✅ Verify Table Was Created

```bash
mysql -u root -p -e "USE 2018_yugioh_test; SHOW TABLES LIKE 'test_sessions';"
```

Should output: `test_sessions`

---

## 🧪 Test Again

After creating the table:

1. Go back to your browser
2. Try age verification again
3. Should work now! ✅

---

**Run one of the commands above and you'll be all set!** 🚀

