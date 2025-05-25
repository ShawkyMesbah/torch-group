// Script to check if the project is ready for deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

// Create Prisma client with direct connection string
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ttzulxpncujgizidgwxk:Spinal_Shit1709@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function checkDeploymentReadiness() {
  console.log('🔍 Checking deployment readiness...\n');
  let isReady = true;
  const issues = [];
  
  // Check 1: Verify .env files exist
  console.log('Checking environment files...');
  const envExists = fs.existsSync(path.join(__dirname, '..', '.env'));
  const envLocalExists = fs.existsSync(path.join(__dirname, '..', '.env.local'));
  
  if (!envExists) {
    issues.push('❌ .env file is missing');
    isReady = false;
  } else {
    console.log('✅ .env file exists');
  }
  
  if (!envLocalExists) {
    issues.push('⚠️ .env.local file is missing (not critical if .env is correctly configured)');
  } else {
    console.log('✅ .env.local file exists');
  }
  
  // Check 2: Verify OG image exists and has content
  console.log('\nChecking OG image...');
  const ogImagePath = path.join(__dirname, '..', 'public', 'images', 'og-image.jpg');
  
  if (!fs.existsSync(ogImagePath)) {
    issues.push('❌ OG image is missing');
    isReady = false;
  } else {
    const ogImageStats = fs.statSync(ogImagePath);
    if (ogImageStats.size < 1000) { // Less than 1KB is suspicious
      issues.push('⚠️ OG image exists but might be a placeholder (small file size)');
    } else {
      console.log('✅ OG image exists and has proper content');
    }
  }
  
  // Check 3: Check database connection
  console.log('\nChecking database connection...');
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if there's content in the database
    const usersCount = await prisma.user.count();
    const talentsCount = await prisma.talent.count();
    const projectsCount = await prisma.project.count();
    const blogPostsCount = await prisma.blogPost.count();
    
    console.log(`   Users: ${usersCount}`);
    console.log(`   Talents: ${talentsCount}`);
    console.log(`   Projects: ${projectsCount}`);
    console.log(`   Blog Posts: ${blogPostsCount}`);
    
    if (usersCount === 0) {
      issues.push('❌ No users found in the database');
      isReady = false;
    }
    
    if (talentsCount === 0 || projectsCount === 0 || blogPostsCount === 0) {
      issues.push('⚠️ Some content types have no entries (talents, projects, or blog posts)');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    issues.push('❌ Database connection failed');
    isReady = false;
  } finally {
    await prisma.$disconnect();
  }
  
  // Check 4: Try a build
  console.log('\nChecking build...');
  try {
    // We don't need to run the actual build, just check if package.json has a build script
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts || !packageJson.scripts.build) {
      issues.push('❌ No build script found in package.json');
      isReady = false;
    } else {
      console.log('✅ Build script exists in package.json');
    }
  } catch (error) {
    console.error('❌ Error checking build script:', error);
    issues.push('❌ Error checking build script');
    isReady = false;
  }
  
  // Display summary
  console.log('\n=== Deployment Readiness Summary ===');
  if (isReady) {
    console.log('✅ Project is READY for deployment!\n');
  } else {
    console.log('❌ Project is NOT ready for deployment. Please fix the following issues:\n');
    issues.forEach(issue => console.log(`   ${issue}`));
  }
  
  // If there are warnings but project is ready
  if (isReady && issues.length > 0) {
    console.log('\n⚠️ Warnings (not blocking deployment):');
    issues.forEach(issue => {
      if (issue.startsWith('⚠️')) {
        console.log(`   ${issue.substring(2)}`);
      }
    });
  }
  
  // Exit with appropriate code
  return isReady ? 0 : 1;
}

// Run the check and exit with appropriate code
checkDeploymentReadiness()
  .then(exitCode => {
    console.log('\nCheck completed.');
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('Error during readiness check:', error);
    process.exit(1);
  }); 