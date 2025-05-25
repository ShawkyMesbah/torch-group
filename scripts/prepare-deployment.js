/**
 * Prepare the Torch Group project for deployment
 * This script verifies required files, builds the project, and prepares for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration checks before deployment
function checkConfiguration() {
  console.log('🔍 Checking project configuration...');

  // 1. Check if .env file exists
  if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
    console.error('❌ .env file is missing. Please create it first.');
    return false;
  }

  // 2. Check if required SEO files exist
  const requiredFiles = [
    'public/robots.txt',
    'public/sitemap.xml',
    'public/favicon.ico'
  ];

  let missingFiles = false;
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      console.error(`❌ Missing required file: ${file}`);
      missingFiles = true;
    }
  });

  if (missingFiles) {
    return false;
  }

  // 3. Check for OG image
  if (!fs.existsSync(path.join(process.cwd(), 'public/images/og-image.jpg'))) {
    console.warn('⚠️ Warning: OG image (public/images/og-image.jpg) is missing or placeholder. SEO will be affected.');
  }

  console.log('✅ Configuration checks passed');
  return true;
}

// Run build process
function runBuild() {
  console.log('🏗️ Building project...');
  try {
    // Ensure we have latest dependencies
    execSync('npm ci', { stdio: 'inherit' });
    
    // Generate Prisma client
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Run Next.js build
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Main process
function main() {
  console.log('🚀 Preparing Torch Group for deployment');
  
  const configOk = checkConfiguration();
  if (!configOk) {
    console.error('❌ Configuration check failed. Please fix the issues before deploying.');
    process.exit(1);
  }
  
  const buildOk = runBuild();
  if (!buildOk) {
    console.error('❌ Build process failed. Please fix the issues before deploying.');
    process.exit(1);
  }
  
  console.log('\n🎉 Project is ready for deployment!');
  console.log('Next steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Deploy to Vercel using the instructions in VERCEL_DEPLOYMENT.md');
  console.log('3. After deployment, run scripts/verify-deployment.js to confirm everything works');
}

main(); 