const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function deployStagingEnvironment() {
  console.log('Starting staging deployment...\n');

  // Check if .env.staging exists
  const envPath = path.join(process.cwd(), '.env.staging');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.staging file not found. Run setup-staging.js first.');
    process.exit(1);
  }

  try {
    // Build the application with staging env
    console.log('Building application with staging configuration...');
    execSync('npm run build', {
      env: {
        ...process.env,
        NODE_ENV: 'staging',
        NEXT_PUBLIC_ENV: 'staging'
      },
      stdio: 'inherit'
    });

    // Run database migrations
    console.log('\nRunning database migrations...');
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        NODE_ENV: 'staging'
      },
      stdio: 'inherit'
    });

    // Run post-deployment checks
    console.log('\nRunning post-deployment checks...');
    
    // Check database connection
    execSync('node scripts/db-check.js --env staging', { stdio: 'inherit' });
    
    // Run health checks
    execSync('node scripts/health-check.js --env staging', { stdio: 'inherit' });
    
    // Run performance tests
    console.log('\nRunning performance tests...');
    execSync('npx playwright test performance.test.ts --project=chromium', {
      env: {
        ...process.env,
        NODE_ENV: 'staging',
        PLAYWRIGHT_TEST_BASE_URL: 'https://staging.torchgroup.co'
      },
      stdio: 'inherit'
    });

    console.log('\nStaging deployment completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the staging environment at https://staging.torchgroup.co');
    console.log('2. Check the performance test results');
    console.log('3. Run manual smoke tests if needed');

  } catch (error) {
    console.error('\nDeployment failed:', error.message);
    process.exit(1);
  }
}

deployStagingEnvironment().catch(console.error); 