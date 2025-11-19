/**
 * FILE: subscription.js
 * 
 * PURPOSE:
 * In-memory subscription data model for managing newsletter subscriptions.
 * This model handles subscription creation, verification, unsubscription, and preference management.
 * 
 * NOTE: This is an in-memory implementation suitable for MVP/development.
 * For production, this should be replaced with a database (MongoDB, PostgreSQL, etc.)
 * 
 * FEATURES:
 * - Subscription creation with double opt-in support
 * - Email verification via token
 * - Unsubscribe functionality
 * - Resubscribe functionality
 * - Preference management (multiple newsletters)
 * - Secure token generation
 * 
 * DATA STRUCTURE:
 * Each subscription contains:
 * - email: User's email address (lowercase)
 * - newsletterType: 'dl', 'md', or 'tcg'
 * - verified: Boolean - whether email has been verified
 * - subscribed: Boolean - whether user is currently subscribed
 * - subscribedAt: ISO timestamp when subscription was confirmed
 * - unsubscribedAt: ISO timestamp when user unsubscribed (null if subscribed)
 * - verificationToken: Secure token for email verification
 * - verificationExpires: Expiration date for verification token (24 hours)
 * - createdAt: ISO timestamp when subscription was created
 * - updatedAt: ISO timestamp when subscription was last updated
 */

// In-memory subscription store (use database in production)
// For production, replace with MongoDB, PostgreSQL, or similar
// Key format: "email_newsletterType" (e.g., "user@example.com_dl")
const subscriptions = new Map();

/**
 * SubscriptionModel - Static class for managing newsletter subscriptions
 * All methods are static (no instance needed)
 */
class SubscriptionModel {
  /**
   * Create or update a subscription
   * Creates a new subscription record (unverified by default for double opt-in)
   * 
   * @param {string} email - User's email address
   * @param {string} newsletterType - Newsletter type: 'dl', 'md', or 'tcg'
   * @param {boolean} verified - Whether subscription is verified (default: false for double opt-in)
   * @returns {object} The created subscription object
   */
  static create(email, newsletterType, verified = false) {
    // Create unique key for this email + newsletter type combination
    // Format: "email_newsletterType" (e.g., "user@example.com_dl")
    const key = `${email.toLowerCase()}_${newsletterType}`;
    
    // Create subscription object with all required fields
    const subscription = {
      email: email.toLowerCase(),  // Normalize email to lowercase
      newsletterType,              // 'dl', 'md', or 'tcg'
      verified,                    // Whether email has been verified (false for new subscriptions)
      subscribed: verified,        // Only subscribed if verified (double opt-in requirement)
      subscribedAt: verified ? new Date().toISOString() : null,  // Timestamp when subscription was confirmed
      unsubscribedAt: null,        // Timestamp when user unsubscribed (null if currently subscribed)
      verificationToken: this.generateToken(),  // Secure token for email verification link
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),  // Token expires in 24 hours
      createdAt: new Date().toISOString(),       // Timestamp when subscription was created
      updatedAt: new Date().toISOString()        // Timestamp when subscription was last updated
    };
    
    // Store subscription in memory (Map data structure)
    subscriptions.set(key, subscription);
    return subscription;
  }

  /**
   * Get a specific subscription by email and newsletter type
   * 
   * @param {string} email - User's email address
   * @param {string} newsletterType - Newsletter type: 'dl', 'md', or 'tcg'
   * @returns {object|null} The subscription object, or null if not found
   */
  static get(email, newsletterType) {
    const key = `${email.toLowerCase()}_${newsletterType}`;
    return subscriptions.get(key) || null;
  }

  /**
   * Get all subscriptions for a specific email address
   * Returns all newsletter subscriptions (dl, md, tcg) for a given email
   * 
   * @param {string} email - User's email address
   * @returns {array} Array of subscription objects for this email
   */
  static getByEmail(email) {
    const results = [];
    // Loop through all subscriptions in the Map
    for (const [key, sub] of subscriptions.entries()) {
      // Check if this subscription belongs to the requested email
      if (sub.email === email.toLowerCase()) {
        results.push(sub);
      }
    }
    return results;
  }

  /**
   * Verify a subscription via email verification token (double opt-in confirmation)
   * Validates the token and marks subscription as verified and subscribed
   * 
   * @param {string} email - User's email address
   * @param {string} newsletterType - Newsletter type: 'dl', 'md', or 'tcg'
   * @param {string} token - Verification token from email link
   * @returns {object|null} The verified subscription object, or null if verification failed
   */
  static verify(email, newsletterType, token) {
    // Get the subscription record
    const subscription = this.get(email, newsletterType);
    if (!subscription) return null;
    
    // Verify token matches and hasn't expired
    // Token must match exactly and expiration date must be in the future
    if (subscription.verificationToken === token && 
        new Date(subscription.verificationExpires) > new Date()) {
      // Mark subscription as verified and subscribed
      subscription.verified = true;
      subscription.subscribed = true;
      subscription.subscribedAt = new Date().toISOString();  // Record when subscription was confirmed
      subscription.updatedAt = new Date().toISOString();
      return subscription;
    }
    // Token doesn't match or has expired
    return null;
  }

  /**
   * Unsubscribe a user from a newsletter
   * Marks subscription as unsubscribed but keeps the record (for analytics/history)
   * 
   * @param {string} email - User's email address
   * @param {string} newsletterType - Newsletter type: 'dl', 'md', or 'tcg'
   * @returns {object|null} The updated subscription object, or null if not found
   */
  static unsubscribe(email, newsletterType) {
    const subscription = this.get(email, newsletterType);
    if (!subscription) return null;
    
    // Mark as unsubscribed and record timestamp
    subscription.subscribed = false;
    subscription.unsubscribedAt = new Date().toISOString();
    subscription.updatedAt = new Date().toISOString();
    return subscription;
  }

  /**
   * Resubscribe a user to a newsletter
   * If subscription doesn't exist, creates a new one (pre-verified)
   * If subscription exists, marks it as subscribed again
   * 
   * @param {string} email - User's email address
   * @param {string} newsletterType - Newsletter type: 'dl', 'md', or 'tcg'
   * @returns {object} The subscription object (newly created or updated)
   */
  static resubscribe(email, newsletterType) {
    const subscription = this.get(email, newsletterType);
    if (!subscription) {
      // Create new subscription if doesn't exist (pre-verified for resubscription)
      return this.create(email, newsletterType, true);
    }
    
    // Mark as subscribed again and clear unsubscribe timestamp
    subscription.subscribed = true;
    subscription.unsubscribedAt = null;  // Clear unsubscribe timestamp
    subscription.updatedAt = new Date().toISOString();
    return subscription;
  }

  /**
   * Update subscription preferences for multiple newsletters
   * Allows user to subscribe/unsubscribe from multiple newsletters at once
   * 
   * @param {string} email - User's email address
   * @param {object} preferences - Object with newsletter types as keys and boolean values
   *                              Example: { dl: true, md: false, tcg: true }
   * @returns {array} Array of updated subscription objects
   */
  static updatePreferences(email, preferences) {
    const results = [];
    // Loop through each newsletter type in preferences
    for (const [newsletterType, subscribed] of Object.entries(preferences)) {
      if (subscribed) {
        // If preference is true, resubscribe
        results.push(this.resubscribe(email, newsletterType));
      } else {
        // If preference is false, unsubscribe
        results.push(this.unsubscribe(email, newsletterType));
      }
    }
    return results;
  }

  /**
   * Generate a secure random token for email verification
   * Uses Node.js crypto module to generate cryptographically secure random bytes
   * 
   * @returns {string} 64-character hexadecimal token (32 bytes = 64 hex characters)
   */
  static generateToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Generate an unsubscribe token
   * Creates a hash-based token for unsubscribe links (different from verification token)
   * 
   * @param {string} email - User's email address
   * @param {string} newsletterType - Newsletter type: 'dl', 'md', or 'tcg'
   * @returns {string} SHA-256 hash token (64-character hexadecimal string)
   */
  static generateUnsubscribeToken(email, newsletterType) {
    // Create unique data string with email, type, and timestamp
    const data = `${email}_${newsletterType}_${Date.now()}`;
    // Generate SHA-256 hash of the data
    return require('crypto').createHash('sha256').update(data).digest('hex');
  }
}

module.exports = SubscriptionModel;

