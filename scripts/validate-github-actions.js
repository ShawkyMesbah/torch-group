#!/usr/bin/env node

/**
 * GitHub Actions Workflow Validation Script
 * Validates the deploy.yml workflow configuration
 */

const fs = require('fs');
const path = require('path');

const WORKFLOW_PATH = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');

function validateWorkflow() {
  console.log('🔍 Validating GitHub Actions workflow...\n');

  // Check if workflow file exists
  if (!fs.existsSync(WORKFLOW_PATH)) {
    console.error('❌ GitHub Actions workflow file not found at:', WORKFLOW_PATH);
    process.exit(1);
  }

  // Read workflow content
  const workflowContent = fs.readFileSync(WORKFLOW_PATH, 'utf8');
  
  // Read package.json to check scripts
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const scripts = packageJson.scripts || {};

  const checks = [
    {
      name: 'Workflow file exists',
      check: () => fs.existsSync(WORKFLOW_PATH),
      fix: 'Ensure .github/workflows/deploy.yml exists'
    },
    {
      name: 'Contains required secrets references',
      check: () => {
        const requiredSecrets = [
          'VERCEL_TOKEN',
          'VERCEL_ORG_ID', 
          'VERCEL_PROJECT_ID',
          'DATABASE_URL',
          'NEXTAUTH_SECRET'
        ];
        return requiredSecrets.every(secret => workflowContent.includes(`secrets.${secret}`));
      },
      fix: 'Add missing secret references to the workflow'
    },
    {
      name: 'Test scripts exist in package.json',
      check: () => {
        const requiredScripts = ['test:ci', 'test:performance'];
        return requiredScripts.every(script => scripts[script]);
      },
      fix: 'Add missing test scripts to package.json'
    },
    {
      name: 'Health check endpoint referenced',
      check: () => workflowContent.includes('/api/health'),
      fix: 'Ensure health check endpoint is properly referenced'
    },
    {
      name: 'Deployment URL validation',
      check: () => workflowContent.includes('deploy-url') && workflowContent.includes('GITHUB_OUTPUT'),
      fix: 'Ensure deployment URL is properly captured and validated'
    },
    {
      name: 'Environment-specific deployment',
      check: () => workflowContent.includes('--prod') && workflowContent.includes('github.event.inputs.environment'),
      fix: 'Ensure production and staging deployments are handled differently'
    }
  ];

  let allPassed = true;
  let passedCount = 0;

  checks.forEach((check, index) => {
    const passed = check.check();
    const status = passed ? '✅' : '❌';
    const number = (index + 1).toString().padStart(2, '0');
    
    console.log(`${status} ${number}. ${check.name}`);
    
    if (!passed) {
      console.log(`   💡 Fix: ${check.fix}`);
      allPassed = false;
    } else {
      passedCount++;
    }
  });

  console.log(`\n📊 Results: ${passedCount}/${checks.length} checks passed`);

  if (allPassed) {
    console.log('🎉 All GitHub Actions workflow validations passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Ensure all secrets are configured in GitHub repository settings');
    console.log('2. Test the workflow with a manual trigger');
    console.log('3. Monitor the deployment process');
  } else {
    console.log('⚠️  Some validations failed. Please address the issues above.');
    process.exit(1);
  }
}

// Additional validation functions
function validateSecrets() {
  console.log('\n🔐 Required GitHub Secrets:');
  const requiredSecrets = [
    { name: 'VERCEL_TOKEN', description: 'Vercel deployment token' },
    { name: 'VERCEL_ORG_ID', description: 'Vercel organization ID' },
    { name: 'VERCEL_PROJECT_ID', description: 'Vercel project ID' },
    { name: 'DATABASE_URL', description: 'Production database connection string' },
    { name: 'DIRECT_URL', description: 'Direct database connection for migrations' },
    { name: 'NEXTAUTH_SECRET', description: 'NextAuth secret key' },
    { name: 'NEXTAUTH_URL', description: 'Production site URL' },
    { name: 'RESEND_API_KEY', description: 'Resend email service API key' },
    { name: 'UPLOADTHING_SECRET', description: 'UploadThing secret key' },
    { name: 'UPLOADTHING_APP_ID', description: 'UploadThing application ID' }
  ];

  requiredSecrets.forEach((secret, index) => {
    const number = (index + 1).toString().padStart(2, '0');
    console.log(`   ${number}. ${secret.name} - ${secret.description}`);
  });

  console.log('\n💡 Configure these secrets in GitHub repository settings:');
  console.log('   Settings → Secrets and variables → Actions → New repository secret');
}

function validateEnvironments() {
  console.log('\n🌍 GitHub Environments:');
  console.log('   1. staging - For testing deployments');
  console.log('   2. production - For live deployments');
  console.log('\n💡 Configure environments in GitHub repository settings:');
  console.log('   Settings → Environments → New environment');
}

// Run validation
if (require.main === module) {
  validateWorkflow();
  validateSecrets();
  validateEnvironments();
}

module.exports = { validateWorkflow, validateSecrets, validateEnvironments }; 