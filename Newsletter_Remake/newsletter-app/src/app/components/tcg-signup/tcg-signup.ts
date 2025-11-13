import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookie';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { SendGridService } from '../../services/sendgrid';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';
import { NewsletterLogoComponent } from '../shared/newsletter-logo/newsletter-logo';
import { FormContainerComponent } from '../shared/form-container/form-container';
import { LegalTextComponent } from '../shared/legal-text/legal-text';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tcg-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageContainerComponent,
    HeaderComponent,
    FooterComponent,
    NewsletterLogoComponent,
    FormContainerComponent,
    LegalTextComponent
  ],
  templateUrl: './tcg-signup.html',
  styleUrl: './tcg-signup.css'
})
export class TcgSignupComponent implements OnInit {
  config;
  showEmailPrompt: boolean = false;
  userEmail: string = '';
  emailStatus: 'success' | 'error' | null = null;
  emailMessage: string = '';

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private newsletterConfig: NewsletterConfigService,
    private sendGridService: SendGridService
  ) {
    this.config = this.newsletterConfig.getConfig('tcg');
  }

  ngOnInit(): void {
    // Check if age is verified - if not, redirect to main age gate
    if (!this.cookieService.isAgeVerified()) {
      this.router.navigate(['/']);
      return;
    }

    setTimeout(() => {
      this.showEmailPrompt = true;
    }, 5000);
  }

  onFormSubmitted(event: { email: string; newsletterType: string }): void {
    // After form submission, redirect to newsletter selection page
    // The newsletter selection page will handle the actual signup with SendGrid
    this.router.navigate(['/home']);
  }

  sendConfirmationEmail(): void {
    // Validate and sanitize email input
    const email = this.userEmail?.trim().toLowerCase() || '';
    
    if (!email || !email.includes('@')) {
      this.emailStatus = 'error';
      this.emailMessage = 'Please enter a valid email address';
      return;
    }
    
    // Additional validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      this.emailStatus = 'error';
      this.emailMessage = 'Please enter a valid email address';
      return;
    }
    
    this.sendConfirmationEmailForEmail(email);
  }

  private sendConfirmationEmailForEmail(email: string): void {
    this.emailStatus = null;
    this.emailMessage = 'Sending confirmation email...';

    // Get selected categories from cookie
    const categories = this.cookieService.getSelectedCategories();

    this.sendGridService.signup({
      email: email,
      newsletterType: 'tcg',
      categories: categories || undefined
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.emailStatus = 'success';
          this.emailMessage = 'Confirmation email sent successfully!';
          this.showEmailPrompt = false;
        } else {
          this.emailStatus = 'error';
          this.emailMessage = response.error || 'Failed to send email';
        }
      },
      error: (error) => {
        this.emailStatus = 'error';
        this.emailMessage = 'Failed to send confirmation email. Please try again later.';
        console.error('SendGrid error:', error);
      }
    });
  }
}
