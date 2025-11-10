# Newsletter Remake - Architecture Documentation

## Overview

This Angular application has been designed with **modularity**, **loose coupling**, and **high cohesion** as core principles. The architecture follows Angular best practices with standalone components, dependency injection, and clear separation of concerns.

## Architecture Principles

### 1. Modularity
- **Standalone Components**: All components are standalone, reducing dependencies
- **Feature-based Organization**: Components organized by feature (home, signup, shared)
- **Reusable Components**: Shared components can be used across multiple features

### 2. Loose Coupling
- **Dependency Injection**: Services injected via constructor, not hard-coded
- **Interface-based Design**: Models define contracts between components
- **Event-driven Communication**: Components communicate via events, not direct references
- **Service Layer**: Business logic abstracted into services

### 3. High Cohesion
- **Single Responsibility**: Each component/service has one clear purpose
- **Focused Components**: Components do one thing well
- **Related Functionality Grouped**: Related features grouped together

## Project Structure

```
src/app/
├── components/
│   ├── shared/              # Reusable UI components
│   │   ├── header/          # Konami logo header
│   │   ├── footer/          # Footer with content rating
│   │   ├── newsletter-logo/ # Newsletter-specific logo
│   │   ├── form-container/  # Iframe form wrapper
│   │   ├── legal-text/      # Legal disclaimer text
│   │   ├── page-container/  # Page wrapper with styling
│   │   └── age-form/        # Age verification form
│   ├── home/                # Landing page
│   ├── age-gate/            # Age verification page
│   ├── dl-signup/           # Duel Links signup
│   ├── md-signup/           # Master Duel signup
│   ├── tcg-signup/          # TCG signup
│   └── error/               # Error page
├── services/
│   ├── cookie.ts            # Cookie management
│   └── newsletter-config.ts # Newsletter configuration
├── guards/
│   └── age-verification-guard.ts # Route protection
├── models/
│   └── newsletter-type.ts   # Type definitions
└── app.routes.ts            # Application routing
```

## Component Hierarchy

### Shared Components (Reusable)

1. **PageContainerComponent**
   - Purpose: Wrapper for page content with consistent styling
   - Props: `maxWidth` ('narrow' | 'wide')
   - Used by: All page components

2. **HeaderComponent**
   - Purpose: Displays Konami logo
   - Props: None (uses service/config)
   - Used by: All pages except home

3. **FooterComponent**
   - Purpose: Displays content rating and version
   - Props: `contentRatingPath`, `version`
   - Used by: All pages except home

4. **NewsletterLogoComponent**
   - Purpose: Displays newsletter-specific logo
   - Props: `logoPath`, `altText`
   - Used by: Age gate, signup pages

5. **FormContainerComponent**
   - Purpose: Wraps iframe form with security
   - Props: `formUrl`
   - Used by: All signup pages

6. **LegalTextComponent**
   - Purpose: Displays legal disclaimers
   - Props: None
   - Used by: All signup pages

7. **AgeFormComponent**
   - Purpose: Age verification form logic
   - Events: `ageVerified`, `ageRejected`
   - Used by: Age gate page

### Feature Components

1. **HomeComponent**
   - Purpose: Landing page with newsletter selection
   - Dependencies: NewsletterConfigService, RouterModule

2. **AgeGateComponent**
   - Purpose: Age verification page
   - Dependencies: CookieService, NewsletterConfigService, Router
   - Uses: PageContainer, Header, Footer, NewsletterLogo, AgeForm

3. **DlSignupComponent / MdSignupComponent / TcgSignupComponent**
   - Purpose: Newsletter signup pages
   - Dependencies: CookieService, NewsletterConfigService, Router
   - Uses: PageContainer, Header, Footer, NewsletterLogo, FormContainer, LegalText

4. **ErrorComponent**
   - Purpose: Error page for failed age verification
   - Dependencies: RouterModule

## Services

### CookieService
- **Responsibility**: Cookie management for age verification
- **Methods**:
  - `setLegalCookie(value: 'yes' | 'no')`: Set age verification cookie
  - `getLegalCookie()`: Get cookie value
  - `isAgeVerified()`: Check if user is verified
  - `calculateAge()`: Calculate age from birth date
  - `isValidDate()`: Validate date

### NewsletterConfigService
- **Responsibility**: Centralized newsletter configuration
- **Methods**:
  - `getConfig(type: NewsletterType)`: Get config for newsletter type
  - `getAllConfigs()`: Get all newsletter configs
  - `getTypeFromRoute(route: string)`: Extract type from route

## Models

### NewsletterType
```typescript
export type NewsletterType = 'dl' | 'md' | 'tcg';

export interface NewsletterConfig {
  type: NewsletterType;
  title: string;
  logoPath: string;
  formUrl: string;
  routePath: string;
}
```

## Guards

### AgeVerificationGuard
- **Purpose**: Protect routes requiring age verification
- **Logic**: Checks cookie, redirects to age gate if not verified

## Data Flow

1. **User Navigation**:
   - User clicks newsletter link → Router navigates
   - Guard checks age verification → Redirects if needed
   - Component loads → Fetches config from service

2. **Age Verification**:
   - User submits age form → AgeFormComponent validates
   - CookieService sets cookie → Emits event
   - AgeGateComponent handles event → Navigates to signup

3. **Signup Flow**:
   - Component checks cookie → Redirects if not verified
   - Loads config from NewsletterConfigService
   - Renders shared components with config data

## Benefits of This Architecture

1. **Maintainability**: Changes to shared components affect all pages
2. **Testability**: Components can be tested in isolation
3. **Scalability**: Easy to add new newsletters or features
4. **Reusability**: Shared components reduce code duplication
5. **Type Safety**: TypeScript interfaces ensure consistency
6. **Separation of Concerns**: UI, business logic, and data separated

## Adding a New Newsletter

1. Add config to `NewsletterConfigService`
2. Create signup component (or use base class)
3. Add route in `app.routes.ts`
4. Update home component (automatic if using service)

## Best Practices Followed

- ✅ Standalone components for better tree-shaking
- ✅ Dependency injection for loose coupling
- ✅ Single responsibility principle
- ✅ Interface-based design
- ✅ Event-driven communication
- ✅ Service layer for business logic
- ✅ Type safety with TypeScript
- ✅ Reusable shared components
- ✅ Consistent styling approach

