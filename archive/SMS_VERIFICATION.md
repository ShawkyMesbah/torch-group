# SMS Verification for Contact Form

This document explains how the SMS verification system works in the Torch Group website's contact form.

## Overview

The SMS verification feature adds an extra layer of validation to the contact form by verifying that users have access to the phone number they provided. This helps prevent spam and ensures that the site's administrators can contact users via phone if needed.

## How It Works

1. **User enters phone number** - When a user fills out the contact form and enters a phone number, they are prompted to verify the number.

2. **Verification code is sent** - When the user clicks the "Verify" button, a 6-digit verification code is sent to their phone via SMS.

3. **User enters code** - The user enters the received code in the verification field.

4. **System verifies code** - The system checks if the code matches what was sent.

5. **Form submission** - If verification is successful, the user can submit the contact form. If the user has provided a phone number but hasn't verified it, they'll be prompted to complete verification before submission.

## Technical Implementation

### API Endpoints

- `POST /api/contact/send-verification` - Sends a verification code to the provided phone number
- `POST /api/contact/verify-code` - Verifies the code entered by the user

### Security Features

- **Rate limiting** - Limited to 3 verification requests per 5-minute window per IP address
- **Code expiration** - Verification codes expire after 5 minutes
- **Attempt limiting** - Limited to 5 verification attempts per code
- **In-memory storage** - Codes are stored in memory, not in the database, for better security

### Twilio Integration

The system uses Twilio for sending SMS messages. If Twilio credentials are not configured, it falls back to a "mock mode" that simulates the verification process without actually sending SMS (useful for development and testing).

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=your_twilio_phone_number
```

You can use the `create-env-with-twilio.ps1` script to create or update your `.env` file with these variables.

### Testing the Integration

To test if your Twilio integration is working correctly, run:

```
node test-sms-verification.js +1234567890
```

Replace `+1234567890` with the actual phone number you want to test with.

## Development Mode

In development mode (`NODE_ENV !== "production"`), the verification code is returned in the API response and logged to the console, making it easier to test without needing to receive actual SMS messages.

## Troubleshooting

Common issues:

1. **"Rate limit exceeded" error** - Wait 5 minutes before trying again
2. **"Verification code has expired" error** - Request a new code
3. **"Failed to send verification code" error** - Check your Twilio credentials and account balance
4. **SMS not received** - Make sure the phone number is entered correctly and that your Twilio account has permission to send SMS to that country 