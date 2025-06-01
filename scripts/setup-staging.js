const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const stagingEnvTemplate = `# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/torch-group-staging
DIRECT_URL=postgresql://postgres:[password]@[host]:[port]/torch-group-staging?schema=public&sslmode=require

# NextAuth Configuration
NEXTAUTH_SECRET=staging-secret-key-replace-this
NEXTAUTH_URL=https://staging.torchgroup.co

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]

# Email Configuration
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=staging@torchgroup.co
SMTP_PASSWORD=[smtp-password]
SMTP_FROM=Torch Group Staging <staging@torchgroup.co>
RESEND_API_KEY=[staging-resend-api-key]

# UploadThing Configuration 
UPLOADTHING_SECRET=[staging-uploadthing-secret]
UPLOADTHING_APP_ID=[staging-uploadthing-app-id]

# Application Configuration
NODE_ENV=staging
NEXT_PUBLIC_BASE_URL=https://staging.torchgroup.co
SITE_URL=https://staging.torchgroup.co

# Analytics Configuration
ANALYTICS_ENABLED=true
ANALYTICS_FILE_FALLBACK=true

# Feature Flags
ENABLE_BLOG=true
ENABLE_NEWSLETTER=true
ENABLE_PHONE_VERIFICATION=true
ENABLE_FILE_UPLOAD=true`;

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupStagingEnvironment() {
  console.log('Setting up staging environment...\n');

  const envPath = path.join(process.cwd(), '.env.staging');

  // Check if .env.staging already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await promptUser('.env.staging already exists. Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Get configuration values from user
  const dbPassword = await promptUser('Enter staging database password: ');
  const dbHost = await promptUser('Enter staging database host: ');
  const dbPort = await promptUser('Enter staging database port (5432): ') || '5432';
  const supabaseProjectId = await promptUser('Enter Supabase project ID: ');
  const supabaseAnonKey = await promptUser('Enter Supabase anon key: ');
  const supabaseServiceKey = await promptUser('Enter Supabase service role key: ');
  const resendApiKey = await promptUser('Enter Resend API key: ');
  const uploadthingSecret = await promptUser('Enter UploadThing secret: ');
  const uploadthingAppId = await promptUser('Enter UploadThing app ID: ');

  // Replace placeholders in template
  let envContent = stagingEnvTemplate
    .replace(/\[password\]/g, dbPassword)
    .replace(/\[host\]/g, dbHost)
    .replace(/\[port\]/g, dbPort)
    .replace(/\[project-id\]/g, supabaseProjectId)
    .replace(/\[staging-anon-key\]/g, supabaseAnonKey)
    .replace(/\[staging-service-role-key\]/g, supabaseServiceKey)
    .replace(/\[staging-resend-api-key\]/g, resendApiKey)
    .replace(/\[staging-uploadthing-secret\]/g, uploadthingSecret)
    .replace(/\[staging-uploadthing-app-id\]/g, uploadthingAppId);

  // Write the file
  fs.writeFileSync(envPath, envContent);

  console.log('\nStaging environment configuration has been created at .env.staging');
  console.log('\nNext steps:');
  console.log('1. Review the .env.staging file and adjust any values if needed');
  console.log('2. Set up the staging database: npm run db:setup -- --env staging');
  console.log('3. Deploy to staging environment: npm run deploy:staging');

  rl.close();
}

setupStagingEnvironment().catch(console.error); 