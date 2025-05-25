/**
 * Deployment Preparation Script
 * 
 * This script prepares the Torch Group project for deployment by:
 * 1. Running database migrations if needed
 * 2. Ensuring all required directories exist
 * 3. Validating environment variables
 * 4. Generating a timestamp for the deployment
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const REQUIRED_DIRS = [
  'public/data',
  'public/settings',
  'data/analytics',
];

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Create a directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  } else {
    console.log(`ℹ️ Directory already exists: ${dirPath}`);
  }
}

// Execute a command and return a promise
function executeCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, { stdio: 'inherit' });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// Update the deployment timestamp file
function updateDeploymentTimestamp() {
  const timestampPath = path.join(process.cwd(), 'public', 'deployment-info.json');
  const timestamp = new Date().toISOString();
  
  const deploymentInfo = {
    timestamp,
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'production',
  };
  
  fs.writeFileSync(timestampPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`✅ Updated deployment timestamp: ${timestamp}`);
}

// Validate critical environment variables
function validateEnvironment() {
  console.log('\n📋 Validating environment variables...');
  
  const criticalVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];
  
  const warnings = [
    'RESEND_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'UPLOADTHING_SECRET',
  ];
  
  let hasErrors = false;
  let hasWarnings = false;
  
  for (const envVar of criticalVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing critical environment variable: ${envVar}`);
      hasErrors = true;
    } else {
      console.log(`✅ Found environment variable: ${envVar}`);
    }
  }
  
  for (const envVar of warnings) {
    if (!process.env[envVar]) {
      console.warn(`⚠️ Missing recommended environment variable: ${envVar}`);
      hasWarnings = true;
    } else {
      console.log(`✅ Found environment variable: ${envVar}`);
    }
  }
  
  if (hasErrors) {
    throw new Error('Missing critical environment variables');
  }
  
  if (hasWarnings) {
    console.warn('\n⚠️ Some recommended environment variables are missing.');
    console.warn('The application will still build but some features may be limited.');
  }
  
  console.log('✅ Environment validation complete');
}

// Main function
async function main() {
  console.log('🚀 Preparing Torch Group for deployment...\n');
  
  try {
    // Step 1: Ensure all required directories exist
    console.log('\n📁 Ensuring required directories exist...');
    for (const dir of REQUIRED_DIRS) {
      ensureDirectoryExists(path.join(process.cwd(), dir));
    }
    
    // Step 2: Update deployment timestamp
    console.log('\n⏱️ Updating deployment timestamp...');
    updateDeploymentTimestamp();
    
    // Step 3: Run database migrations if needed
    // This is commented out in this version since we're using db push for simplicity
    // console.log('\n🔄 Running database migrations...');
    // await executeCommand('npx', ['prisma', 'migrate', 'deploy']);
    
    // Step 4: Build the application
    console.log('\n🏗️ Building the application...');
    await executeCommand('npm', ['run', 'build']);
    
    console.log('\n✅ Deployment preparation complete!');
    console.log('You can now deploy the application to Vercel.');
    
  } catch (error) {
    console.error('\n❌ Deployment preparation failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main(); 