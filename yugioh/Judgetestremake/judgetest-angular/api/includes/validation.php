<?php
declare(strict_types=1);

/**
 * Input Validation Module
 * Single Responsibility: Validate user input
 * Highly Cohesive: All validation logic together
 * Loosely Coupled: No dependencies on database or business logic
 */

class InputValidator {
    
    /**
     * Validate test submission data
     */
    public static function validateSubmission(array $data): array {
        $errors = [];
        
        // Validate email
        if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email address';
        } elseif (strlen($data['email']) > 255) {
            $errors[] = 'Email address too long';
        }
        
        // Validate first name
        if (!isset($data['firstName']) || !preg_match('/^[a-zA-Z\s\-\'\.]{1,50}$/', $data['firstName'])) {
            $errors[] = 'Invalid first name';
        }
        
        // Validate last name
        if (!isset($data['lastName']) || !preg_match('/^[a-zA-Z\s\-\'\.]{1,50}$/', $data['lastName'])) {
            $errors[] = 'Invalid last name';
        }
        
        // Validate card game ID
        if (!isset($data['cardGameId']) || !preg_match('/^[a-zA-Z0-9]{8,20}$/', $data['cardGameId'])) {
            $errors[] = 'Invalid Card Game ID';
        }
        
        // Validate answers
        if (!isset($data['answers']) || !is_array($data['answers']) || count($data['answers']) === 0) {
            $errors[] = 'No answers submitted';
        } elseif (count($data['answers']) > 100) {
            $errors[] = 'Too many answers submitted';
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Validate age verification data
     */
    public static function validateAgeData(array $data): array {
        $errors = [];
        
        if (!isset($data['birthDate']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['birthDate'])) {
            $errors[] = 'Invalid birth date format';
        } else {
            $date = DateTime::createFromFormat('Y-m-d', $data['birthDate']);
            if (!$date || $date->format('Y-m-d') !== $data['birthDate']) {
                $errors[] = 'Invalid birth date';
            }
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Validate test type
     */
    public static function validateTestType(string $testType): bool {
        $allowedTypes = ['demojudge', 'rulings', 'policy'];
        return in_array($testType, $allowedTypes);
    }
    
    /**
     * Validate language code
     */
    public static function validateLanguage(string $lang): bool {
        $allowedLanguages = ['en', 'sp', 'de', 'fr', 'it'];
        return in_array($lang, $allowedLanguages);
    }
}

