/**
 * FILE: cookie.ts
 * 
 * PURPOSE:
 * Service for managing browser cookies used for age verification and newsletter category selection.
 * This service provides a centralized way to set, get, and validate cookies throughout the application.
 * 
 * FEATURES:
 * - Age verification cookie management ('legal' cookie)
 * - Newsletter category selection cookie management
 * - Age calculation from birth date (matches PHP logic)
 * - Date validation
 * - Cookie expiration handling (2-hour expiry)
 * 
 * COOKIES USED:
 * 1. 'legal' - Stores age verification status ('yes' or 'no')
 *    - Expires: 2 hours
 *    - Path: / (site-wide)
 * 
 * 2. 'newsletter_categories' - Stores selected newsletter categories as JSON
 *    - Format: { dl: boolean, md: boolean, tcg: boolean }
 *    - Expires: 2 hours
 *    - Path: / (site-wide)
 * 
 * SECURITY:
 * - Cookies are HTTP-only compatible (though not set as such here)
 * - Cookie values are validated before use
 * - Expiration prevents stale data
 */

import { Injectable } from '@angular/core';

/**
 * Interface defining the structure of selected newsletter categories
 * Used for type safety when storing/retrieving category selections
 */
export interface SelectedCategories {
  dl: boolean;  // Duel Links newsletter
  md: boolean;  // Master Duel newsletter
  tcg: boolean; // Trading Card Game newsletter
}

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly COOKIE_NAME = 'legal';
  private readonly CATEGORIES_COOKIE_NAME = 'newsletter_categories';
  private readonly COOKIE_EXPIRY_HOURS = 2;
  private categoriesCache: SelectedCategories | null = null;

  /**
   * Set the legal cookie (age verification)
   * SECURITY: Adds Secure and SameSite flags for production
   * Note: HttpOnly cannot be set from JavaScript - must be set server-side
   * @param value 'yes' if age verified, 'no' if not
   */
  setLegalCookie(value: 'yes' | 'no'): void {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (this.COOKIE_EXPIRY_HOURS * 60 * 60 * 1000));
    const expires = `expires=${expiryDate.toUTCString()}`;
    
    // SECURITY: Add Secure flag if HTTPS, SameSite for CSRF protection
    const isSecure = window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';
    const sameSiteFlag = '; SameSite=Strict'; // CSRF protection
    
    document.cookie = `${this.COOKIE_NAME}=${value}; ${expires}; path=/${secureFlag}${sameSiteFlag}`;
  }

  /**
   * Get the legal cookie value
   * @returns 'yes', 'no', or null if not set
   */
  getLegalCookie(): 'yes' | 'no' | null {
    const name = this.COOKIE_NAME + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        const value = cookie.substring(name.length, cookie.length);
        return value === 'yes' ? 'yes' : value === 'no' ? 'no' : null;
      }
    }
    return null;
  }

  /**
   * Check if user has passed age verification
   * @returns true if legal cookie is 'yes', false otherwise
   */
  isAgeVerified(): boolean {
    return this.getLegalCookie() === 'yes';
  }

  /**
   * Calculate age from birth date
   * Matches PHP logic: mktime(0,0,0,month,day,year) and floor(diff / 31556926)
   * @param year Birth year
   * @param month Birth month (1-12)
   * @param day Birth day
   * @returns Age in years
   */
  calculateAge(year: number, month: number, day: number): number {
    // Match PHP mktime(0, 0, 0, month, day, year) - creates timestamp at midnight
    const birthDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const birthstamp = birthDate.getTime() / 1000; // Convert to Unix timestamp (seconds)
    
    // Match PHP time() - current Unix timestamp
    const now = Math.floor(Date.now() / 1000);
    
    // Match PHP: $diff = time() - $birthstamp
    const diff = now - birthstamp;
    
    // Match PHP: $age_years = floor($diff / 31556926)
    // 31556926 = seconds in a year (365.25 days)
    const age_years = Math.floor(diff / 31556926);
    
    return age_years;
  }

  /**
   * Validate date
   * @param year Year
   * @param month Month (1-12)
   * @param day Day
   * @returns true if valid date, false otherwise
   */
  isValidDate(year: number, month: number, day: number): boolean {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
  }

  /**
   * Set selected newsletter categories in cookie
   * SECURITY: Adds Secure and SameSite flags for production
   * @param categories Selected categories
   */
  setSelectedCategories(categories: SelectedCategories): void {
    this.categoriesCache = { ...categories };
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (this.COOKIE_EXPIRY_HOURS * 60 * 60 * 1000));
    const expires = `expires=${expiryDate.toUTCString()}`;
    const categoriesJson = JSON.stringify(categories);
    
    // SECURITY: Add Secure flag if HTTPS, SameSite for CSRF protection
    const isSecure = window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';
    const sameSiteFlag = '; SameSite=Strict'; // CSRF protection
    
    document.cookie = `${this.CATEGORIES_COOKIE_NAME}=${encodeURIComponent(categoriesJson)}; ${expires}; path=/${secureFlag}${sameSiteFlag}`;
  }

  /**
   * Get selected newsletter categories from cookie
   * @returns Selected categories or null if not set
   */
  getSelectedCategories(): SelectedCategories | null {
    if (this.categoriesCache) {
      return { ...this.categoriesCache };
    }

    const name = this.CATEGORIES_COOKIE_NAME + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        const value = cookie.substring(name.length, cookie.length);
        try {
          const categories = JSON.parse(decodeURIComponent(value));
          this.categoriesCache = categories;
          return { ...categories };
        } catch (e) {
          console.error('Error parsing categories cookie:', e);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Clear selected categories cookie
   */
  clearSelectedCategories(): void {
    this.categoriesCache = null;
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() - 1000);
    const expires = `expires=${expiryDate.toUTCString()}`;
    document.cookie = `${this.CATEGORIES_COOKIE_NAME}=; ${expires}; path=/`;
  }
}
