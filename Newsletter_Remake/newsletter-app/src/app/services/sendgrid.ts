/**
 * FILE: sendgrid.ts
 * 
 * PURPOSE:
 * Angular service for communicating with the backend SendGrid API.
 * Handles newsletter signup requests and manages API URL configuration based on environment.
 * 
 * FEATURES:
 * - Dynamic API URL resolution (localhost vs production/ngrok)
 * - HTTP POST requests to backend signup endpoint
 * - Type-safe request/response interfaces
 * - Automatic proxy handling for ngrok/localhost scenarios
 * 
 * API ENDPOINT:
 * - POST /api/newsletter/signup
 * 
 * ENVIRONMENT HANDLING:
 * - localhost/127.0.0.1: Direct connection to http://localhost:3001
 * - ngrok/production: Uses relative path (/api/newsletter/signup)
 *   Angular dev server proxy forwards /api/* to localhost:3001
 * 
 * USAGE:
 * - Inject SendGridService into components
 * - Call signup() method with NewsletterSignupRequest
 * - Handle Observable response
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsletterType } from '../models/newsletter-type';

/**
 * Request interface for newsletter signup
 * Contains all data needed to create a subscription
 */
export interface NewsletterSignupRequest {
  email: string;                    // User's email address (required)
  newsletterType: NewsletterType;  // Newsletter type: 'dl', 'md', or 'tcg'
  firstName?: string;               // User's first name (optional)
  lastName?: string;                // User's last name (optional)
  categories?: {                    // Selected newsletter categories (optional)
    dl?: boolean;
    md?: boolean;
    tcg?: boolean;
  };
  captchaToken?: string;            // reCAPTCHA verification token (required for production)
}

/**
 * Response interface from newsletter signup API
 * Indicates success/failure and provides messages
 */
export interface NewsletterSignupResponse {
  success: boolean;    // Whether the request was successful
  message?: string;   // Success message (if successful)
  error?: string;     // Error message (if failed)
}

@Injectable({
  providedIn: 'root'
})
export class SendGridService {
  // Use environment variable or default to localhost for development
  // In production, set this via environment variable
  private readonly apiUrl = this.getApiUrl();

  constructor(private http: HttpClient) {}

  /**
   * Determines the correct API URL based on the current environment
   * 
   * LOGIC:
   * - Server-side rendering: defaults to localhost
   * - localhost/127.0.0.1: direct connection to backend
   * - Production (card-app.kde-us.com): use absolute URL to backend API
   * - Other hosts (ngrok): use relative path (proxy handles it)
   * 
   * @returns API endpoint URL string
   * @private
   */
  private getApiUrl(): string {
    // Check if we're in production (you can set this via environment)
    // For now, detect based on hostname
    if (typeof window === 'undefined') {
      return 'http://localhost:3001/api/newsletter/signup';
    }
    
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Direct connection to backend when on localhost
      return 'http://localhost:3001/api/newsletter/signup';
    } else if (hostname === 'card-app.kde-us.com') {
      // Production environment - use absolute URL to backend API
      // Update this URL to match your actual backend API endpoint
      return 'https://card-app.kde-us.com/api/newsletter/signup';
    } else if (hostname.includes('ngrok') || hostname.includes('ngrok-free.dev') || hostname.includes('ngrok.io')) {
      // ngrok environment - use relative path (proxy handles it)
      // Angular dev server proxy will forward /api/* to localhost:3001
      return '/api/newsletter/signup';
    } else {
      // Other environments (including production deployments) - use relative path
      return '/api/newsletter/signup';
    }
  }

  /**
   * Submit newsletter signup request to backend
   * 
   * The backend will:
   * 1. Validate and sanitize input
   * 2. Create subscription record (unverified)
   * 3. Send verification email via SendGrid
   * 4. Return success/error response
   * 
   * @param request - Newsletter signup request data
   * @returns Observable that emits the API response
   */
  signup(request: NewsletterSignupRequest): Observable<NewsletterSignupResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<NewsletterSignupResponse>(this.apiUrl, request, { headers });
  }
}

