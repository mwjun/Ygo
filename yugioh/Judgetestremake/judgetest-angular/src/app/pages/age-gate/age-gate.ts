import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgeGateService } from '../../services/age-gate';

/**
 * AgeGateComponent
 * Single Responsibility: Handle age verification UI
 * Loosely Coupled: Uses service for business logic
 * Highly Cohesive: All functionality relates to age verification
 */
@Component({
  selector: 'app-age-gate',
  imports: [CommonModule, FormsModule],
  templateUrl: './age-gate.html',
  styleUrl: './age-gate.scss'
})
export class AgeGateComponent {
  days: number[] = Array.from({length: 31}, (_, i) => i + 1);
  years: number[] = Array.from({length: 96}, (_, i) => 2024 - i);
  
  selectedMonth: number = 0;
  selectedDay: number = 0;
  selectedYear: number = 0;
  
  private returnUrl: string = '/home';

  constructor(
    private ageGateService: AgeGateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from query params
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/home';
    });
  }

  /**
   * Handle age verification submission
   * Delegates business logic to service
   */
  onSubmit(): void {
    if (this.selectedMonth === 0 || this.selectedDay === 0 || this.selectedYear === 0) {
      alert('Please select your complete date of birth');
      return;
    }

    const birthDate = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
    // Call backend API to verify age
    this.ageGateService.verifyAge(birthDate).subscribe({
      next: (isOfAge) => {
        if (isOfAge) {
          // Navigate to return URL or home
          this.router.navigateByUrl(this.returnUrl);
        } else {
          // Redirect to not eligible page or show message
          alert(`You must be at least ${this.ageGateService.getMinimumAge()} years old to access this content.`);
        }
      },
      error: (error) => {
        console.error('Age verification failed:', error);
        alert('Error verifying age. Please try again.');
      }
    });
  }
}
