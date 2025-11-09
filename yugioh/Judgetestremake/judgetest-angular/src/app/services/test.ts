import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private readonly API_BASE_URL = 'http://localhost:8000/api'; // Change to your backend URL
  
  constructor(private http: HttpClient) {}
  
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
   * Connects to backend API: GET /api/tests/questions.php
   */
  getQuestions(testType: TestType, language: string = 'en'): Observable<Question[]> {
    const params = new HttpParams()
      .set('testName', testType)
      .set('language', language)
      .set('limit', '20');
    
    return this.http.get<any>(`${this.API_BASE_URL}/tests/questions.php`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            // Transform API response to match our Question model
            return response.questions.map((q: any) => ({
              id: q.id,
              question: q.questionText,
              versionNum: q.versionNum,
              testName: q.testName,
              correctAnswerId: q.correctAnswerId || 0, // Not included in API response for security
              answers: q.answers || []
            }));
          }
          return [];
        })
      );
  }

  /**
   * Fetch answers for a specific question
   * Note: Answers are already included in getQuestions() response
   */
  getAnswers(questionId: number): Observable<Answer[]> {
    // This method is not needed as answers come with questions
    return of([]);
  }

  /**
   * Submit test for grading
   * Connects to backend API: POST /api/tests/submit.php
   */
  submitTest(submission: TestSubmission): Observable<TestResult> {
    // Convert Map to object for JSON serialization
    const answersObj: any = {};
    submission.answers.forEach((value, key) => {
      answersObj[key] = value;
    });
    
    const payload = {
      user: {
        email: submission.user.email,
        firstName: submission.user.firstName,
        lastName: submission.user.lastName,
        cardGameId: submission.user.cardGameId
      },
      testName: submission.testName,
      answers: answersObj,
      language: submission.language
    };
    
    return this.http.post<any>(`${this.API_BASE_URL}/tests/submit.php`, payload)
      .pipe(
        map(response => {
          if (response.success) {
            return {
              score: response.score,
              passed: response.passed,
              totalQuestions: response.totalQuestions || 20,
              correctAnswers: response.correctAnswers,
              message: response.message
            };
          }
          
          return {
            score: 0,
            passed: false,
            totalQuestions: 0,
            correctAnswers: 0,
            message: response.message || 'Submission failed'
          };
        })
      );
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
