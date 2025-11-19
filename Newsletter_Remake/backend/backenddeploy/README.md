# Newsletter Backend API

Backend service for handling newsletter signups with SendGrid integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your SendGrid API key and email to `.env`:
```
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### POST `/api/newsletter/signup`
Sign up a user for a newsletter.

**Request Body:**
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

### GET `/api/health`
Health check endpoint.

## SendGrid Setup

1. Create a SendGrid account at https://sendgrid.com
2. Generate an API key in SendGrid dashboard
3. Verify your sender email address
4. Add the API key to your `.env` file

