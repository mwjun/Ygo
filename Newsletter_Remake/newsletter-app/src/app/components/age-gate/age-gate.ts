import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookie';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { NewsletterType } from '../../models/newsletter-type';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';
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
    // Get current URL
    const url = this.router.url;
    
    // CRITICAL: On root path, ALWAYS show age gate - NEVER redirect
    // This is the main entry point and must always display the age gate
    if (url === '/' || url === '' || !url || url.trim() === '') {
      // Set default newsletter type for root path
      this.newsletterType = 'dl';
      
      // Always set config for root path - this ensures the template renders
      const config = this.newsletterConfig.getConfig(this.newsletterType);
      const contentRatingPath = `assets/${this.newsletterType}-signup/img/cr-digital.png`;
      this.config = {
        logoPath: config.logoPath,
        title: config.title,
        contentRatingPath: contentRatingPath
      };
      
      // Reset state to show age form (not terms acceptance)
      this.showTermsAcceptance = false;
      
      // DO NOT check cookie on root path - always show age gate
      // DO NOT redirect - this is the entry point
      return;
    }
    
    // For non-root paths (like /dl-signup/age-gate), determine newsletter type and check cookie
    this.newsletterType = this.newsletterConfig.getTypeFromRoute(url);
    
    // If we can't determine the newsletter type, default to 'dl' as fallback
    if (!this.newsletterType) {
      this.newsletterType = 'dl';
    }
    
    // Match PHP: if(isset($_COOKIE['legal']))
    const legalCookie = this.cookieService.getLegalCookie();
    
    // Only redirect if NOT on root path
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
    // Skip terms acceptance - go directly to newsletter signup
    this.cookieService.setLegalCookie('yes');
    this.router.navigate(['/home']); // Redirect to home for newsletter selection
    
    // COMMENTED OUT: Terms acceptance step (kept for future use)
    // this.showTermsAcceptance = true;
  }

  onAgeRejected(): void {
    this.router.navigate(['/error']);
  }

  // COMMENTED OUT: Terms acceptance methods (kept for future use)
  // onTermsAccepted(): void {
  //   // Set cookie
  //   this.cookieService.setLegalCookie('yes');
  //   
  //   // Redirect to newsletter selection page where user can select categories
  //   this.router.navigate(['/home']);
  // }

  // onTermsDeclined(): void {
  //   // If user declines terms, redirect to error page
  //   this.router.navigate(['/error']);
  // }

  private redirectToSignup(): void {
    if (this.newsletterType) {
      const config = this.newsletterConfig.getConfig(this.newsletterType);
      this.router.navigate([config.routePath]);
    }
  }
}
