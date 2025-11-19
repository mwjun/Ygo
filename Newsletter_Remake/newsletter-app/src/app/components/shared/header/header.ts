/**
 * FILE: header.ts
 * 
 * PURPOSE:
 * Header component that displays the Konami logo and links to the Konami website.
 * This component is used across all pages to provide consistent branding.
 * 
 * FEATURES:
 * - Displays Konami logo
 * - Links to Konami official website
 * - Configurable logo path
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  /**
   * Path to the Konami logo image asset.
   * This logo is displayed in the header.
   * Currently set to 'assets/img/konami_logo.png' (cropped and resized to 100px).
   */
  readonly konamiLogoPath = 'assets/img/konami_logo.png';
  
  /**
   * URL for the Konami official website.
   * When the logo is clicked, it navigates to this URL in a new tab.
   */
  readonly konamiUrl = 'http://www.konami.com/';
}
