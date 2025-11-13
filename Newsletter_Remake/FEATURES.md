# Newsletter Remake Project - Implemented Features

## Age Gate & Verification
- Age gate on main page (`/`) - always shows first
- Date of birth entry (Month, Day, Year dropdowns)
- Age validation - must be 16 or older
- Age calculation using PHP logic
- Date validation - checks for valid dates (e.g., Feb 30)
- Terms and conditions acceptance after age verification
- Legal cookie storage - stores `legal=yes` or `legal=no` with 2-hour expiry
- Cookie-based age verification across pages
- Error page for underage users

## Category Selection
- Category selection on age gate page (same page as DOB entry)
- Three newsletter categories: Duel Links (DL), Master Duel (MD), Trading Card Game (TCG)
- Visual category cards with logos above text
- Checkbox selection for each category
- Visual feedback when categories are selected (red border, highlighted background)
- Category validation - requires at least one category selected
- Error message: "Please select at least one category" if none selected
- Categories stored in cookie (`newsletter_categories`) with 2-hour expiry
- Category cookie persists through the signup flow

## Navigation & Routing
- Root path (`/`) always shows age gate
- Protected routes with age verification guard
- Automatic redirects based on cookie status
- Route guards for `/home`, `/dl-signup`, `/md-signup`, `/tcg-signup`
- Direct navigation to signup pages after terms acceptance (based on selected categories)

## Newsletter Signup Pages
- Three separate signup pages: DL Signup, MD Signup, TCG Signup
- Iframe integration for external SendGrid forms
- Newsletter-specific logos and branding
- Form submission detection via PostMessage API
- Security: PostMessage origin validation (only accepts from SendGrid domains)
- Email sanitization and validation

## SendGrid Integration
- SendGrid service for email confirmation
- Double opt-in email verification
- Automatic confirmation email after form submission
- Categories passed to SendGrid: `DL=Yes, MD=Yes, TCG=Yes` format
- Custom fields in SendGrid: individual category flags (dl, md, tcg)
- Backend API endpoint: `/api/newsletter/signup`
- Email verification URLs with tokens
- Unsubscribe functionality
- Preference center support

## Email Features
- Email prompt appears 5 seconds after form load
- Manual email entry option
- Email validation and sanitization
- Success/error status messages
- Confirmation email templates
- Email verification flow with tokens

## UI/UX Features
- Konami logo in header (centered, 100px width)
- Responsive design with page containers
- Content rating images in footer
- Newsletter logos positioned above text
- Hover effects on category cards
- Visual selection feedback (borders, backgrounds)
- Error message styling
- Loading states for email sending

## Security Features
- CORS configuration
- Input sanitization (email, names)
- XSS protection
- Rate limiting on backend
- Security headers
- PostMessage origin validation
- Environment variables for sensitive data
- Cookie security (path, expiry)

## Backend Features
- Node.js/Express server
- SendGrid mail integration
- Subscription model with verification tokens
- Double opt-in flow
- Category processing and formatting
- Error handling and logging
- Development/production environment detection

## Cookie Management
- Legal cookie (`legal`) - stores age verification status
- Categories cookie (`newsletter_categories`) - stores selected categories
- Cookie expiry: 2 hours
- Site-wide cookie path (`/`)
- Cookie retrieval and caching
- Cookie clearing methods

## Components Structure
- AgeGateComponent - main age verification
- AgeFormComponent - date of birth form with category selection
- TermsAcceptanceComponent - terms and conditions
- HomeComponent - newsletter selection (optional/fallback)
- DlSignupComponent, MdSignupComponent, TcgSignupComponent - signup pages
- FormContainerComponent - iframe wrapper with PostMessage handling
- HeaderComponent, FooterComponent - shared layout
- ErrorComponent - error page
- SubscriptionConfirmedComponent - verification success page
- UnsubscribedComponent - unsubscribe confirmation

## Data Flow
- Categories selected on age gate → stored in cookie
- After terms acceptance → redirect to first selected newsletter signup
- Form submission detected → email extracted
- Email sent to SendGrid API with categories
- Backend formats categories → sends to SendGrid as custom fields
- SendGrid sends verification email with categories included

## Error Handling
- Age verification errors
- Category selection validation
- Email validation errors
- SendGrid API error handling
- Network error handling
- User-friendly error messages

## Development Features
- TypeScript type safety
- Standalone Angular components
- Service-based architecture
- Environment-based API URLs
- Console logging for debugging
- Linter error checking

