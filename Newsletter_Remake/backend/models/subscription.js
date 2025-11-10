// In-memory subscription store (use database in production)
// For production, replace with MongoDB, PostgreSQL, or similar
const subscriptions = new Map();

class SubscriptionModel {
  // Create or update subscription
  static create(email, newsletterType, verified = false) {
    const key = `${email.toLowerCase()}_${newsletterType}`;
    const subscription = {
      email: email.toLowerCase(),
      newsletterType,
      verified,
      subscribed: verified, // Only subscribed if verified
      subscribedAt: verified ? new Date().toISOString() : null,
      unsubscribedAt: null,
      verificationToken: this.generateToken(),
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    subscriptions.set(key, subscription);
    return subscription;
  }

  // Get subscription
  static get(email, newsletterType) {
    const key = `${email.toLowerCase()}_${newsletterType}`;
    return subscriptions.get(key) || null;
  }

  // Get all subscriptions for an email
  static getByEmail(email) {
    const results = [];
    for (const [key, sub] of subscriptions.entries()) {
      if (sub.email === email.toLowerCase()) {
        results.push(sub);
      }
    }
    return results;
  }

  // Verify subscription (double opt-in)
  static verify(email, newsletterType, token) {
    const subscription = this.get(email, newsletterType);
    if (!subscription) return null;
    
    if (subscription.verificationToken === token && 
        new Date(subscription.verificationExpires) > new Date()) {
      subscription.verified = true;
      subscription.subscribed = true;
      subscription.subscribedAt = new Date().toISOString();
      subscription.updatedAt = new Date().toISOString();
      return subscription;
    }
    return null;
  }

  // Unsubscribe
  static unsubscribe(email, newsletterType) {
    const subscription = this.get(email, newsletterType);
    if (!subscription) return null;
    
    subscription.subscribed = false;
    subscription.unsubscribedAt = new Date().toISOString();
    subscription.updatedAt = new Date().toISOString();
    return subscription;
  }

  // Resubscribe
  static resubscribe(email, newsletterType) {
    const subscription = this.get(email, newsletterType);
    if (!subscription) {
      // Create new subscription if doesn't exist
      return this.create(email, newsletterType, true);
    }
    
    subscription.subscribed = true;
    subscription.unsubscribedAt = null;
    subscription.updatedAt = new Date().toISOString();
    return subscription;
  }

  // Update preferences (subscribe/unsubscribe multiple newsletters)
  static updatePreferences(email, preferences) {
    const results = [];
    for (const [newsletterType, subscribed] of Object.entries(preferences)) {
      if (subscribed) {
        results.push(this.resubscribe(email, newsletterType));
      } else {
        results.push(this.unsubscribe(email, newsletterType));
      }
    }
    return results;
  }

  // Generate secure token
  static generateToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  // Generate unsubscribe token
  static generateUnsubscribeToken(email, newsletterType) {
    const data = `${email}_${newsletterType}_${Date.now()}`;
    return require('crypto').createHash('sha256').update(data).digest('hex');
  }
}

module.exports = SubscriptionModel;

