/**
 * FILE: legal-text.ts
 * 
 * PURPOSE:
 * Component for displaying legal text with Privacy Policy and Terms of Use links.
 * Provides a reusable way to display legal information throughout the application.
 * 
 * FEATURES:
 * - Displays Privacy Policy link
 * - Displays Terms of Use link
 * - Links open in new tabs
 * - Simple, presentational component
 * 
 * USAGE:
 * - Include component in templates where legal text is needed
 * - Component displays links to Konami legal pages
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-text.html',
  styleUrl: './legal-text.css'
})
export class LegalTextComponent {
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
}
