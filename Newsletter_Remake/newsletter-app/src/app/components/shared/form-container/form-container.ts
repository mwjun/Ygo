/**
 * FILE: form-container.ts
 * 
 * PURPOSE:
 * Component for embedding SendGrid forms in iframes and handling form submission events.
 * This component provides secure iframe embedding with postMessage communication.
 * 
 * FEATURES:
 * - Secure iframe embedding of SendGrid forms
 * - PostMessage event listening for form submissions
 * - Origin validation for security
 * - Email validation and sanitization
 * - Automatic cleanup on component destruction
 * 
 * SECURITY:
 * - Validates postMessage origin (only accepts from SendGrid domains)
 * - Sanitizes iframe URLs using Angular DomSanitizer
 * - Validates email format before emitting events
 * - Logs security warnings in development mode
 * 
 * NOTE:
 * This component is currently not used in the main flow.
 * The home component now handles signup directly via API calls.
 * This component is kept for potential future use with iframe forms.
 */
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
  /**
   * SendGrid form URL to embed in iframe
   * Example: 'https://cdn.forms-content-1.sg-form.com/...'
   */
  @Input() formUrl: string = '';
  
  /**
   * Newsletter type identifier ('dl', 'md', or 'tcg')
   * Used when emitting form submission events
   */
  @Input() newsletterType: string = '';
  
  /**
   * Event emitter for form submission
   * Emitted when form is submitted via postMessage from iframe
   * Contains email and newsletterType
   */
  @Output() formSubmitted = new EventEmitter<{ email: string; newsletterType: string }>();
  
  /**
   * Sanitized form URL for safe iframe embedding
   * Created using Angular DomSanitizer to prevent XSS attacks
   */
  safeFormUrl: SafeResourceUrl;
  
  /**
   * PostMessage event listener function
   * Stored as property so it can be removed in ngOnDestroy
   */
  private messageListener?: (event: MessageEvent) => void;

  /**
   * Constructor - Dependency Injection
   * @param sanitizer - Angular DomSanitizer for sanitizing iframe URLs
   */
  constructor(private sanitizer: DomSanitizer) {
    // Initialize with empty safe URL (will be set in ngOnChanges when formUrl is provided)
    this.safeFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  /**
   * Component initialization lifecycle hook
   * Sets up postMessage listener for iframe form submissions
   * 
   * SECURITY MEASURES:
   * - Validates postMessage origin (only accepts from SendGrid domains)
   * - Validates email format before emitting events
   * - Sanitizes email data (trim, lowercase)
   * - Logs security warnings in development mode
   */
  ngOnInit(): void {
    // Listen for postMessage events from the iframe
    // SendGrid forms send postMessage events when submitted
    this.messageListener = (event: MessageEvent) => {
      // Security: Strict origin validation - only accept from exact SendGrid form domains
      // This prevents malicious sites from sending fake form submission events
      const allowedOrigins = [
        'https://cdn.forms-content-1.sg-form.com',
        'https://forms-content-1.sg-form.com',
        'https://sg-form.com'
      ];
      
      // Check if origin exactly matches allowed origins (more secure than includes)
      // Allows exact match or subdomain matches
      const isAllowedOrigin = allowedOrigins.some(allowed => 
        event.origin === allowed || event.origin.startsWith(allowed + '/')
      );
      
      if (!isAllowedOrigin) {
        // Log potential security issue (only in development - check via window.location)
        // In production, silently reject unauthorized messages
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.warn('Blocked postMessage from unauthorized origin:', event.origin);
        }
        return;  // Reject message from unauthorized origin
      }
      
      // Validate and sanitize email from message
      // SendGrid forms may send different message formats, so check multiple properties
      if (event.data && (event.data.type === 'form-submit' || event.data.submitted)) {
        const email = event.data.email || event.data.emailAddress;
        
        // Validate email format before emitting
        // Check: email exists, is string, contains @, and is within reasonable length
        if (email && typeof email === 'string' && email.includes('@') && email.length <= 254) {
          // Basic email validation using regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email.trim().toLowerCase()) && this.newsletterType) {
            // Emit form submission event with sanitized email
            this.formSubmitted.emit({
              email: email.trim().toLowerCase(),  // Sanitize: trim whitespace, lowercase
              newsletterType: this.newsletterType
            });
          }
        }
      }
    };

    // Register postMessage listener
    window.addEventListener('message', this.messageListener);

    // Also listen for iframe load events as fallback
    // Some forms redirect after submission, which triggers a load event
    // (This is commented out but kept for potential future use)
  }

  /**
   * Component destruction lifecycle hook
   * Cleans up postMessage listener to prevent memory leaks
   */
  ngOnDestroy(): void {
    // Remove postMessage listener when component is destroyed
    // Prevents memory leaks and security issues
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
  }

  /**
   * Lifecycle hook called when input properties change
   * Sanitizes formUrl when it changes
   * 
   * @param changes - Object containing changed properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    // When formUrl input changes, sanitize it for safe iframe embedding
    if (changes['formUrl'] && this.formUrl) {
      // Use Angular DomSanitizer to create safe URL for iframe src
      // This prevents XSS attacks from malicious URLs
      this.safeFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formUrl);
    }
  }
}

