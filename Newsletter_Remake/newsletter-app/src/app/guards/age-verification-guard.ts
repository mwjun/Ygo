import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from '../services/cookie';

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
