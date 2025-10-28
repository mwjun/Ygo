-- Create test_sessions table
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
    INDEX idx_expires (expires_at),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Table test_sessions created successfully!' as Status;

