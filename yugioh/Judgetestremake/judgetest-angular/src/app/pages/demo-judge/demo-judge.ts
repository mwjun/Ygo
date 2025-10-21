import { Component, ViewChild, OnInit } from '@angular/core';
import { TestHeaderComponent } from '../../components/shared/test-header/test-header';
import { TestFormComponent } from '../../components/shared/test-form/test-form';
import { TestFooterComponent } from '../../components/shared/test-footer/test-footer';
import { TestService } from '../../services/test';
import { TestUser, TestType, TestMetadata } from '../../models/test.model';

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

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    // Fetch test metadata from service (Dependency Injection)
    this.testMetadata = this.testService.getTestMetadata(TestType.DEMO_JUDGE);
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

    // TODO: Collect answers when questions are implemented
    // const submission: TestSubmission = {
    //   user: userData,
    //   answers: new Map(),
    //   testName: TestType.DEMO_JUDGE,
    //   language: 'en'
    // };

    // this.testService.submitTest(submission).subscribe({
    //   next: (result) => {
    //     // Handle success
    //   },
    //   error: (error) => {
    //     // Handle error
    //   }
    // });

    alert('Test submission will be implemented when backend is connected');
  }
}
