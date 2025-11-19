/**
 * FILE: app.routes.ts
 * 
 * PURPOSE:
 * Defines the application's routing configuration for the Angular newsletter signup application.
 * This file maps URL paths to their corresponding components and applies route guards where necessary.
 * 
 * FEATURES:
 * - Age gate protection for protected routes
 * - Email verification route handling
 * - Subscription management routes (unsubscribe, preferences)
 * - Error page routing
 * - Wildcard route for 404 handling
 * 
 * ROUTE FLOW:
 * 1. Root path (/) -> AgeGateComponent (entry point, always shows age verification)
 * 2. /home -> HomeComponent (newsletter signup, protected by ageVerificationGuard)
 * 3. /verify -> SubscriptionConfirmedComponent (email verification link handler)
 * 4. /subscription-confirmed -> SubscriptionConfirmedComponent (post-signup confirmation)
 * 5. /unsubscribe -> UnsubscribedComponent (unsubscribe confirmation)
 * 6. /error -> ErrorComponent (age verification failure or access denied)
 * 
 * SECURITY:
 * - ageVerificationGuard protects routes that require age verification
 * - Guards check for 'legal' cookie before allowing access
 */

import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AgeGateComponent } from './components/age-gate/age-gate';
import { CategorySelectionComponent } from './components/category-selection/category-selection';
import { ErrorComponent } from './components/error/error';
import { SubscriptionConfirmedComponent } from './components/subscription-confirmed/subscription-confirmed';
import { UnsubscribedComponent } from './components/unsubscribed/unsubscribed';
import { ageVerificationGuard } from './guards/age-verification-guard';

/**
 * Application routes configuration
 * Each route defines a path, component, and optional guards
 */
export const routes: Routes = [
  /**
   * Root path - Age Gate Entry Point
   * This is the main entry point of the application.
   * Always shows the age verification form, regardless of cookie status.
   * Users must pass age verification before accessing other routes.
   */
  {
    path: '',
    component: AgeGateComponent,
    pathMatch: 'full'
  },
  
  /**
   * Category Selection Route (Currently unused but kept for future use)
   * Protected by ageVerificationGuard - requires age verification cookie
   */
  {
    path: 'category-selection',
    component: CategorySelectionComponent,
    canActivate: [ageVerificationGuard]
  },
  
  /**
   * Newsletter Signup Page
   * Protected by ageVerificationGuard - requires age verification cookie
   * Contains form for selecting newsletters, entering name/email, and submitting
   */
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ageVerificationGuard]
  },
  
  /**
   * Email Verification Route
   * Handles email verification links sent to users after signup.
   * Query parameters: email, type (newsletter type), token (verification token)
   * No guard required - verification token provides security
   */
  {
    path: 'verify',
    component: SubscriptionConfirmedComponent
  },
  
  /**
   * Subscription Confirmation Page
   * Shown after successful form submission (before email verification)
   * Also used by verification route to show confirmation after email click
   */
  {
    path: 'subscription-confirmed',
    component: SubscriptionConfirmedComponent
  },
  
  /**
   * Unsubscribe Route (Alternative path)
   * Handles unsubscribe requests from email links
   */
  {
    path: 'unsubscribe',
    component: UnsubscribedComponent
  },
  
  /**
   * Unsubscribed Confirmation Page
   * Shown after successful unsubscribe action
   */
  {
    path: 'unsubscribed',
    component: UnsubscribedComponent
  },
  
  /**
   * Error Page
   * Shown when age verification fails or access is denied
   */
  {
    path: 'error',
    component: ErrorComponent
  },
  
  /**
   * Wildcard Route - 404 Handler
   * Redirects any unmatched routes back to the age gate (root path)
   * This ensures users always land on the age gate if they navigate to invalid routes
   */
  {
    path: '**',
    redirectTo: ''
  }
];
