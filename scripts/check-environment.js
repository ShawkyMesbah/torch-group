/**
 * Environment Check Script
 * 
 * This script checks for critical environment variables and provides
 * information about running in development mode with missing variables.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ENV_FILE_PATH = path.join(process.cwd(), '.env');
const CRITICAL_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const FALLBACK_VARS = [
  'FALLBACK_ADMIN_EMAIL',
  'FALLBACK_ADMIN_NAME',
  'FALLBACK_ADMIN_ID',
  'FALLBACK_ADMIN_ROLE'
];

// ANSI color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Check if we're in production mode
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

// Main function
function main() {
  console.log(`\n${COLORS.cyan}${COLORS.bold}=========================================${COLORS.reset}`);
  console.log(`${COLORS.cyan}${COLORS.bold}  TORCH GROUP ENVIRONMENT CHECK${COLORS.reset}`);
  console.log(`${COLORS.cyan}${COLORS.bold}=========================================${COLORS.reset}\n`);
  
  // Check for .env file
  if (!fileExists(ENV_FILE_PATH)) {
    console.log(`${COLORS.yellow}⚠️ No .env file found${COLORS.reset}`);
    console.log("   This is fine for deployment platforms like Vercel");
    console.log("   but local development may need environment variables.\n");
  } else {
    console.log(`${COLORS.green}✅ .env file exists${COLORS.reset}\n`);
  }
  
  // Check environment mode
  const mode = isProduction() ? `${COLORS.bold}${COLORS.red}production${COLORS.reset}` : `${COLORS.bold}${COLORS.green}development${COLORS.reset}`;
  console.log(`Running in ${mode} mode\n`);
  
  // Check for critical environment variables
  console.log(`${COLORS.bold}Critical Environment Variables:${COLORS.reset}`);
  
  let missingCriticalVars = 0;
  let hasFallbacks = true;
  
  for (const envVar of CRITICAL_VARS) {
    if (!process.env[envVar]) {
      missingCriticalVars++;
      console.log(`${COLORS.red}❌ ${envVar} is missing${COLORS.reset}`);
    } else {
      console.log(`${COLORS.green}✅ ${envVar} is set${COLORS.reset}`);
    }
  }
  
  console.log('');
  
  // Check for fallback variables if in development mode
  if (!isProduction() && missingCriticalVars > 0) {
    console.log(`${COLORS.bold}Development Fallback Variables:${COLORS.reset}`);
    
    for (const envVar of FALLBACK_VARS) {
      if (!process.env[envVar]) {
        console.log(`${COLORS.yellow}⚠️ ${envVar} is missing (will use defaults)${COLORS.reset}`);
        hasFallbacks = false;
      } else {
        console.log(`${COLORS.green}✅ ${envVar} is set${COLORS.reset}`);
      }
    }
    
    console.log('');
  }
  
  // Show summary and recommendations
  console.log(`${COLORS.bold}Summary:${COLORS.reset}`);
  
  if (missingCriticalVars === 0) {
    console.log(`${COLORS.green}✅ All critical environment variables are set.${COLORS.reset}`);
    console.log("   The application should work properly.");
  } else if (!isProduction()) {
    console.log(`${COLORS.yellow}⚠️ Missing ${missingCriticalVars} critical environment variables.${COLORS.reset}`);
    console.log("   Since you're in development mode, fallbacks will be used:");
    
    if (!process.env.DATABASE_URL) {
      console.log(`   - ${COLORS.cyan}Mock database client${COLORS.reset} will simulate database operations`);
    }
    
    if (!process.env.NEXTAUTH_SECRET) {
      console.log(`   - ${COLORS.cyan}Mock authentication${COLORS.reset} will provide a default admin user`);
      
      if (!hasFallbacks) {
        console.log(`     Username: ${COLORS.bold}admin@example.com${COLORS.reset}`);
        console.log(`     Role: ${COLORS.bold}ADMIN${COLORS.reset}`);
      }
    }
    
    console.log("\n   Limited functionality will be available, but the app should work for UI development.");
  } else {
    console.log(`${COLORS.red}❌ Missing ${missingCriticalVars} critical environment variables in production.${COLORS.reset}`);
    console.log("   The application will likely have errors. Please set all required variables.");
  }
  
  console.log(`\n${COLORS.cyan}${COLORS.bold}=========================================${COLORS.reset}`);
}

// Run the script
main(); 