import { Component, ViewChild, OnInit } from '@angular/core';
import { TestHeaderComponent } from '../../components/shared/test-header/test-header';
import { TestFormComponent } from '../../components/shared/test-form/test-form';
import { TestFooterComponent } from '../../components/shared/test-footer/test-footer';
import { TestService } from '../../services/test';
import { TestUser, TestType, TestMetadata, Question } from '../../models/test.model';

/**
 * DemoJudgeComponent
 * Single Responsibility: Manage Demo Judge test page
 * Loosely Coupled: Uses services for business logic, shared components for UI
 * Highly Cohesive: All functionality relates to Demo Judge test
 */
@Component({
  selector: 'app-demo-judge',
  imports: [TestHeaderComponent, TestFormComponent, TestFooterComponent],
  templateUrl: './demo-judge.html',
  styleUrl: './demo-judge.scss'
})
export class DemoJudgeComponent implements OnInit {
  @ViewChild('testForm') testFormComponent!: TestFormComponent;

  testMetadata!: TestMetadata;
  isFormValid: boolean = false;
  private userData: TestUser | null = null;

  questions: Question[] = [];
  selectedAnswers: Record<number, number> = {};

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    // Fetch test metadata from service (Dependency Injection)
    this.testMetadata = this.testService.getTestMetadata(TestType.DEMO_JUDGE);

    // Load questions from backend
    this.testService.getQuestions(TestType.DEMO_JUDGE, 'en').subscribe({
      next: (qs) => {
        this.questions = qs;
      },
      error: () => {
        // Keep page usable even if questions fail to load
        this.questions = [];
      }
    });
  }

  /**
   * Handle form validity changes
   * Follows event-driven architecture
   */
  onFormValidityChange(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  /**
   * Handle user data changes
   * Follows event-driven architecture
   */
  onUserDataChange(userData: TestUser): void {
    this.userData = userData;
  }

  onSelectAnswer(qid: number, aid: number): void {
    this.selectedAnswers[qid] = aid;
  }

  /**
   * Submit test
   * Separation of Concerns: Delegates to service
   */
  onSubmit(): void {
    if (!this.isFormValid) {
      this.testFormComponent.markAllAsTouched();
      return;
    }

    const userData = this.testFormComponent.getUserData();
    if (!userData) {
      alert('Please fill in all required fields');
      return;
    }

    // Placeholder: submission wiring can be enabled later
    alert('Answers captured. Submission will be implemented.');
  }
}
