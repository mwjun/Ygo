import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-subscription-confirmed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscription-confirmed.html',
  styleUrl: './subscription-confirmed.css'
})
export class SubscriptionConfirmedComponent implements OnInit, OnDestroy {
  isVerifying: boolean = false;
  verificationError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Scroll to top and prevent scrolling
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Check if this is a verification request (has email, type, token params)
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const type = params['type'];
      const token = params['token'];

      // If verification params exist, call backend API to verify
      if (email && type && token) {
        this.verifySubscription(email, type, token);
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
    // Restore scrolling when leaving the page
    document.body.style.overflow = '';
  }
}

