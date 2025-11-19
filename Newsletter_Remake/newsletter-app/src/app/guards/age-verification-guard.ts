/**
 * FILE: age-verification-guard.ts
 * 
 * PURPOSE:
 * Route guard that protects routes requiring age verification.
 * Prevents users from accessing protected pages without passing the age gate.
 * 
 * FEATURES:
 * - Checks for 'legal' cookie with value 'yes'
 * - Redirects to age gate (/) if verification fails
 * - Returns false to block route access if not verified
 * 
 * USAGE:
 * Applied to routes in app.routes.ts using canActivate property
 * 
 * PROTECTED ROUTES:
 * - /home (newsletter signup page)
 * - /category-selection (future use)
 * 
 * SECURITY:
 * - Cookie-based verification prevents URL manipulation
 * - Automatic redirect ensures users can't bypass age gate
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from '../services/cookie';

/**
 * Route guard function that checks age verification status
 * 
 * LOGIC:
 * 1. Injects CookieService to check for 'legal' cookie
 * 2. If cookie is 'yes', allows route access (returns true)
 * 3. If cookie is missing or 'no', redirects to age gate and blocks access
 * 
 * @param route - Activated route snapshot
 * @param state - Router state snapshot
 * @returns true if age verified, false otherwise (triggers redirect)
 */
export const ageVerificationGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (!cookieService.isAgeVerified()) {
    // Redirect to age gate (root path)
    router.navigate(['/']);
    return false;
  }
  
  return true;
};
