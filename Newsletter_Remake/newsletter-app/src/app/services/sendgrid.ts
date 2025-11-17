import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsletterType } from '../models/newsletter-type';

export interface NewsletterSignupRequest {
  email: string;
  newsletterType: NewsletterType;
  firstName?: string;
  lastName?: string;
  categories?: {
    dl?: boolean;
    md?: boolean;
    tcg?: boolean;
  };
}

export interface NewsletterSignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SendGridService {
  // Use environment variable or default to localhost for development
  // In production, set this via environment variable
  private readonly apiUrl = this.getApiUrl();

  constructor(private http: HttpClient) {}

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
    } else {
      // When accessed through ngrok or production, use relative path
      // Angular dev server proxy will forward /api/* to localhost:3001
      return '/api/newsletter/signup';
    }
  }

  signup(request: NewsletterSignupRequest): Observable<NewsletterSignupResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<NewsletterSignupResponse>(this.apiUrl, request, { headers });
  }
}

