import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AgeGateService } from '../services/age-gate';

/**
 * AgeVerificationGuard - Functional guard following Angular best practices
 * Protects routes that require age verification
 * Loosely coupled: Uses service injection, not tightly bound to components
 */
export const ageVerificationGuard: CanActivateFn = (route, state) => {
  const ageGateService = inject(AgeGateService);
  const router = inject(Router);

  if (ageGateService.isAgeVerified()) {
    return true;
  }

  // Redirect to age gate with return URL
  router.navigate(['/age-gate'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
