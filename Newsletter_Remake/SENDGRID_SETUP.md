# SendGrid Integration Setup Guide

## Overview

This project now includes SendGrid integration for handling newsletter signups. The setup consists of:

1. **Backend API** (`/backend`) - Node.js/Express server that handles SendGrid API calls
2. **Angular Service** (`/newsletter-app/src/app/services/sendgrid.ts`) - Service for making API calls from the frontend

## Setup Steps

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd Newsletter_Remake/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# Copy the example file
cp .env.example .env
```

4. Get your SendGrid API key:
   - Sign up at https://sendgrid.com (free tier available)
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

5. Verify your sender email in SendGrid:
   - Go to Settings → Sender Authentication
   - Verify your email address or domain

6. Update `.env` file:
```
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
PORT=3001
NODE_ENV=development
```

7. Start the backend server:
```bash
npm start
# or for development:
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Angular Frontend

The Angular service is already created. To use it in components:

```typescript
import { SendGridService } from '../../services/sendgrid';

constructor(private sendGridService: SendGridService) {}

signup(email: string, newsletterType: 'dl' | 'md' | 'tcg') {
  this.sendGridService.signup({
    email: email,
    newsletterType: newsletterType
  }).subscribe({
    next: (response) => {
      console.log('Signup successful:', response);
    },
    error: (error) => {
      console.error('Signup failed:', error);
    }
  });
}
```

### 3. Integration Options

**Option A: Replace iframe forms with custom forms**
- Create custom signup forms in Angular
- Submit to the backend API instead of third-party forms
- SendGrid will send confirmation emails

**Option B: Use alongside existing forms**
- Keep existing iframe forms
- Add SendGrid for sending confirmation emails after signup
- Track signups in your own system

## API Endpoint

**POST** `http://localhost:3001/api/newsletter/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "newsletterType": "dl",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully signed up for newsletter"
}
```

## Security Notes

- **Never commit `.env` file** - It contains your API key
- **Use environment variables** in production
- **Validate email addresses** on both frontend and backend
- **Rate limiting** - Consider adding rate limiting to prevent abuse
- **CORS** - Configure CORS properly for production

## Testing

1. Start the backend: `cd backend && npm start`
2. Start Angular: `cd newsletter-app && npm start`
3. Test the API endpoint using the Angular service or Postman

## Production Deployment

1. Set environment variables on your hosting platform
2. Update `apiUrl` in `sendgrid.ts` to point to your production backend
3. Configure CORS on the backend for your production domain
4. Use HTTPS in production

