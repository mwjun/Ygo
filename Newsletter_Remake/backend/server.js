const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
const SubscriptionModel = require('./models/subscription');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:4200']);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error('ERROR: SENDGRID_API_KEY is not set in environment variables');
  process.exit(1);
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Input sanitization helpers
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"&]/g, '')
    .trim()
    .substring(0, 100);
}

function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.replace(/<[^>]*>/g, '').trim().toLowerCase();
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function validateNewsletterType(type) {
  const validTypes = ['dl', 'md', 'tcg'];
  return validTypes.includes(type);
}

// Newsletter names
const newsletterNames = {
  'dl': 'Yu-Gi-Oh! Duel Links',
  'md': 'Yu-Gi-Oh! Master Duel',
  'tcg': 'Yu-Gi-Oh! Trading Card Game'
};

// Professional email template helper
function getEmailTemplate(type, data) {
  const baseUrl = FRONTEND_URL;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(data.email)}&type=${data.newsletterType}&token=${data.unsubscribeToken}`;
  const preferenceUrl = `${baseUrl}/preferences?email=${encodeURIComponent(data.email)}&token=${data.preferenceToken}`;

  const templates = {
    verification: {
      subject: `Please confirm your subscription to ${data.newsletterName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #b00000 0%, #8a0000 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Confirm Your Subscription</h1>
          </div>
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p>Hello ${data.greeting},</p>
            <p>Thank you for signing up for the <strong>${data.newsletterName}</strong> newsletter!</p>
            <p>To complete your subscription and start receiving updates, please confirm your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verificationUrl}" target="_blank" rel="noopener noreferrer" style="background: #b00000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; cursor: pointer;">Confirm Subscription</a>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;"><strong>If the button doesn't work, copy and paste this link into your browser:</strong></p>
            <p style="font-size: 12px; color: #999; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${data.verificationUrl}</p>
            <p style="font-size: 12px; color: #666; margin-top: 15px;"><strong>Note:</strong> If you see a warning page, click "Visit Site" to proceed.</p>
            <p style="font-size: 12px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
            <p style="font-size: 12px; color: #666;">If you did not sign up for this newsletter, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
            <p>© ${new Date().getFullYear()} Konami Digital Entertainment</p>
          </div>
        </body>
        </html>
      `
    },
    welcome: {
      subject: `Welcome to ${data.newsletterName} Newsletter!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #b00000 0%, #8a0000 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome!</h1>
          </div>
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p>Hello ${data.greeting},</p>
            <p>Thank you for confirming your subscription to the <strong>${data.newsletterName}</strong> newsletter!</p>
            <p>You're all set! You'll now receive:</p>
            <ul>
              <li>Latest news and updates</li>
              <li>Exclusive content and announcements</li>
              <li>Special offers and events</li>
            </ul>
            <p>We're excited to have you as part of our community!</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              <a href="${preferenceUrl}" style="color: #b00000;">Manage your preferences</a> | 
              <a href="${unsubscribeUrl}" style="color: #b00000;">Unsubscribe</a>
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
            <p>© ${new Date().getFullYear()} Konami Digital Entertainment</p>
          </div>
        </body>
        </html>
      `
    }
  };

  return templates[type];
}

// Newsletter signup endpoint (Double Opt-In)
app.post('/api/newsletter/signup', async (req, res) => {
  try {
    const { email, newsletterType, firstName, lastName, categories } = req.body;

    // Validate required fields
    if (!email || !newsletterType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and newsletter type are required' 
      });
    }

    // Validate and sanitize email
    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Validate newsletter type
    if (!validateNewsletterType(newsletterType)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid newsletter type' 
      });
    }

    // Check if already subscribed and verified
    const existing = SubscriptionModel.get(sanitizedEmail, newsletterType);
    if (existing && existing.verified && existing.subscribed) {
      return res.status(200).json({ 
        success: true, 
        message: 'You are already subscribed to this newsletter' 
      });
    }

    // Sanitize optional fields
    const sanitizedFirstName = firstName ? sanitizeInput(firstName) : '';
    const sanitizedLastName = lastName ? sanitizeInput(lastName) : '';
    const greeting = sanitizedFirstName || 'there';

    // Process categories - format as DL=Yes, MD=Yes, TCG=Yes
    let categoryString = '';
    if (categories) {
      const categoryParts = [];
      if (categories.dl === true) categoryParts.push('DL=Yes');
      if (categories.md === true) categoryParts.push('MD=Yes');
      if (categories.tcg === true) categoryParts.push('TCG=Yes');
      categoryString = categoryParts.join(', ');
    }

    // Create subscription (unverified initially - double opt-in)
    const subscription = SubscriptionModel.create(sanitizedEmail, newsletterType, false);
    
    const newsletterName = newsletterNames[newsletterType];
    // Use frontend URL for verification link (frontend will call backend API)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const verificationUrl = `${frontendUrl}/verify?email=${encodeURIComponent(sanitizedEmail)}&type=${newsletterType}&token=${subscription.verificationToken}`;
    
    console.log(`Generating verification link with frontend URL: ${frontendUrl}`);
    console.log(`Verification URL: ${verificationUrl}`);

    // Send verification email (double opt-in)
    const template = getEmailTemplate('verification', {
      email: sanitizedEmail,
      newsletterType,
      newsletterName,
      greeting,
      verificationUrl,
      unsubscribeToken: subscription.verificationToken,
      preferenceToken: subscription.verificationToken,
      categories: categoryString
    });

    // Prepare SendGrid message with custom fields for categories
    const msg = {
      to: sanitizedEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject: template.subject,
      text: `Please confirm your subscription to ${newsletterName} by visiting: ${verificationUrl}`,
      html: template.html,
      // Add categories as custom fields in SendGrid
      customArgs: {
        categories: categoryString || 'None',
        dl: categories?.dl === true ? 'Yes' : 'No',
        md: categories?.md === true ? 'Yes' : 'No',
        tcg: categories?.tcg === true ? 'Yes' : 'No'
      }
    };

    await sgMail.send(msg);

    const categoryInfo = categoryString ? ` - Categories: ${categoryString}` : '';
    console.log(`Verification email sent: ${newsletterType} - ${sanitizedEmail.substring(0, 3)}***${categoryInfo}`);

    res.json({ 
      success: true, 
      message: 'Please check your email to confirm your subscription' 
    });

  } catch (error) {
    console.error('SendGrid error:', error);
    
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to process newsletter signup';

    if (error.response) {
      console.error('SendGrid response error:', error.response.body);
    }

    res.status(500).json({ 
      success: false, 
      error: 'Failed to process newsletter signup',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Verify subscription endpoint (Double Opt-In confirmation)
app.get('/api/newsletter/verify', async (req, res) => {
  try {
    const { email, type, token } = req.query;

    if (!email || !type || !token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail) || !validateNewsletterType(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid parameters' 
      });
    }

    // Verify subscription
    const subscription = SubscriptionModel.verify(sanitizedEmail, type, token);
    
    if (!subscription) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification token' 
      });
    }

    // Send welcome email
    const newsletterName = newsletterNames[type];
    const unsubscribeToken = SubscriptionModel.generateUnsubscribeToken(sanitizedEmail, type);
    const preferenceToken = SubscriptionModel.generateUnsubscribeToken(sanitizedEmail, 'preferences');

    const template = getEmailTemplate('welcome', {
      email: sanitizedEmail,
      newsletterType: type,
      newsletterName,
      greeting: 'there',
      unsubscribeToken,
      preferenceToken
    });

    const msg = {
      to: sanitizedEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
      subject: template.subject,
      text: `Welcome to ${newsletterName}! You're now subscribed.`,
      html: template.html
    };

    await sgMail.send(msg);

    console.log(`Subscription verified: ${type} - ${sanitizedEmail.substring(0, 3)}***`);

    // Return JSON response (frontend will handle the redirect)
    res.json({
      success: true,
      message: 'Subscription verified successfully',
      newsletterType: type
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify subscription'
    });
  }
});

// Unsubscribe endpoint
app.get('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email, type } = req.query;

    if (!email || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail) || !validateNewsletterType(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid parameters' 
      });
    }

    // Unsubscribe
    const subscription = SubscriptionModel.unsubscribe(sanitizedEmail, type);
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        error: 'Subscription not found' 
      });
    }

    console.log(`Unsubscribed: ${type} - ${sanitizedEmail.substring(0, 3)}***`);

    res.redirect(`${FRONTEND_URL}/unsubscribed?type=${type}`);

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.redirect(`${FRONTEND_URL}/subscription-error`);
  }
});

// Get subscription preferences
app.get('/api/newsletter/preferences', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Get all subscriptions for this email
    const subscriptions = SubscriptionModel.getByEmail(sanitizedEmail);
    
    const preferences = {};
    for (const type of ['dl', 'md', 'tcg']) {
      const sub = subscriptions.find(s => s.newsletterType === type);
      preferences[type] = {
        subscribed: sub ? sub.subscribed : false,
        verified: sub ? sub.verified : false,
        newsletterName: newsletterNames[type]
      };
    }

    res.json({ 
      success: true, 
      email: sanitizedEmail,
      preferences 
    });

  } catch (error) {
    console.error('Preferences error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve preferences' 
    });
  }
});

// Update subscription preferences
app.post('/api/newsletter/preferences', async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email || !preferences) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and preferences are required' 
      });
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Validate preferences
    for (const [type, subscribed] of Object.entries(preferences)) {
      if (!validateNewsletterType(type) || typeof subscribed !== 'boolean') {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid preferences format' 
        });
      }
    }

    // Update preferences
    SubscriptionModel.updatePreferences(sanitizedEmail, preferences);

    console.log(`Preferences updated: ${sanitizedEmail.substring(0, 3)}***`);

    res.json({ 
      success: true, 
      message: 'Preferences updated successfully' 
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update preferences' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Newsletter backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn('WARNING: SENDGRID_FROM_EMAIL not set');
  }
});
