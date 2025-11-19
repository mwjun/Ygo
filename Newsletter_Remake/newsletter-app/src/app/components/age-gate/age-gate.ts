/**
 * FILE: age-gate.ts
 * 
 * PURPOSE:
 * Main age verification component that serves as the entry point for the newsletter application.
 * This component handles age verification logic and determines whether users can proceed to the signup page.
 * 
 * FEATURES:
 * - Age verification form display
 * - Cookie-based age verification state management
 * - Automatic redirect to signup page after verification
 * - Error page redirect for underage users
 * - Newsletter type configuration based on route
 * 
 * FLOW:
 * 1. Component initializes and checks current route
 * 2. On root path (/), always shows age gate (regardless of cookie)
 * 3. On other paths, checks for existing 'legal' cookie
 * 4. If cookie exists and is 'yes', redirects to signup
 * 5. If cookie exists and is 'no', redirects to error page
 * 6. If no cookie, shows age verification form
 * 7. After age verification, sets cookie and redirects to /home
 * 
 * SECURITY:
 * - Cookie-based verification prevents bypassing age gate
 * - Cookie expires after 2 hours
 * - Cookie is site-wide (path=/)
 */

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
  /**
   * Current newsletter type (dl, md, or tcg)
   * Determined from route or defaults to 'dl' for root path
   */
  newsletterType: NewsletterType | null = null;
  
  /**
   * Configuration object containing logo path, title, and content rating image path
   * Used to display appropriate branding and content rating based on newsletter type
   */
  config: { logoPath: string; title: string; contentRatingPath: string } | null = null;
  
  /**
   * Flag to show/hide terms acceptance component
   * Currently set to false as terms acceptance step is bypassed
   * Kept for potential future use
   */
  showTermsAcceptance: boolean = false;
  
  /**
   * Flag indicating if user has already been denied access (cookie='no')
   * When true, shows informational message and disables form submission
   */
  hasBeenDenied: boolean = false;

  /**
   * Constructor - Dependency Injection
   * @param cookieService - Service for managing age verification cookies
   * @param router - Angular router for navigation
   * @param newsletterConfig - Service for getting newsletter configuration
   */
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private newsletterConfig: NewsletterConfigService
  ) {}

  /**
   * Component initialization lifecycle hook
   * Handles route-based logic and cookie checking
   * 
   * LOGIC:
   * - Check for existing 'legal' cookie first (SECURITY: prevents bypassing age gate)
   * - If cookie is 'yes', redirect to signup page
   * - If cookie is 'no', redirect to error page (prevents retry attempts)
   * - If no cookie, show age gate form (first visit)
   * 
   * SECURITY:
   * - Always checks cookie, even on root path, to prevent users from pressing back button
   * - If user failed age verification (cookie='no'), they cannot retry until cookie expires (2 hours)
   */
  ngOnInit(): void {
    // Scroll to top of page when component loads
    window.scrollTo(0, 0);
    
    // Get current URL
    const url = this.router.url;
    
    // SECURITY: Always check cookie first, even on root path
    // This prevents users from bypassing age gate by pressing back button
    // Match PHP: if(isset($_COOKIE['legal']))
    const legalCookie = this.cookieService.getLegalCookie();
    
    if (legalCookie !== null) {
      // Cookie exists - check its value
      // Match PHP: $url = ($_COOKIE['legal'] == 'yes') ? 'index.php' : 'redirect.php';
      if (legalCookie === 'yes') {
        // User has already passed age verification - redirect to signup
        this.redirectToSignup();
        return;
      } else {
        // User has already failed age verification (under 16)
        // ARCHITECTURAL DECISION: Show age gate with informational message instead of redirect
        // This provides better UX while maintaining security (form will be disabled)
        // Users understand why they can't proceed and when they can retry
        this.hasBeenDenied = true;
        // Continue to show age gate form (but disabled) - don't return here
      }
    }
    
    // No cookie set - this is a first visit, show age gate form
    // Determine newsletter type from route or default to 'dl'
    if (url === '/' || url === '' || !url || url.trim() === '') {
      // Root path - default to 'dl'
      this.newsletterType = 'dl';
    } else {
      // Non-root path - determine from route
      this.newsletterType = this.newsletterConfig.getTypeFromRoute(url);
      
      // If we can't determine the newsletter type, default to 'dl' as fallback
      if (!this.newsletterType) {
        this.newsletterType = 'dl';
      }
    }
    
    // Set config for age gate display
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
    
    // Reset state to show age form (not terms acceptance)
    this.showTermsAcceptance = false;
  }

  /**
   * Handler for successful age verification
   * Called when user enters age >= 16 and accepts terms
   * 
   * ACTIONS:
   * 1. Sets 'legal' cookie to 'yes' (expires in 2 hours)
   * 2. Redirects to /home for newsletter signup
   * 
   * NOTE: Terms acceptance step is currently bypassed
   * The flow goes directly from age verification to signup page
   */
  onAgeVerified(): void {
    // Skip terms acceptance - go directly to newsletter signup
    this.cookieService.setLegalCookie('yes');
    this.router.navigate(['/home']); // Redirect to home for newsletter selection
    
    // COMMENTED OUT: Terms acceptance step (kept for future use)
    // this.showTermsAcceptance = true;
  }

  /**
   * Handler for failed age verification
   * Called when user enters age < 16 or declines terms
   * 
   * ACTIONS:
   * - Redirects to error page (/error)
   * - Error page displays "Access Denied" message
   */
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

  /**
   * Private helper method to redirect to appropriate signup page
   * Currently redirects to /home for unified signup page
   * 
   * NOTE: This method is kept for potential future use if individual
   * signup pages are re-implemented
   * 
   * @private
   */
  private redirectToSignup(): void {
    if (this.newsletterType) {
      const config = this.newsletterConfig.getConfig(this.newsletterType);
      this.router.navigate([config.routePath]);
    }
  }
}
