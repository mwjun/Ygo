/**
 * FILE: newsletter-type.ts
 * 
 * PURPOSE:
 * Type definitions for newsletter types and configuration.
 * Provides type safety for newsletter-related code throughout the application.
 * 
 * TYPES:
 * - NewsletterType: Union type for valid newsletter types
 * - NewsletterConfig: Interface for newsletter configuration objects
 */

/**
 * Newsletter type - valid newsletter identifiers
 * 'dl' = Yu-Gi-Oh! Duel Links
 * 'md' = Yu-Gi-Oh! Master Duel
 * 'tcg' = Yu-Gi-Oh! Trading Card Game
 */
export type NewsletterType = 'dl' | 'md' | 'tcg';

/**
 * Newsletter configuration interface
 * Contains all configuration data for a newsletter type
 */
export interface NewsletterConfig {
  type: NewsletterType;      // Newsletter type identifier ('dl', 'md', or 'tcg')
  title: string;             // Display name (e.g., "Yu-Gi-Oh! Duel Links")
  logoPath: string;          // Path to newsletter logo image file
  formUrl: string;           // SendGrid form URL (legacy, not currently used)
  routePath: string;         // Angular route path (currently all point to '/home')
}

