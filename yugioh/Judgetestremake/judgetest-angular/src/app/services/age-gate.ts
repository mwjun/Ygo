import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * AgeGateService - Single Responsibility: Manage age verification
 * Loosely coupled: Uses browser storage, not dependent on components
 * Highly cohesive: All methods relate to age verification
 */
@Injectable({
  providedIn: 'root'
})
export class AgeGateService {
  
  private readonly AGE_VERIFICATION_KEY = 'session_token';
  private readonly MINIMUM_AGE = 16;
  private readonly API_BASE_URL = 'http://localhost:8000/api'; // Change to your backend URL
  
  constructor(private http: HttpClient) {}

  /**
   * Check if user has been age-verified
   */
  isAgeVerified(): boolean {
    if (typeof document === 'undefined') return false;
    
    const cookies = document.cookie.split(';');
    const legalCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.AGE_VERIFICATION_KEY}=`)
    );
    
    // If we have a session token, user is verified
    return !!legalCookie && legalCookie.includes('=');
  }

  /**
   * Verify user's age via backend API and set secure session
   * Connects to backend API: POST /api/auth/age-verification.php USING
   */
  verifyAge(birthDate: Date, language: string = 'en'): Observable<boolean> {
    const formattedDate = this.formatDate(birthDate);
    
    const payload = {
      birthDate: formattedDate,
      language: language
    };
    
    return this.http.post<any>(`${this.API_BASE_URL}/auth/age-verification.php`, payload)
      .pipe(
        map(response => {
          if (response.verified && response.sessionToken) {
            // Set secure session token cookie
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (response.expiresIn * 1000));
            
            document.cookie = `${this.AGE_VERIFICATION_KEY}=${response.sessionToken}; ` +
                             `expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
            
            return true;
          }
          
          return false;
        })
      );
  }
  
  /**
   * Format date to YYYY-MM-DD format
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
