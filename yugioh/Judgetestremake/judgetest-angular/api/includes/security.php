<?php
declare(strict_types=1);

/**
 * Security & Session Management Module
 * Single Responsibility: Session and security management
 * Highly Cohesive: All security-related functions
 * Loosely Coupled: Works with database connection, not tightly bound
 */

class SecurityManager {
    
    private $conn;
    
    public function __construct(mysqli $conn) {
        $this->conn = $conn;
    }
    
    /**
     * Verify if session is valid
     */
    public function isSessionValid(string $token): bool {
        if (empty($token)) {
            return false;
        }
        
        $hashed_token = hash('sha256', $token);
        
        $stmt = $this->conn->prepare("
            SELECT id FROM test_sessions 
            WHERE session_token_hash = ? 
            AND expires_at > NOW() 
            AND is_active = 1
        ");
        
        if (!$stmt) {
            error_log("Prepare statement failed: " . $this->conn->error);
            return false;
        }
        
        $stmt->bind_param('s', $hashed_token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $is_valid = $result->num_rows > 0;
        $stmt->close();
        
        return $is_valid;
    }
    
    /**
     * Create a new secure session
     */
    public function createSession(string $ipAddress, string $userAgent, string $language): array {
        // Generate secure random token
        $token = bin2hex(random_bytes(32));
        $hashed_token = hash('sha256', $token);
        
        // Calculate expiration time
        $expires_at = date('Y-m-d H:i:s', time() + (2 * 60 * 60)); // 2 hours
        
        // Store in database
        $stmt = $this->conn->prepare("
            INSERT INTO test_sessions 
            (session_token_hash, ip_address, user_agent, expires_at, language, is_active) 
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        
        if (!$stmt) {
            error_log("Prepare statement failed: " . $this->conn->error);
            return ['success' => false, 'message' => 'Session creation failed'];
        }
        
        $stmt->bind_param('sssss', $hashed_token, $ipAddress, $userAgent, $expires_at, $language);
        
        if (!$stmt->execute()) {
            error_log("Session creation failed: " . $stmt->error);
            $stmt->close();
            return ['success' => false, 'message' => 'Session creation failed'];
        }
        
        $stmt->close();
        
        return [
            'success' => true,
            'token' => $token,
            'expiresAt' => $expires_at
        ];
    }
    
    /**
     * Invalidate session (logout)
     */
    public function invalidateSession(string $token): bool {
        $hashed_token = hash('sha256', $token);
        
        $stmt = $this->conn->prepare("
            UPDATE test_sessions 
            SET is_active = 0 
            WHERE session_token_hash = ?
        ");
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param('s', $hashed_token);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Require valid session, redirect if invalid
     */
    public function requireSession(): void {
        $token = $_COOKIE['session_token'] ?? '';
        
        if (!$this->isSessionValid($token)) {
            http_response_code(401);
            SecurityHeaders::setJson();
            echo json_encode([
                'success' => false,
                'message' => 'Session expired or invalid',
                'redirect' => 'age-gate'
            ]);
            exit();
        }
    }
}

