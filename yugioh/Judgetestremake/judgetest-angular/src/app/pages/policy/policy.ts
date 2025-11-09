import { Component, ViewChild, OnInit } from '@angular/core';
import { TestHeaderComponent } from '../../components/shared/test-header/test-header';
import { TestFormComponent } from '../../components/shared/test-form/test-form';
import { TestFooterComponent } from '../../components/shared/test-footer/test-footer';
import { TestService } from '../../services/test';
import { TestUser, TestType, TestMetadata, Question } from '../../models/test.model';

/**
 * PolicyComponent
 * Single Responsibility: Manage Policy test page
 * Loosely Coupled: Uses services for business logic, shared components for UI
 * Highly Cohesive: All functionality relates to Policy test
 */
@Component({
  selector: 'app-policy',
  imports: [TestHeaderComponent, TestFormComponent, TestFooterComponent],
  templateUrl: './policy.html',
  styleUrl: './policy.scss'
})
export class PolicyComponent implements OnInit {
  @ViewChild('testForm') testFormComponent!: TestFormComponent;

  testMetadata!: TestMetadata;
  isFormValid: boolean = false;
  private userData: TestUser | null = null;

  questions: Question[] = [];
  selectedAnswers: Record<number, number> = {};

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testMetadata = this.testService.getTestMetadata(TestType.POLICY);

    this.testService.getQuestions(TestType.POLICY, 'en').subscribe({
      next: (qs) => this.questions = qs,
      error: () => this.questions = []
    });
  }

  onFormValidityChange(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  onUserDataChange(userData: TestUser): void {
    this.userData = userData;
  }

  onSelectAnswer(qid: number, aid: number): void {
    this.selectedAnswers[qid] = aid;
  }

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

    alert('Answers captured. Submission will be implemented.');
  }
}
