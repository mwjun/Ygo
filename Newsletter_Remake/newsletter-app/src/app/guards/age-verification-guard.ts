import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from '../services/cookie';

export const ageVerificationGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (!cookieService.isAgeVerified()) {
    // Redirect to age gate for the current newsletter
    const currentPath = state.url;
    if (currentPath.includes('/dl-signup')) {
      router.navigate(['/dl-signup/age-gate']);
    } else if (currentPath.includes('/md-signup')) {
      router.navigate(['/md-signup/age-gate']);
    } else if (currentPath.includes('/tcg-signup')) {
      router.navigate(['/tcg-signup/age-gate']);
    } else {
      router.navigate(['/']);
    }
    return false;
  }
  
  return true;
};
