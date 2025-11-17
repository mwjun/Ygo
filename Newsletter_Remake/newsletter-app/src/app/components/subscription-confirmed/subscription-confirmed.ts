import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-subscription-confirmed',
  standalone: true,
  imports: [CommonModule, RouterModule, PageContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './subscription-confirmed.html',
  styleUrl: './subscription-confirmed.css'
})
export class SubscriptionConfirmedComponent implements OnInit, OnDestroy {
  isVerifying: boolean = false;
  verificationError: string = '';
  isFromVerification: boolean = false; // True if accessed via email verification link

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Scroll to top
    window.scrollTo(0, 0);

    // Check if this is a verification request (has email, type, token params)
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const type = params['type'];
      const token = params['token'];

      // If verification params exist, this is from email verification link
      if (email && type && token) {
        this.isFromVerification = true;
        this.verifySubscription(email, type, token);
      } else {
        // No verification params - this is from signup form
        this.isFromVerification = false;
      }
    });
  }

  private async verifySubscription(email: string, type: string, token: string): Promise<void> {
    this.isVerifying = true;
    this.verificationError = '';

    try {
      // Use relative path - Angular dev server proxy will forward to backend
      // When accessed through ngrok, the proxy will handle forwarding to localhost:3001
      const backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : ''; // Use relative path when accessed through ngrok (proxy handles it)

      // Call backend verification API
      const response = await firstValueFrom(
        this.http.get<any>(`${backendUrl}/api/newsletter/verify`, {
          params: { email, type, token }
        })
      );

      if (response.success) {
        // Verification successful - already on confirmation page, just show success
        this.isVerifying = false;
      } else {
        this.verificationError = response.error || 'Verification failed';
        this.isVerifying = false;
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      this.verificationError = error?.error?.error || 'Failed to verify subscription. Please try again.';
      this.isVerifying = false;
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}

