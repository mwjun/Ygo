/**
 * FILE: app.ts
 * 
 * PURPOSE:
 * Root component of the Angular application.
 * This is the main app component that serves as the entry point for the entire application.
 * 
 * FEATURES:
 * - Router outlet for displaying routed components
 * - Application title (signal-based for reactivity)
 * 
 * STRUCTURE:
 * - This component wraps the entire application
 * - RouterOutlet displays the component for the current route
 * - All pages are rendered inside this component
 */

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /**
   * Application title
   * Uses Angular signal for reactive title management
   * Currently set to 'newsletter-app'
   */
  protected readonly title = signal('newsletter-app');
}
