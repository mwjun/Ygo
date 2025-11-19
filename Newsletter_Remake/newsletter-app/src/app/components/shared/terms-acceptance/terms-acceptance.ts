/**
 * FILE: terms-acceptance.ts
 * 
 * PURPOSE:
 * Terms and conditions acceptance component.
 * Displays terms and conditions links and allows users to accept or decline.
 * 
 * FEATURES:
 * - Displays Privacy Policy and Terms of Use links
 * - Checkbox for accepting terms
 * - Accept and Decline buttons
 * - Event emitters for parent component communication
 * 
 * NOTE:
 * This component is currently commented out in the age-gate flow but kept for future use.
 * Users now go directly from age verification to newsletter signup (terms acceptance is bypassed).
 * 
 * USAGE:
 * - Parent component listens to termsAccepted and termsDeclined events
 * - Accept button is disabled until checkbox is checked
 */
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terms-acceptance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terms-acceptance.html',
  styleUrl: './terms-acceptance.css'
})
export class TermsAcceptanceComponent {
  /**
   * Event emitter for terms acceptance
   * Emitted when user clicks "Accept and Continue" button (only if checkbox is checked)
   * Parent component (age-gate) listens to this event
   */
  @Output() termsAccepted = new EventEmitter<void>();
  
  /**
   * Event emitter for terms decline
   * Emitted when user clicks "Decline" button
   * Parent component (age-gate) listens to this event
   */
  @Output() termsDeclined = new EventEmitter<void>();
  
  /**
   * Checkbox state for terms acceptance
   * Must be true before user can click "Accept and Continue"
   */
  accepted: boolean = false;
  
  /**
   * URL for Konami Privacy Policy
   * Opens in new tab when clicked
   */
  readonly privacyPolicyUrl = 'https://legal.konami.com/kdeus/privacy/en-us/';
  
  /**
   * URL for Konami Terms of Use
   * Opens in new tab when clicked
   */
  readonly termsOfUseUrl = 'https://legal.konami.com/kdeus/btob/terms/tou/en/';

  /**
   * Handler for "Accept and Continue" button click
   * Only emits termsAccepted event if checkbox is checked
   * 
   * NOTE: Accept button should be disabled in template if accepted is false
   */
  onAccept(): void {
    if (this.accepted) {
      this.termsAccepted.emit();
    }
  }

  /**
   * Handler for "Decline" button click
   * Emits termsDeclined event immediately (no validation needed)
   */
  onDecline(): void {
    this.termsDeclined.emit();
  }
}

