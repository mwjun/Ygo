import { Injectable } from '@angular/core';

/**
 * AgeGateService - Single Responsibility: Manage age verification
 * Loosely coupled: Uses browser storage, not dependent on components
 * Highly cohesive: All methods relate to age verification
 */
@Injectable({
  providedIn: 'root'
})
export class AgeGateService {
  
  private readonly AGE_VERIFICATION_KEY = 'legal';
  private readonly MINIMUM_AGE = 16;

  /**
   * Check if user has been age-verified
   */
  isAgeVerified(): boolean {
    if (typeof document === 'undefined') return false;
    
    const cookies = document.cookie.split(';');
    const legalCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.AGE_VERIFICATION_KEY}=`)
    );
    
    return legalCookie?.includes('yes') ?? false;
  }

  /**
   * Verify user's age and set cookie
   */
  verifyAge(birthDate: Date): boolean {
    const age = this.calculateAge(birthDate);
    const isOfAge = age >= this.MINIMUM_AGE;
    
    // Set cookie for 2 hours
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (2 * 60 * 60 * 1000));
    
    document.cookie = `${this.AGE_VERIFICATION_KEY}=${isOfAge ? 'yes' : 'no'}; ` +
                     `expires=${expiryDate.toUTCString()}; path=/`;
    
    return isOfAge;
  }

  /**
   * Calculate age from birth date
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Clear age verification (for testing/logout)
   */
  clearVerification(): void {
    document.cookie = `${this.AGE_VERIFICATION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Get minimum required age
   */
  getMinimumAge(): number {
    return this.MINIMUM_AGE;
  }
}
