// Script to test login functionality through the API
const fetch = require('node-fetch');

async function main() {
  console.log('Testing login API with admin credentials...');
  
  try {
    // Test login with admin credentials
    const response = await fetch('http://localhost:3000/api/test-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@torchgroup.co',
        password: 'admin123',
      }),
    });
    
    const data = await response.json();
    console.log('API response:', data);
    
    if (data.success) {
      console.log('✅ Login successful');
      console.log('Session information:', data.session);
    } else {
      console.log('❌ Login failed');
      console.log('Error message:', data.message || 'No error message provided');
    }
  } catch (error) {
    console.error('❌ Error testing login API:', error);
  }
}

console.log('Note: Make sure your dev server is running on http://localhost:3000');
console.log('Starting test in 2 seconds...');

// Give the server a moment to start if it hasn't already
setTimeout(() => {
  main()
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}, 2000); 