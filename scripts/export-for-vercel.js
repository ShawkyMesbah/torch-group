/**
 * Export the Torch Group project for Vercel deployment
 * This script prepares the project by running checks and generating a deployment package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if required SEO files exist
function checkSEOFiles() {
  console.log('🔍 Checking SEO files...');
  
  const requiredFiles = [
    { path: 'public/robots.txt', name: 'Robots.txt' },
    { path: 'public/sitemap.xml', name: 'Sitemap' },
    { path: 'public/favicon.ico', name: 'Favicon' },
    { path: 'public/images/og-image.jpg', name: 'OG Image' }
  ];
  
  let missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(process.cwd(), file.path))) {
      missingFiles.push(file.name);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`⚠️ Missing SEO files: ${missingFiles.join(', ')}`);
    return false;
  }
  
  console.log('✅ All SEO files exist');
  return true;
}

// Generate deployment-ready environment variables
function generateEnvForVercel() {
  console.log('🔧 Generating environment variables for Vercel...');
  
  try {
    execSync('node scripts/generate-env-for-vercel.js', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('❌ Failed to generate environment variables:', error.message);
    return false;
  }
}

// Run a test build to ensure everything compiles
function runTestBuild() {
  console.log('🏗️ Running test build...');
  
  try {
    // Run Next.js build
    execSync('npm run build -- --no-lint', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Preparing Torch Group for Vercel deployment\n');
  
  // Check SEO files
  const seoFilesOk = checkSEOFiles();
  if (!seoFilesOk) {
    console.log('⚠️ Some SEO files are missing. Consider adding them before deployment.');
  }
  
  // Generate environment variables
  console.log('\nNext, we will generate the environment variables for Vercel.');
  generateEnvForVercel();
  
  // Ask if user wants to run a test build
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('\nDo you want to run a test build before deployment? (y/N): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      await runTestBuild();
    }
    
    // Final instructions
    console.log('\n📋 Deployment Steps:');
    console.log('1. Push your changes to GitHub');
    console.log('2. Import your project in Vercel');
    console.log('3. Copy the environment variables from above to Vercel');
    console.log('4. Deploy your application');
    console.log('5. Run scripts/verify-deployment.js after deployment to verify everything works\n');
    console.log('🎉 Your project is ready for Vercel deployment!');
    
    readline.close();
  });
}

main(); 