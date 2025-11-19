/**
 * FILE: page-container.ts
 * 
 * PURPOSE:
 * Page container component that provides a consistent white box wrapper for all pages.
 * This component handles the layout and styling of the main content area.
 * 
 * FEATURES:
 * - Configurable width (narrow or wide)
 * - Consistent styling across all pages
 * - Content projection (ng-content) for flexible content
 * 
 * USAGE:
 * - Use maxWidth="narrow" for focused pages (age gate, confirmation pages)
 * - Use maxWidth="wide" (default) for pages with more content (home page with newsletter cards)
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-container.html',
  styleUrl: './page-container.css'
})
export class PageContainerComponent {
  /**
   * Input property to control container width
   * 'narrow' = 600px max width (for age gate, confirmation pages)
   * 'wide' = 900px max width (for home page with newsletter cards)
   * Default: 'wide'
   */
  @Input() maxWidth: 'narrow' | 'wide' = 'wide';
  
  /**
   * Getter that returns the appropriate CSS class based on maxWidth
   * Returns 'container container-narrow' for narrow width
   * Returns 'container' for wide width (default)
   * 
   * @returns CSS class string for the container
   */
  get containerClass(): string {
    return this.maxWidth === 'narrow' ? 'container container-narrow' : 'container';
  }
}
