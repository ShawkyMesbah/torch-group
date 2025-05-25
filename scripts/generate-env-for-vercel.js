/**
 * Generate environment variables for Vercel deployment
 * This script reads the local .env file and outputs a formatted version for Vercel
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the .env file
const envPath = path.join(process.cwd(), '.env');

// Function to read the .env file
function readEnvFile() {
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create one first.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  const variables = {};
  
  // Parse each line to extract variable name and value
  lines.forEach(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) return;
    
    // Extract variable name and value
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, name, value] = match;
      variables[name.trim()] = value.trim();
    }
  });
  
  return variables;
}

// Output environment variables for Vercel
function outputForVercel(variables) {
  console.log('\n🔐 Environment Variables for Vercel\n');
  console.log('Copy and paste these into your Vercel project settings:\n');
  
  // Required for production
  const requiredVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NODE_ENV'
  ];
  
  console.log('## Required Variables:');
  requiredVars.forEach(varName => {
    if (variables[varName]) {
      // For DATABASE_URL, suggest connection pooling format
      if (varName === 'DATABASE_URL' && !variables[varName].includes('pgbouncer=true')) {
        console.log(`${varName}=${variables[varName]}&pgbouncer=true&connection_limit=1&pool_timeout=20`);
      } else if (varName === 'NEXTAUTH_URL' && variables[varName].includes('localhost')) {
        console.log(`${varName}=https://torchgroup.co`);
      } else {
        console.log(`${varName}=${variables[varName]}`);
      }
    } else {
      console.log(`${varName}=MISSING - PLEASE SET MANUALLY`);
    }
  });
  
  // Optional variables
  console.log('\n## Optional Variables:');
  const optionalVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_FROM_NUMBER',
    'UPLOADTHING_SECRET',
    'UPLOADTHING_APP_ID',
    'ANALYTICS_ENABLED',
    'SITE_URL'
  ];
  
  optionalVars.forEach(varName => {
    if (variables[varName]) {
      console.log(`${varName}=${variables[varName]}`);
    } else {
      console.log(`${varName}=`);
    }
  });
  
  console.log('\n✅ Done! Use these environment variables in your Vercel project settings.');
}

// Main function
function main() {
  console.log('🚀 Generating environment variables for Vercel deployment');
  const variables = readEnvFile();
  outputForVercel(variables);
}

main(); 