/**
 * FILE: app.config.ts
 * 
 * PURPOSE:
 * Angular application configuration file that sets up providers and router configuration.
 * This file configures the application's core services and routing behavior.
 * 
 * FEATURES:
 * - Router configuration with scroll restoration
 * - HTTP client provider for API calls
 * - Error handling listeners
 * - Zone change detection optimization
 * 
 * CONFIGURATION:
 * - scrollPositionRestoration: 'top' - Ensures page always starts at top when navigating
 * - anchorScrolling: 'enabled' - Enables smooth scrolling to anchor links
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Application configuration object
 * Defines all providers and services available throughout the application
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Global error listeners - catches and handles application-wide errors
    provideBrowserGlobalErrorListeners(),
    
    // Zone change detection - optimizes change detection with event coalescing
    // eventCoalescing: true - batches multiple change detection cycles for better performance
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router configuration with scroll behavior
    provideRouter(
      routes,  // Route definitions from app.routes.ts
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',  // Always scroll to top when navigating to new route
        anchorScrolling: 'enabled'          // Enable smooth scrolling to anchor links (e.g., #section)
      })
    ),
    
    // HTTP client provider - enables HttpClient for making API calls
    provideHttpClient()
  ]
};
