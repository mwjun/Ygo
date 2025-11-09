// Model interfaces following Domain-Driven Design

export interface TestUser {
  email: string;
  firstName: string;
  lastName: string;
  cardGameId: string;
}

export interface Question {
  id: number;
  question: string;
  versionNum: number;
  testName: string;
  correctAnswerId: number;
}

export interface Answer {
  id: number;
  questionId: number;
  answer: string;
}

export interface TestSubmission {
  user: TestUser;
  answers: Map<number, number>; // questionId -> answerId
  testName: string;
  language: string;
}

export interface TestResult {
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  message: string;
}

export enum TestType {
  DEMO_JUDGE = 'demojudge',
  RULINGS = 'rulings',
  POLICY = 'policy'
}

export interface TestMetadata {
  type: TestType;
  title: string;
  passingScore: number;
  timeLimit: number; // in minutes
  description: string;
}

