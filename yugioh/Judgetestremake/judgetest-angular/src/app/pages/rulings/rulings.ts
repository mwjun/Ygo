import { Component, ViewChild, OnInit } from '@angular/core';
import { TestHeaderComponent } from '../../components/shared/test-header/test-header';
import { TestFormComponent } from '../../components/shared/test-form/test-form';
import { TestFooterComponent } from '../../components/shared/test-footer/test-footer';
import { TestService } from '../../services/test';
import { TestUser, TestType, TestMetadata } from '../../models/test.model';

/**
 * RulingsComponent
 * Single Responsibility: Manage Rulings test page
 * Loosely Coupled: Uses services for business logic, shared components for UI
 * Highly Cohesive: All functionality relates to Rulings test
 */
@Component({
  selector: 'app-rulings',
  imports: [TestHeaderComponent, TestFormComponent, TestFooterComponent],
  templateUrl: './rulings.html',
  styleUrl: './rulings.scss'
})
export class RulingsComponent implements OnInit {
  @ViewChild('testForm') testFormComponent!: TestFormComponent;

  testMetadata!: TestMetadata;
  isFormValid: boolean = false;
  private userData: TestUser | null = null;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testMetadata = this.testService.getTestMetadata(TestType.RULINGS);
  }

  onFormValidityChange(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  onUserDataChange(userData: TestUser): void {
    this.userData = userData;
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

    alert('Test submission will be implemented when backend is connected');
  }
}
