/**
 * FILE: home.ts
 * 
 * PURPOSE:
 * Main newsletter signup component that handles the complete signup flow including:
 * - Newsletter category selection (Duel Links, Master Duel, TCG)
 * - User information collection (name, email)
 * - Privacy policy consent
 * - Google reCAPTCHA verification
 * - SendGrid API integration for subscription management
 * 
 * FEATURES:
 * - Multi-newsletter selection with visual cards
 * - Form validation (required fields, email format, at least one newsletter)
 * - Google reCAPTCHA v2 integration (appears after form completion)
 * - SendGrid API calls for each selected newsletter
 * - Cookie-based category storage
 * - Error handling with user-friendly messages
 * 
 * FLOW:
 * 1. User selects newsletter categories (checkboxes)
 * 2. User enters first name and email
 * 3. User accepts privacy policy
 * 4. User clicks "Sign Up"
 * 5. CAPTCHA appears (if not shown yet)
 * 6. User completes CAPTCHA
 * 7. User clicks "Sign Up Now" again
 * 8. Form submits to SendGrid for each selected newsletter
 * 9. Redirects to confirmation page
 * 
 * SECURITY:
 * - Protected by ageVerificationGuard (requires age verification cookie)
 * - Google reCAPTCHA prevents bot submissions
 * - Input sanitization on backend
 * - Rate limiting on backend API
 */

import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { NewsletterType } from '../../models/newsletter-type';
import { CookieService } from '../../services/cookie';
import { SelectedCategories } from '../../services/cookie';
import { SendGridService } from '../../services/sendgrid';
import { firstValueFrom } from 'rxjs';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, PageContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewChecked {
  /**
   * ViewChild reference to the CAPTCHA container element
   * Used to render the Google reCAPTCHA widget
   */
  @ViewChild('captchaContainer', { static: false }) captchaContainer!: ElementRef;
  
  /**
   * Flag to track if CAPTCHA has been rendered
   * Prevents multiple render attempts
   */
  private captchaRendered = false;
  
  /**
   * Google reCAPTCHA widget ID
   * Used to reset or interact with the CAPTCHA widget
   */
  private captchaWidgetId: number | null = null;
  
  /**
   * Array of newsletter configurations
   * Contains logo paths, titles, and types for all available newsletters
   */
  newsletters;
  
  /**
   * Object tracking which newsletters are selected
   * Keys: 'dl', 'md', 'tcg'
   * Values: 'Yes' if selected, 'No' if not selected
   */
  selectedNewsletters: { [key: string]: 'Yes' | 'No' } = {
    'dl': 'No',
    'md': 'No',
    'tcg': 'No'
  };
  
  /**
   * User's first name (form input)
   */
  firstName: string = '';
  
  /**
   * User's email address (form input)
   */
  email: string = '';
  
  /**
   * Privacy policy consent checkbox state
   * Must be true to submit form
   */
  privacyConsent: boolean = false;
  
  /**
   * Error message to display to user
   * Shown when validation fails or API call fails
   */
  errorMessage: string = '';
  
  /**
   * Flag indicating form submission is in progress
   * Used to disable submit button and show loading state
   */
  isSubmitting: boolean = false;
  
  /**
   * Flag to show/hide CAPTCHA widget
   * Set to true after user fills form and clicks "Sign Up"
   */
  showCaptcha: boolean = false;
  
  /**
   * CAPTCHA verification token
   * Set when user successfully completes CAPTCHA
   * Required before final form submission
   */
  captchaToken: string | null = null;
  
  /**
   * Google reCAPTCHA v2 site key
   * NOTE: This is a TEST key that only works on localhost
   * For production, replace with your actual reCAPTCHA site key
   */
  readonly RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google reCAPTCHA test key (works on localhost only)

  constructor(
    private newsletterConfig: NewsletterConfigService,
    private router: Router,
    private cookieService: CookieService,
    private sendGridService: SendGridService
  ) {
    this.newsletters = this.newsletterConfig.getAllConfigs();
  }

  ngOnInit(): void {
    // Scroll to top of page when component loads
    window.scrollTo(0, 0);
    
    // Check if age is verified
    if (!this.cookieService.isAgeVerified()) {
      this.router.navigate(['/']);
      return;
    }

    // Expose CAPTCHA callbacks to window for reCAPTCHA to call
    (window as any).onCaptchaResolved = (token: string) => this.onCaptchaResolved(token);
    (window as any).onCaptchaExpired = () => this.onCaptchaExpired();
    (window as any).onCaptchaError = () => this.onCaptchaError();
  }

  /**
   * Handler for newsletter Yes/No dropdown change
   * Called when user changes the dropdown selection for a newsletter
   * 
   * @param type - Newsletter type ('dl', 'md', or 'tcg')
   * @param event - Change event from the select dropdown
   */
  onNewsletterChange(type: NewsletterType, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value as 'Yes' | 'No';
    this.selectedNewsletters[type] = value;
    // Clear error message when user selects "Yes" for a newsletter
    if (value === 'Yes') {
      this.errorMessage = '';
    }
  }

  /**
   * Form submission handler
   * Validates form inputs and manages CAPTCHA flow
   * 
   * VALIDATION STEPS:
   * 1. Check at least one newsletter is selected
   * 2. Check privacy consent is accepted
   * 3. If CAPTCHA not shown, show it and wait
   * 4. If CAPTCHA shown but not completed, show error
   * 5. If all validations pass, submit form
   */
  onSubmit(): void {
    this.errorMessage = '';
    
        // Validate at least one newsletter is selected
        const hasSelected = this.selectedNewsletters['dl'] === 'Yes' || 
                            this.selectedNewsletters['md'] === 'Yes' || 
                            this.selectedNewsletters['tcg'] === 'Yes';
    
    if (!hasSelected) {
      this.errorMessage = 'Please select at least one newsletter.';
      return;
    }

    if (!this.privacyConsent) {
      this.errorMessage = 'You must agree to the Privacy Policy and Terms of Use.';
      return;
    }

    // If CAPTCHA is not shown yet, show it and wait for user to complete it
    if (!this.showCaptcha) {
      this.showCaptcha = true;
      this.captchaRendered = false;
      // Scroll to CAPTCHA after it renders
      setTimeout(() => {
        const captchaElement = document.querySelector('.g-recaptcha');
        if (captchaElement) {
          captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return;
    }

    // If CAPTCHA is shown but not completed
    if (!this.captchaToken) {
      this.errorMessage = 'Please complete the CAPTCHA verification.';
      return;
    }

    // All validations passed, proceed with submission
    this.submitForm();
  }

  /**
   * Callback when CAPTCHA is successfully completed
   * Called by Google reCAPTCHA widget
   * 
   * @param token - CAPTCHA verification token from Google
   */
  onCaptchaResolved(token: string): void {
    this.captchaToken = token;
    this.errorMessage = '';
    // CAPTCHA is complete - user can now click "Sign Up" to submit
    // Don't auto-submit - let user click the button
  }

  /**
   * Angular lifecycle hook called after view is checked
   * Used to render CAPTCHA widget when it becomes visible
   * 
   * LOGIC:
   * - Checks if CAPTCHA should be shown and hasn't been rendered
   * - Waits for grecaptcha library to be available
   * - Renders CAPTCHA widget with callbacks
   */
  ngAfterViewChecked(): void {
    // Render CAPTCHA when it becomes visible
    if (this.showCaptcha && !this.captchaRendered && this.captchaContainer) {
      const recaptchaElement = this.captchaContainer.nativeElement.querySelector('.g-recaptcha');
      if (recaptchaElement && (window as any).grecaptcha) {
        try {
          this.captchaWidgetId = (window as any).grecaptcha.render(recaptchaElement, {
            'sitekey': this.RECAPTCHA_SITE_KEY,
            'callback': (token: string) => this.onCaptchaResolved(token),
            'expired-callback': () => this.onCaptchaExpired(),
            'error-callback': () => this.onCaptchaError()
          });
          this.captchaRendered = true;
        } catch (e) {
          console.error('Error rendering CAPTCHA:', e);
        }
      }
    }
  }

  /**
   * Callback when CAPTCHA expires
   * Called by Google reCAPTCHA widget when token expires
   * Resets the CAPTCHA widget so user can try again
   */
  onCaptchaExpired(): void {
    this.captchaToken = null;
    // Reset CAPTCHA widget
    if ((window as any).grecaptcha && this.captchaWidgetId !== null) {
      try {
        (window as any).grecaptcha.reset(this.captchaWidgetId);
      } catch (e) {
        console.error('Error resetting CAPTCHA:', e);
      }
    }
  }

  /**
   * Callback when CAPTCHA encounters an error
   * Called by Google reCAPTCHA widget on error
   * Clears token and shows error message
   */
  onCaptchaError(): void {
    this.captchaToken = null;
    this.errorMessage = 'CAPTCHA verification failed. Please try again.';
  }

  /**
   * Private method to submit form data to SendGrid
   * Called after all validations pass and CAPTCHA is completed
   * 
   * PROCESS:
   * 1. Store selected categories in cookie
   * 2. Create API calls for each selected newsletter
   * 3. Submit all requests in parallel using Promise.all
   * 4. On success, redirect to confirmation page
   * 5. On error, display user-friendly error message
   * 
   * @private
   */
  private submitForm(): void {
    // Store selected categories (convert 'Yes'/'No' to boolean for cookie service)
    const categories: SelectedCategories = {
      dl: this.selectedNewsletters['dl'] === 'Yes',
      md: this.selectedNewsletters['md'] === 'Yes',
      tcg: this.selectedNewsletters['tcg'] === 'Yes'
    };
    this.cookieService.setSelectedCategories(categories);

    // Submit to SendGrid for each selected newsletter
    this.isSubmitting = true;
    const submissions: Promise<any>[] = [];

    if (this.selectedNewsletters['dl'] === 'Yes') {
      submissions.push(
        firstValueFrom(this.sendGridService.signup({
          email: this.email,
          newsletterType: 'dl',
          firstName: this.firstName,
          categories: categories
        }))
      );
    }

    if (this.selectedNewsletters['md'] === 'Yes') {
      submissions.push(
        firstValueFrom(this.sendGridService.signup({
          email: this.email,
          newsletterType: 'md',
          firstName: this.firstName,
          categories: categories
        }))
      );
    }

    if (this.selectedNewsletters['tcg'] === 'Yes') {
      submissions.push(
        firstValueFrom(this.sendGridService.signup({
          email: this.email,
          newsletterType: 'tcg',
          firstName: this.firstName,
          categories: categories
        }))
      );
    }

    // Wait for all submissions
    Promise.all(submissions).then(() => {
      this.isSubmitting = false;
      // Build query params for selected newsletters
      const queryParams: any = {};
      if (this.selectedNewsletters['dl'] === 'Yes') queryParams.dl = 'true';
      if (this.selectedNewsletters['md'] === 'Yes') queryParams.md = 'true';
      if (this.selectedNewsletters['tcg'] === 'Yes') queryParams.tcg = 'true';
      
      // Redirect to subscription confirmed page with selected newsletters
      this.router.navigate(['/subscription-confirmed'], { queryParams });
    }).catch((error) => {
      this.isSubmitting = false;
      console.error('Signup error details:', error);
      
      // Provide more specific error messages
      if (error?.error?.error) {
        this.errorMessage = `Signup failed: ${error.error.error}`;
      } else if (error?.status === 0 || error?.message?.includes('HttpErrorResponse')) {
        this.errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 3001.';
      } else if (error?.status === 400) {
        this.errorMessage = error.error?.error || 'Invalid request. Please check your information.';
      } else if (error?.status === 500) {
        this.errorMessage = 'Server error. Please try again later.';
      } else {
        this.errorMessage = `Failed to sign up: ${error?.message || 'Unknown error'}. Please try again.`;
      }
    });
  }
}
