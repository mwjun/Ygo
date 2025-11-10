# Newsletter Remake - Angular Version

This is an Angular rewrite of the Yu-Gi-Oh! Newsletter Signup System, maintaining all the same functionality as the original PHP version.

## Features

- **Age Verification**: Users must verify they are 16+ years old before accessing signup forms
- **Cookie-based Session**: Age verification status stored in cookies (2-hour expiry)
- **Three Newsletter Signups**:
  - Duel Links
  - Master Duel
  - Trading Card Game (TCG)
- **Route Guards**: Automatic redirection to age gate if not verified
- **Same Styling**: Maintains the same visual appearance as the original

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10 or higher)

### Installation

1. Navigate to the project directory:
```bash
cd Newsletter_Remake/newsletter-app
```

2. Install dependencies:
```bash
npm install
```

### Development Server

Run the development server:
```bash
npm start
```

Or:
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
newsletter-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── age-gate/          # Age verification component
│   │   │   ├── home/              # Home page with navigation
│   │   │   ├── dl-signup/         # Duel Links signup
│   │   │   ├── md-signup/         # Master Duel signup
│   │   │   ├── tcg-signup/        # TCG signup
│   │   │   └── error/             # Error page for age verification failure
│   │   ├── services/
│   │   │   └── cookie.ts          # Cookie management service
│   │   ├── guards/
│   │   │   └── age-verification-guard.ts  # Route guard for age verification
│   │   ├── app.routes.ts          # Application routes
│   │   └── app.config.ts          # App configuration
│   ├── assets/                     # Static assets (images)
│   └── styles.css                  # Global styles
```

## Routes

- `/` - Home page with newsletter selection
- `/dl-signup/age-gate` - Duel Links age verification
- `/dl-signup` - Duel Links signup form (requires age verification)
- `/md-signup/age-gate` - Master Duel age verification
- `/md-signup` - Master Duel signup form (requires age verification)
- `/tcg-signup/age-gate` - TCG age verification
- `/tcg-signup` - TCG signup form (requires age verification)
- `/error` - Error page for failed age verification

## Key Differences from PHP Version

1. **Framework**: Angular instead of PHP
2. **Client-side Routing**: Uses Angular Router instead of server-side redirects
3. **Type Safety**: TypeScript provides type safety
4. **Component-based**: Modular component architecture
5. **Service Layer**: Cookie management abstracted into a service
6. **Route Guards**: Automatic protection of routes requiring age verification

## Functionality Maintained

- ✅ Age verification (16+ years old)
- ✅ Cookie-based session management (2-hour expiry)
- ✅ Three separate newsletter signup pages
- ✅ Same form iframes from sg-form.com
- ✅ Same styling and branding
- ✅ Same legal text and disclaimers
- ✅ Same error handling

## Notes

- The application uses the same external form URLs as the original
- Images are copied from the original project to maintain branding
- Cookie implementation matches the original behavior
- Age calculation logic is identical to the PHP version

