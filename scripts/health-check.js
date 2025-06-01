const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

async function checkEndpoint(url, name) {
  try {
    const start = Date.now();
    const response = await fetch(url);
    const time = Date.now() - start;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`✅ ${name}: ${response.status} (${time}ms)`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed:`, error.message);
    return false;
  }
}

async function runHealthChecks() {
  // Load environment variables based on NODE_ENV
  const env = process.argv.includes('--env') ? 
    process.argv[process.argv.indexOf('--env') + 1] : 
    process.env.NODE_ENV || 'development';

  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${env}`)
  });

  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  console.log(`Running health checks for ${env} environment at ${baseUrl}...\n`);

  const endpoints = [
    { url: `${baseUrl}`, name: 'Homepage' },
    { url: `${baseUrl}/about`, name: 'About page' },
    { url: `${baseUrl}/services`, name: 'Services page' },
    { url: `${baseUrl}/blog`, name: 'Blog page' },
    { url: `${baseUrl}/contact`, name: 'Contact page' },
    { url: `${baseUrl}/api/check-session`, name: 'API: Session check' },
    { url: `${baseUrl}/api/blog/count`, name: 'API: Blog count' },
    { url: `${baseUrl}/api/talents/count`, name: 'API: Talents count' },
  ];

  let failures = 0;

  // Check each endpoint
  for (const endpoint of endpoints) {
    const success = await checkEndpoint(endpoint.url, endpoint.name);
    if (!success) failures++;
  }

  // Check external services
  console.log('\nChecking external services...');

  // Check Supabase connection
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/rest/v1/health`);
    if (response.ok) {
      console.log('✅ Supabase connection: OK');
    } else {
      console.error('❌ Supabase connection failed');
      failures++;
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    failures++;
  }

  // Check UploadThing connection
  try {
    const response = await fetch('https://uploadthing.com/api/health');
    if (response.ok) {
      console.log('✅ UploadThing connection: OK');
    } else {
      console.error('❌ UploadThing connection failed');
      failures++;
    }
  } catch (error) {
    console.error('❌ UploadThing connection failed:', error.message);
    failures++;
  }

  // Summary
  console.log('\nHealth check summary:');
  console.log(`Total endpoints checked: ${endpoints.length + 2}`);
  console.log(`Failures: ${failures}`);

  if (failures > 0) {
    console.error('\n❌ Health checks failed!');
    process.exit(1);
  } else {
    console.log('\n✨ All health checks passed successfully!');
  }
}

runHealthChecks().catch(console.error); 