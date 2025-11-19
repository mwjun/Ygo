/**
 * FILE: subscription-confirmed.ts
 * 
 * PURPOSE:
 * Component that displays subscription confirmation messages.
 * Handles two scenarios:
 * 1. After form submission (before email verification) - "Thank You for Signing Up!"
 * 2. After email verification (after clicking email link) - "Subscription Confirmed!" with checkmark
 * 
 * FEATURES:
 * - Differentiates between signup and verification states
 * - Handles email verification via backend API
 * - Displays appropriate message based on state
 * - Error handling for verification failures
 * 
 * FLOW:
 * 1. Component initializes and checks query parameters
 * 2. If email, type, token params exist -> verification flow
 * 3. If no params -> signup confirmation flow
 * 4. Verification calls backend API to verify subscription
 * 5. Shows success or error message based on result
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-subscription-confirmed',
  standalone: true,
  imports: [CommonModule, RouterModule, PageContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './subscription-confirmed.html',
  styleUrl: './subscription-confirmed.css'
})
export class SubscriptionConfirmedComponent implements OnInit, OnDestroy {
  /**
   * Flag indicating verification is in progress
   * Set to true when calling backend API to verify subscription
   * Shows "Verifying your subscription..." message
   */
  isVerifying: boolean = false;
  
  /**
   * Error message if verification fails
   * Empty string if no error
   */
  verificationError: string = '';
  
  /**
   * Flag indicating if page was accessed via email verification link
   * True: Has query params (email, type, token) - shows "Subscription Confirmed!" with checkmark
   * False: No query params - shows "Thank You for Signing Up!" (no checkmark)
   */
  isFromVerification: boolean = false; // True if accessed via email verification link

  /**
   * Constructor - Dependency Injection
   * @param route - ActivatedRoute for accessing query parameters
   * @param router - Router for navigation
   * @param http - HttpClient for making API calls
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Component initialization lifecycle hook
   * Checks query parameters to determine if this is a verification request or signup confirmation
   * 
   * LOGIC:
   * - Scrolls page to top
   * - Checks for email, type, token query parameters
   * - If all params exist -> verification flow (calls backend API)
   * - If no params -> signup confirmation flow (just shows message)
   */
  ngOnInit(): void {
    // Scroll to top - ensures user always starts at top of page
    window.scrollTo(0, 0);

    // Check if this is a verification request (has email, type, token params)
    this.route.queryParams.subscribe(params => {
      const email = params['email'];    // Email address from verification link
      const type = params['type'];      // Newsletter type ('dl', 'md', 'tcg') from verification link
      const token = params['token'];     // Verification token from verification link

      // If verification params exist, this is from email verification link
      if (email && type && token) {
        this.isFromVerification = true;
        this.verifySubscription(email, type, token);  // Call backend to verify subscription
      } else {
        // No verification params - this is from signup form submission
        this.isFromVerification = false;
      }
    });
  }

  /**
   * Private method to verify subscription via backend API
   * Called when user clicks verification link in email
   * 
   * PROCESS:
   * 1. Sets isVerifying flag to show loading message
   * 2. Determines backend URL (localhost vs ngrok/production)
   * 3. Calls /api/newsletter/verify endpoint with email, type, token
   * 4. On success: Shows "Subscription Confirmed!" message
   * 5. On error: Shows error message
   * 
   * @param {string} email - User's email address
   * @param {string} type - Newsletter type ('dl', 'md', 'tcg')
   * @param {string} token - Verification token from email link
   * @private
   */
  private async verifySubscription(email: string, type: string, token: string): Promise<void> {
    // Set verification state to show loading message
    this.isVerifying = true;
    this.verificationError = '';

    try {
      // Determine backend URL based on environment
      // Use relative path - Angular dev server proxy will forward to backend
      // When accessed through ngrok, the proxy will handle forwarding to localhost:3001
      const backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'  // Direct connection when on localhost
        : ''; // Use relative path when accessed through ngrok (proxy handles it)

      // Call backend verification API
      // Backend will verify the token and mark subscription as verified
      const response = await firstValueFrom(
        this.http.get<any>(`${backendUrl}/api/newsletter/verify`, {
          params: { email, type, token }  // Pass verification parameters as query params
        })
      );

      if (response.success) {
        // Verification successful - already on confirmation page, just show success message
        // isFromVerification is already true, so template will show "Subscription Confirmed!" with checkmark
        this.isVerifying = false;
      } else {
        // Verification failed - show error message
        this.verificationError = response.error || 'Verification failed';
        this.isVerifying = false;
      }
    } catch (error: any) {
      // Handle network errors or API errors
      console.error('Verification error:', error);
      this.verificationError = error?.error?.error || 'Failed to verify subscription. Please try again.';
      this.isVerifying = false;
    }
  }

  /**
   * Component destruction lifecycle hook
   * Called when component is destroyed
   * Currently no cleanup needed, but kept for potential future use
   */
  ngOnDestroy(): void {
    // Cleanup if needed
  }
}

