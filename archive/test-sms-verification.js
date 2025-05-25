// Test script for SMS verification
require('dotenv').config();
const twilio = require('twilio');

// Check if Twilio credentials are configured
const twilioConfigured = process.env.TWILIO_ACCOUNT_SID && 
                         process.env.TWILIO_AUTH_TOKEN && 
                         process.env.TWILIO_FROM_NUMBER;

console.log('Twilio Integration Status:');
console.log('--------------------------');
console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID ? "✓ Configured" : "✗ Missing"}`);
console.log(`TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN ? "✓ Configured" : "✗ Missing"}`);
console.log(`TWILIO_FROM_NUMBER: ${process.env.TWILIO_FROM_NUMBER ? "✓ Configured" : "✗ Missing"}`);
console.log('--------------------------');

if (!twilioConfigured) {
  console.log('⚠️ Twilio is not fully configured. You will be running in mock mode.');
  console.log('To enable real SMS, add the required environment variables to your .env file.');
  console.log('You can use the create-env-with-twilio.ps1 script to update your configuration.');
  process.exit(0);
}

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Test phone number
const testPhoneNumber = process.argv[2];

if (!testPhoneNumber) {
  console.log('❌ Error: Please provide a test phone number as an argument.');
  console.log('Example: node test-sms-verification.js +1234567890');
  process.exit(1);
}

// Generate a test verification code
const testCode = Math.floor(100000 + Math.random() * 900000).toString();

console.log(`🔄 Sending test verification code ${testCode} to ${testPhoneNumber}...`);

// Send the SMS
twilioClient.messages.create({
  body: `Your Torch Group test verification code is: ${testCode}`,
  from: process.env.TWILIO_FROM_NUMBER,
  to: testPhoneNumber,
})
.then(message => {
  console.log(`✅ SMS sent successfully! SID: ${message.sid}`);
  console.log(`📱 The phone number ${testPhoneNumber} should receive a verification code shortly.`);
})
.catch(error => {
  console.error('❌ Failed to send SMS:', error.message);
  console.log('Common issues:');
  console.log('- Make sure your Twilio account is active and not in trial mode for non-verified numbers');
  console.log('- Check that your Twilio phone number is properly configured for SMS');
  console.log('- Verify that the destination phone number is in a valid format');
}); 