import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-form-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-container.html',
  styleUrl: './form-container.css'
})
export class FormContainerComponent implements OnChanges, OnInit, OnDestroy {
  @Input() formUrl: string = '';
  @Input() newsletterType: string = '';
  @Output() formSubmitted = new EventEmitter<{ email: string; newsletterType: string }>();
  safeFormUrl: SafeResourceUrl;
  private messageListener?: (event: MessageEvent) => void;

  constructor(private sanitizer: DomSanitizer) {
    this.safeFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {
    // Listen for postMessage events from the iframe
    this.messageListener = (event: MessageEvent) => {
      // Security: Strict origin validation - only accept from exact SendGrid form domains
      const allowedOrigins = [
        'https://cdn.forms-content-1.sg-form.com',
        'https://forms-content-1.sg-form.com',
        'https://sg-form.com'
      ];
      
      // Check if origin exactly matches allowed origins (more secure than includes)
      const isAllowedOrigin = allowedOrigins.some(allowed => 
        event.origin === allowed || event.origin.startsWith(allowed + '/')
      );
      
      if (!isAllowedOrigin) {
        // Log potential security issue (only in development - check via window.location)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.warn('Blocked postMessage from unauthorized origin:', event.origin);
        }
        return;
      }
      
      // Validate and sanitize email from message
      if (event.data && (event.data.type === 'form-submit' || event.data.submitted)) {
        const email = event.data.email || event.data.emailAddress;
        
        // Validate email format before emitting
        if (email && typeof email === 'string' && email.includes('@') && email.length <= 254) {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email.trim().toLowerCase()) && this.newsletterType) {
            this.formSubmitted.emit({
              email: email.trim().toLowerCase(),
              newsletterType: this.newsletterType
            });
          }
        }
      }
    };

    window.addEventListener('message', this.messageListener);

    // Also listen for iframe load events as fallback
    // Some forms redirect after submission, which triggers a load event
  }

  ngOnDestroy(): void {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formUrl'] && this.formUrl) {
      this.safeFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formUrl);
    }
  }
}

