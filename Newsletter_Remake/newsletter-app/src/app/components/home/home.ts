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
  @ViewChild('captchaContainer', { static: false }) captchaContainer!: ElementRef;
  private captchaRendered = false;
  private captchaWidgetId: number | null = null;
  newsletters;
  selectedNewsletters: { [key: string]: boolean } = {
    'dl': false,
    'md': false,
    'tcg': false
  };
  firstName: string = '';
  email: string = '';
  privacyConsent: boolean = false;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  showCaptcha: boolean = false;
  captchaToken: string | null = null;
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

  toggleNewsletter(type: NewsletterType): void {
    this.selectedNewsletters[type] = !this.selectedNewsletters[type];
    // Clear error message when user selects a newsletter
    if (this.selectedNewsletters[type]) {
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    
    // Validate at least one newsletter is selected
    const hasSelected = this.selectedNewsletters['dl'] || 
                        this.selectedNewsletters['md'] || 
                        this.selectedNewsletters['tcg'];
    
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

  onCaptchaResolved(token: string): void {
    this.captchaToken = token;
    this.errorMessage = '';
    // CAPTCHA is complete - user can now click "Sign Up" to submit
    // Don't auto-submit - let user click the button
  }

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

  onCaptchaError(): void {
    this.captchaToken = null;
    this.errorMessage = 'CAPTCHA verification failed. Please try again.';
  }

  private submitForm(): void {
    // Store selected categories
    const categories: SelectedCategories = {
      dl: this.selectedNewsletters['dl'] || false,
      md: this.selectedNewsletters['md'] || false,
      tcg: this.selectedNewsletters['tcg'] || false
    };
    this.cookieService.setSelectedCategories(categories);

    // Submit to SendGrid for each selected newsletter
    this.isSubmitting = true;
    const submissions: Promise<any>[] = [];

    if (this.selectedNewsletters['dl']) {
      submissions.push(
        firstValueFrom(this.sendGridService.signup({
          email: this.email,
          newsletterType: 'dl',
          firstName: this.firstName,
          categories: categories
        }))
      );
    }

    if (this.selectedNewsletters['md']) {
      submissions.push(
        firstValueFrom(this.sendGridService.signup({
          email: this.email,
          newsletterType: 'md',
          firstName: this.firstName,
          categories: categories
        }))
      );
    }

    if (this.selectedNewsletters['tcg']) {
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
      if (this.selectedNewsletters['dl']) queryParams.dl = 'true';
      if (this.selectedNewsletters['md']) queryParams.md = 'true';
      if (this.selectedNewsletters['tcg']) queryParams.tcg = 'true';
      
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
