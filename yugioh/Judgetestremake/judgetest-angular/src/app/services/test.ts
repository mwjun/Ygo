import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Question, 
  Answer, 
  TestSubmission, 
  TestResult, 
  TestType,
  TestMetadata 
} from '../models/test.model';

/**
 * TestService - Single Responsibility: Manage test data and submissions
 * Loosely coupled: No direct dependencies on UI components
 * Highly cohesive: All methods relate to test management
 */
@Injectable({
  providedIn: 'root'
})
export class TestService {
  
  private readonly testMetadata: Record<TestType, TestMetadata> = {
    [TestType.DEMO_JUDGE]: {
      type: TestType.DEMO_JUDGE,
      title: 'Demo Comprehension Level 1 (DC-1)',
      passingScore: 80,
      timeLimit: 30,
      description: 'Demo Judge Certification Test'
    },
    [TestType.RULINGS]: {
      type: TestType.RULINGS,
      title: 'Rulings Comprehension Level 1 (RC-1)',
      passingScore: 80,
      timeLimit: 30,
      description: 'Rulings Certification Test'
    },
    [TestType.POLICY]: {
      type: TestType.POLICY,
      title: 'Policy Comprehension Level 1 (PC-1)',
      passingScore: 80,
      timeLimit: 30,
      description: 'Policy Certification Test'
    }
  };

  /**
   * Get metadata for a specific test type
   */
  getTestMetadata(testType: TestType): TestMetadata {
    return this.testMetadata[testType];
  }

  /**
   * Fetch questions for a specific test
   * TODO: Connect to backend API
   */
  getQuestions(testType: TestType, language: string = 'en'): Observable<Question[]> {
    // Placeholder - will be replaced with HTTP call to backend
    return of([]);
  }

  /**
   * Fetch answers for a specific question
   * TODO: Connect to backend API
   */
  getAnswers(questionId: number): Observable<Answer[]> {
    // Placeholder - will be replaced with HTTP call to backend
    return of([]);
  }

  /**
   * Submit test for grading
   * TODO: Connect to backend API
   */
  submitTest(submission: TestSubmission): Observable<TestResult> {
    // Placeholder - will be replaced with HTTP call to backend
    const mockResult: TestResult = {
      score: 0,
      passed: false,
      totalQuestions: 20,
      correctAnswers: 0,
      message: 'Backend not connected yet'
    };
    return of(mockResult);
  }

  /**
   * Calculate if score passes the test
   */
  isPassing(score: number, testType: TestType): boolean {
    return score >= this.testMetadata[testType].passingScore;
  }

  /**
   * Validate test submission
   */
  validateSubmission(submission: TestSubmission): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!submission.user.email) errors.push('Email is required');
    if (!submission.user.firstName) errors.push('First name is required');
    if (!submission.user.lastName) errors.push('Last name is required');
    if (!submission.user.cardGameId) errors.push('Card Game ID is required');
    
    if (submission.answers.size === 0) {
      errors.push('At least one question must be answered');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
