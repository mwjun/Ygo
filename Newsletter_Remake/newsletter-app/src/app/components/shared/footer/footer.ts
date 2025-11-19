/**
 * FILE: footer.ts
 * 
 * PURPOSE:
 * Footer component that displays the content rating image and version number.
 * This component is used across all pages to provide consistent footer information.
 * 
 * FEATURES:
 * - Displays content rating image (ESRB for digital games or TCG rating)
 * - Displays application version number
 * - Configurable content rating path and version string
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  /**
   * Path to the content rating image (ESRB rating for digital games or TCG rating).
   * This is an input property that can be set by parent components.
   * Default: 'assets/img/cr-digital.png' (ESRB rating for digital games)
   */
  @Input() contentRatingPath: string = 'assets/img/cr-digital.png';
  
  /**
   * Application version string (e.g., "v 3.0.1").
   * This is an input property that can be set by parent components.
   * Default: 'v 3.0.1'
   */
  @Input() version: string = 'v 3.0.1';
}
