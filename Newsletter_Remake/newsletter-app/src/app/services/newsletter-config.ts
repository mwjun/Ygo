/**
 * FILE: newsletter-config.ts
 * 
 * PURPOSE:
 * Service that provides configuration data for all available newsletters.
 * Contains logo paths, titles, form URLs, and route paths for each newsletter type.
 * 
 * FEATURES:
 * - Centralized newsletter configuration
 * - Type-safe newsletter type definitions
 * - Route path resolution
 * - Logo and title retrieval
 * 
 * NEWSLETTER TYPES:
 * - 'dl' - Yu-Gi-Oh! Duel Links
 * - 'md' - Yu-Gi-Oh! Master Duel
 * - 'tcg' - Yu-Gi-Oh! Trading Card Game
 */

import { Injectable } from '@angular/core';
import { NewsletterConfig, NewsletterType } from '../models/newsletter-type';

@Injectable({
  providedIn: 'root'
})
export class NewsletterConfigService {
  /**
   * Newsletter configurations - contains all data for each newsletter type
   * Each newsletter has:
   * - type: Newsletter type identifier ('dl', 'md', 'tcg')
   * - title: Display name (e.g., "Yu-Gi-Oh! Duel Links")
   * - logoPath: Path to newsletter logo image
   * - formUrl: SendGrid form URL (legacy, not currently used)
   * - routePath: Angular route path (currently all point to '/home')
   */
  private readonly configs: Record<NewsletterType, NewsletterConfig> = {
    // Duel Links newsletter configuration
    dl: {
      type: 'dl',
      title: 'Yu-Gi-Oh! Duel Links',
      logoPath: 'assets/dl-signup/img/Duel-Links-225x120.png',  // Path to Duel Links logo image
      formUrl: 'https://cdn.forms-content-1.sg-form.com/22cdc575-1867-11ef-a74f-6e96bce0832b',  // Legacy SendGrid form URL (not currently used)
      routePath: '/home'  // Route path (all newsletters use /home now)
    },
    // Master Duel newsletter configuration
    md: {
      type: 'md',
      title: 'Yu-Gi-Oh! Master Duel',
      logoPath: 'assets/md-signup/img/MD_logo_225x110.png',  // Path to Master Duel logo image
      formUrl: 'https://cdn.forms-content-1.sg-form.com/b0cde6b5-1866-11ef-b7eb-dea4d84223eb',  // Legacy SendGrid form URL (not currently used)
      routePath: '/home'  // Route path (all newsletters use /home now)
    },
    // Trading Card Game newsletter configuration
    tcg: {
      type: 'tcg',
      title: 'Yu-Gi-Oh! Trading Card Game',
      logoPath: 'assets/tcg-signup/img/TCG_logo_225x100.png',  // Path to TCG logo image
      formUrl: 'https://cdn.forms-content-1.sg-form.com/422b389d-1864-11ef-9523-4ecf2d6389b9',  // Legacy SendGrid form URL (not currently used)
      routePath: '/home'  // Route path (all newsletters use /home now)
    }
  };

  /**
   * Get configuration for a specific newsletter type
   * 
   * @param {NewsletterType} type - Newsletter type: 'dl', 'md', or 'tcg'
   * @returns {NewsletterConfig} Configuration object for the specified newsletter
   */
  getConfig(type: NewsletterType): NewsletterConfig {
    return this.configs[type];
  }

  /**
   * Get all newsletter configurations
   * Returns array of all newsletter configs (used for displaying all newsletters on signup page)
   * 
   * @returns {NewsletterConfig[]} Array of all newsletter configurations
   */
  getAllConfigs(): NewsletterConfig[] {
    return Object.values(this.configs);
  }

  /**
   * Determine newsletter type from route path
   * NOTE: Since individual signup pages were removed, this method now defaults to 'dl'
   * This method is kept for legacy support and potential future use
   * 
   * @param {string} route - Route path (e.g., '/', '/home', '/dl-signup')
   * @returns {NewsletterType | null} Newsletter type, or null for root path
   */
  getTypeFromRoute(route: string): NewsletterType | null {
    // Since individual signup pages are removed, default to 'dl' for any non-root route
    // This method is mainly used for determining newsletter type from URL
    if (route === '/' || route === '' || !route || route.trim() === '') {
      return null;  // Root path doesn't have a specific newsletter type
    }
    // Default to 'dl' for any other route (legacy support)
    return 'dl';
  }
}
