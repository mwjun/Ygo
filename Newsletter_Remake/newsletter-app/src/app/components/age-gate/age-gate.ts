import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookie';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { NewsletterType } from '../../models/newsletter-type';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';
import { NewsletterLogoComponent } from '../shared/newsletter-logo/newsletter-logo';
import { AgeFormComponent } from '../shared/age-form/age-form';
import { TermsAcceptanceComponent } from '../shared/terms-acceptance/terms-acceptance';

@Component({
  selector: 'app-age-gate',
  standalone: true,
  imports: [
    CommonModule,
    PageContainerComponent,
    HeaderComponent,
    FooterComponent,
    NewsletterLogoComponent,
    AgeFormComponent,
    TermsAcceptanceComponent
  ],
  templateUrl: './age-gate.html',
  styleUrl: './age-gate.css'
})
export class AgeGateComponent implements OnInit {
  newsletterType: NewsletterType | null = null;
  config: { logoPath: string; title: string; contentRatingPath: string } | null = null;
  showTermsAcceptance: boolean = false;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private newsletterConfig: NewsletterConfigService
  ) {}

  ngOnInit(): void {
    // First, determine the newsletter type from the current route
    const url = this.router.url;
    this.newsletterType = this.newsletterConfig.getTypeFromRoute(url);
    
    // If we can't determine the newsletter type, default to 'dl' as fallback
    if (!this.newsletterType) {
      this.newsletterType = 'dl';
    }
    
    // Match PHP: if(isset($_COOKIE['legal']))
    const legalCookie = this.cookieService.getLegalCookie();
    
    if (legalCookie !== null) {
      // Match PHP: $url = ($_COOKIE['legal'] == 'yes') ? 'index.php' : 'redirect.php';
      if (legalCookie === 'yes') {
        this.redirectToSignup();
        return;
      } else {
        // Match PHP: redirect to redirect.php (error page)
        this.router.navigate(['/error']);
        return;
      }
    }

    // No cookie set, show age gate form
    // Always set config since we have a fallback newsletterType
    const config = this.newsletterConfig.getConfig(this.newsletterType);
    // TCG uses cr-tcg.png, others use cr-digital.png
    const contentRatingPath = this.newsletterType === 'tcg' 
      ? 'assets/tcg-signup/img/cr-tcg.png'
      : `assets/${this.newsletterType}-signup/img/cr-digital.png`;
    this.config = {
      logoPath: config.logoPath,
      title: config.title,
      contentRatingPath: contentRatingPath
    };
  }

  onAgeVerified(): void {
    // Show terms acceptance instead of immediately redirecting
    this.showTermsAcceptance = true;
  }

  onAgeRejected(): void {
    this.router.navigate(['/error']);
  }

  onTermsAccepted(): void {
    // Set cookie and proceed to signup only after terms are accepted
    this.cookieService.setLegalCookie('yes');
    this.redirectToSignup();
  }

  onTermsDeclined(): void {
    // If user declines terms, redirect to error page
    this.router.navigate(['/error']);
  }

  private redirectToSignup(): void {
    if (this.newsletterType) {
      const config = this.newsletterConfig.getConfig(this.newsletterType);
      this.router.navigate([config.routePath]);
    }
  }
}
