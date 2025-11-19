/**
 * FILE: age-form.ts
 * 
 * PURPOSE:
 * Age verification form component that collects user's date of birth and validates age.
 * This component matches the original PHP age gate logic exactly.
 * 
 * FEATURES:
 * - Date of birth input (month, day, year dropdowns)
 * - Dynamic day calculation based on month/year (handles leap years)
 * - Age calculation matching PHP logic
 * - Date validation
 * - Event emitters for age verification results
 * 
 * LOGIC:
 * - User selects month, day, year
 * - Days list updates dynamically based on selected month/year
 * - On submit, calculates age and checks if >= 16
 * - Emits ageVerified event if age >= 16
 * - Emits ageRejected event if age < 16
 * 
 * NOTE: This component matches the original PHP agegate.php logic exactly
 */

import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
  /**
   * Event emitter for successful age verification
   * Emitted when user is 16+ years old
   * Parent component (age-gate) listens to this event
   */
  @Output() ageVerified = new EventEmitter<boolean>();
  
  /**
   * Event emitter for failed age verification
   * Emitted when user is under 16 years old
   * Parent component (age-gate) listens to this event
   */
  @Output() ageRejected = new EventEmitter<void>();
  
  /**
   * Input property to disable form submission
   * When true, form cannot be submitted (used when user has already been denied)
   */
  @Input() disabled: boolean = false;

  /**
   * Selected birth month (1-12, or 0 for placeholder)
   * Match PHP: value="0" selected="selected" for placeholder
   */
  month: number = 0; // Match PHP: value="0" selected="selected" for placeholder
  
  /**
   * Selected birth day (1-31, or 0 for placeholder)
   * Match PHP: value="0" selected="selected" for placeholder
   * Days list is dynamically updated based on selected month/year
   */
  day: number = 0;   // Match PHP: value="0" selected="selected" for placeholder
  
  /**
   * Selected birth year (current year down to 1925, or 0 for placeholder)
   * Match PHP: value="0" selected="selected" for placeholder
   */
  year: number = 0;  // Match PHP: value="0" selected="selected" for placeholder
  
  /**
   * Error message to display if validation fails
   * Shown when date is invalid or user is under 16
   */
  errorMessage: string = '';
  
  /**
   * Array of month options for the month dropdown
   * Contains value (1-12) and display name for each month
   */
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
  
  /**
   * Array of day options for the day dropdown
   * Dynamically populated based on selected month/year (1-31, varies by month)
   * Handles leap years (February has 29 days in leap years)
   */
  days: number[] = [];
  
  /**
   * Array of year options for the year dropdown
   * Populated in constructor with years from current year down to 1925
   */
  years: number[] = [];

  /**
   * Constructor - Dependency Injection and Year List Initialization
   * @param cookieService - Service for age calculation and date validation
   */
  constructor(
    private cookieService: CookieService
  ) {
    // Match PHP: Years from current year down to 1925 (as in original agegate.php)
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(1925, currentYear - 100); // Match original range (100 years back)
    // Populate years array in descending order (current year first)
    for (let i = currentYear; i >= startYear; i--) {
      this.years.push(i);
    }
  }

  /**
   * Component initialization lifecycle hook
   * Initializes the days list when component loads
   */
  ngOnInit(): void {
    this.updateDays();
  }

  /**
   * Handler for month dropdown change
   * Called when user selects a month
   * Updates the days list to reflect days in the selected month
   */
  onMonthChange(): void {
    // Ensure month is a number (Angular ngModel might return string)
    this.month = Number(this.month);
    this.updateDays();  // Recalculate days for the selected month
  }

  /**
   * Handler for year dropdown change
   * Called when user selects a year
   * Updates the days list (important for leap years - February has 29 days in leap years)
   */
  onYearChange(): void {
    // Ensure year is a number (Angular ngModel might return string)
    this.year = Number(this.year);
    this.updateDays();  // Recalculate days (handles leap year for February)
  }

  /**
   * Handler for day dropdown change
   * Called when user selects a day
   * Ensures day value is a number
   */
  onDayChange(): void {
    // Ensure day is a number (Angular ngModel might return string)
    this.day = Number(this.day);
  }

  /**
   * Updates the days array based on selected month and year
   * Handles different month lengths and leap years
   * 
   * LOGIC:
   * - If month not selected, clears days array
   * - If year not selected, uses current year for calculation
   * - Calculates days in selected month (handles leap years for February)
   * - Resets day selection if current day is invalid for the month
   */
  updateDays(): void {
    // If month is not selected, clear days array (no days to show)
    if (this.month === 0) {
      this.days = [];
      return;
    }
    
    // If year is not selected yet, use current year to calculate days
    // This allows days to show when only month is selected (better UX)
    const yearToUse = this.year === 0 ? new Date().getFullYear() : this.year;
    
    // Calculate days in the selected month
    // JavaScript Date trick: new Date(year, month, 0) gives the last day of the previous month
    // So new Date(year, month, 0).getDate() gives the number of days in the selected month
    // This automatically handles leap years (February has 29 days in leap years)
    const daysInMonth = new Date(yearToUse, this.month, 0).getDate();
    
    // Populate days array with numbers from 1 to daysInMonth
    this.days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }
    
    // If current day selection is invalid for the month, reset it
    // Example: User selects day 31, then changes month to February -> day 31 doesn't exist
    if (this.day > daysInMonth) {
      this.day = 0; // Reset to placeholder
    }
  }

  /**
   * Form submission handler
   * Validates date and calculates age
   * 
   * VALIDATION STEPS:
   * 1. Check if form is disabled (if so, prevent submission)
   * 2. Check all fields are selected (not 0)
   * 3. Check values are within valid ranges
   * 4. Check date is valid (e.g., Feb 30 doesn't exist)
   * 5. Calculate age
   * 6. If age >= 16, emit ageVerified event
   * 7. If age < 16, set cookie to 'no' and emit ageRejected event
   */
  onSubmit(): void {
    // Prevent submission if form is disabled (user has already been denied)
    if (this.disabled) {
      return;
    }
    this.errorMessage = '';

    // Ensure all values are numbers (Angular ngModel might return strings from dropdowns)
    const month = Number(this.month);
    const day = Number(this.day);
    const year = Number(this.year);

    // Match PHP: ctype_digit() validation - check if values are numeric and not 0
    // All fields must be selected (not placeholder value 0)
    if (month === 0 || day === 0 || year === 0 || isNaN(month) || isNaN(day) || isNaN(year)) {
      this.errorMessage = 'Please select a valid date.';
      return;
    }

    // Match PHP: Additional validation - ensure values are within valid ranges
    // Month: 1-12, Day: 1-31, Year: 1925 to current year
    if (month < 1 || month > 12 || day < 1 || day > 31 || 
        year < 1925 || year > new Date().getFullYear()) {
      this.errorMessage = 'Please enter a valid date.';
      return;
    }

    // Match PHP: Validate date exists (e.g., Feb 30 doesn't exist, Feb 29 only in leap years)
    // This catches invalid dates that pass the range check above
    if (!this.cookieService.isValidDate(year, month, day)) {
      this.errorMessage = 'Please enter a valid date.';
      return;
    }

    // Match PHP: Calculate age using exact same logic as original PHP agegate.php
    // Uses same formula: floor((time() - mktime(0,0,0,month,day,year)) / 31556926)
    const age = this.cookieService.calculateAge(year, month, day);

    // Match PHP: if($age_years >= 16)
    if (age >= 16) {
      // Age verification passed - emit success event
      // Don't set cookie yet - cookie will be set in age-gate component after terms are accepted
      // (Note: Terms acceptance step is currently bypassed, but this comment explains the original flow)
      this.ageVerified.emit(true);
    } else {
      // Age verification failed - user is under 16
      // Match PHP: setcookie('legal', 'no', time()+7200, '/');
      // Set cookie to 'no' to prevent user from bypassing age gate
      this.cookieService.setLegalCookie('no');
      this.ageRejected.emit();  // Emit rejection event (parent will redirect to error page)
    }
  }
}
