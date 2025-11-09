import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from '../../../services/cookie';

@Component({
  selector: 'app-age-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './age-form.html',
  styleUrl: './age-form.css'
})
export class AgeFormComponent implements OnInit {
  @Output() ageVerified = new EventEmitter<boolean>();
  @Output() ageRejected = new EventEmitter<void>();

  month: number = 0; // Match PHP: value="0" selected="selected" for placeholder
  day: number = 0;   // Match PHP: value="0" selected="selected" for placeholder
  year: number = 0;  // Match PHP: value="0" selected="selected" for placeholder
  errorMessage: string = '';
  
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  
  days: number[] = [];
  years: number[] = [];

  constructor(private cookieService: CookieService) {
    // Match PHP: Years from 2024 down to 1925 (as in original agegate.php)
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(1925, currentYear - 100); // Match original range
    for (let i = currentYear; i >= startYear; i--) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.updateDays();
  }

  onMonthChange(): void {
    // Ensure month is a number
    this.month = Number(this.month);
    this.updateDays();
  }

  onYearChange(): void {
    // Ensure year is a number
    this.year = Number(this.year);
    this.updateDays();
  }

  onDayChange(): void {
    // Ensure day is a number
    this.day = Number(this.day);
  }

  updateDays(): void {
    // If month is not selected, clear days
    if (this.month === 0) {
      this.days = [];
      return;
    }
    
    // If year is not selected yet, use current year to calculate days
    // This allows days to show when only month is selected
    const yearToUse = this.year === 0 ? new Date().getFullYear() : this.year;
    
    // Calculate days in the selected month
    // new Date(year, month, 0) gives the last day of the previous month
    // So new Date(year, month, 0).getDate() gives days in the selected month
    const daysInMonth = new Date(yearToUse, this.month, 0).getDate();
    this.days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }
    
    // If current day selection is invalid for the month, reset it
    if (this.day > daysInMonth) {
      this.day = 0; // Reset to placeholder
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    // Ensure all values are numbers (Angular ngModel might return strings)
    const month = Number(this.month);
    const day = Number(this.day);
    const year = Number(this.year);

    // Match PHP: ctype_digit() validation - check if values are numeric and not 0
    if (month === 0 || day === 0 || year === 0 || isNaN(month) || isNaN(day) || isNaN(year)) {
      this.errorMessage = 'Please select a valid date.';
      return;
    }

    // Match PHP: Additional validation - ensure values are within valid ranges
    if (month < 1 || month > 12 || day < 1 || day > 31 || 
        year < 1925 || year > new Date().getFullYear()) {
      this.errorMessage = 'Please enter a valid date.';
      return;
    }

    // Match PHP: Validate date exists (e.g., Feb 30 doesn't exist)
    if (!this.cookieService.isValidDate(year, month, day)) {
      this.errorMessage = 'Please enter a valid date.';
      return;
    }

    // Match PHP: Calculate age using exact same logic
    const age = this.cookieService.calculateAge(year, month, day);

    // Match PHP: if($age_years >= 16)
    if (age >= 16) {
      // Don't set cookie yet - wait for terms acceptance
      // Cookie will be set in age-gate component after terms are accepted
      this.ageVerified.emit(true);
    } else {
      // Match PHP: setcookie('legal', 'no', time()+7200, '/');
      this.cookieService.setLegalCookie('no');
      this.ageRejected.emit();
    }
  }
}
