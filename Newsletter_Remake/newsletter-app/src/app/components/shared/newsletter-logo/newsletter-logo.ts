/**
 * FILE: newsletter-logo.ts
 * 
 * PURPOSE:
 * Simple component for displaying newsletter logos.
 * Provides a reusable way to display newsletter logos throughout the application.
 * 
 * FEATURES:
 * - Configurable logo path (input property)
 * - Configurable alt text for accessibility (input property)
 * - Simple, presentational component
 * 
 * USAGE:
 * - Set logoPath and altText input properties
 * - Component displays the logo image
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newsletter-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newsletter-logo.html',
  styleUrl: './newsletter-logo.css'
})
export class NewsletterLogoComponent {
  /**
   * Path to the newsletter logo image file
   * Example: 'assets/dl-signup/img/Duel-Links-225x120.png'
   */
  @Input() logoPath: string = '';
  
  /**
   * Alternative text for the logo image (accessibility)
   * Example: 'Yu-Gi-Oh! Duel Links Logo'
   */
  @Input() altText: string = '';
}
