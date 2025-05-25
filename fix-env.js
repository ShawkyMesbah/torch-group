// Script to fix .env file by adding quotes around connection strings
const fs = require('fs');
const path = require('path');

// Path to .env file
const envPath = path.join(__dirname, '.env');

try {
  console.log('Reading .env file...');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if there are no quotes around DATABASE_URL and DIRECT_URL
  const needsUpdate = !envContent.includes('DATABASE_URL="') || !envContent.includes('DIRECT_URL="');
  
  if (needsUpdate) {
    console.log('Adding quotes around database connection strings...');
    
    // Replace DATABASE_URL line to add quotes
    envContent = envContent.replace(
      /DATABASE_URL=(.*)/,
      'DATABASE_URL="$1"'
    );
    
    // Replace DIRECT_URL line to add quotes
    envContent = envContent.replace(
      /DIRECT_URL=(.*)/,
      'DIRECT_URL="$1"'
    );
    
    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file has been updated with proper formatting.');
  } else {
    console.log('✅ .env file already has properly formatted connection strings.');
  }
} catch (error) {
  console.error('Error updating .env file:', error);
  process.exit(1);
} 