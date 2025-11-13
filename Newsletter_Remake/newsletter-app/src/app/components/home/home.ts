import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
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
      // Redirect to subscription confirmed page
      this.router.navigate(['/subscription-confirmed']);
    }).catch((error) => {
      this.isSubmitting = false;
      this.errorMessage = 'Failed to sign up. Please try again.';
      console.error('Signup error:', error);
    });
  }
}
