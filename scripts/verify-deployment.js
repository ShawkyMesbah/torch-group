/**
 * Deployment verification script for Torch Group
 * Run this script after deploying to verify key functionality
 */

const https = require('https');
const url = process.env.SITE_URL || 'https://torchgroup.co';

console.log(`🔍 Verifying deployment at ${url}`);

// 1. Check if site is accessible
function checkSite() {
  return new Promise((resolve, reject) => {
    console.log('Checking if site is accessible...');
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Site is accessible');
        resolve(true);
      } else {
        console.error(`❌ Site returned status code: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Error accessing site:', err.message);
      resolve(false);
    });
  });
}

// 2. Check robots.txt
function checkRobots() {
  return new Promise((resolve, reject) => {
    console.log('Checking robots.txt...');
    https.get(`${url}/robots.txt`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ robots.txt is accessible');
        resolve(true);
      } else {
        console.error(`❌ robots.txt returned status code: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Error accessing robots.txt:', err.message);
      resolve(false);
    });
  });
}

// 3. Check sitemap.xml
function checkSitemap() {
  return new Promise((resolve, reject) => {
    console.log('Checking sitemap.xml...');
    https.get(`${url}/sitemap.xml`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ sitemap.xml is accessible');
        resolve(true);
      } else {
        console.error(`❌ sitemap.xml returned status code: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Error accessing sitemap.xml:', err.message);
      resolve(false);
    });
  });
}

// 4. Check API endpoint
function checkApi() {
  return new Promise((resolve, reject) => {
    console.log('Checking API endpoint...');
    https.get(`${url}/api/hello`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ API endpoint is accessible');
        resolve(true);
      } else {
        console.error(`❌ API endpoint returned status code: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Error accessing API endpoint:', err.message);
      resolve(false);
    });
  });
}

// Run all checks
async function runChecks() {
  let success = 0;
  let failed = 0;
  
  const checks = [
    { name: 'Site accessibility', fn: checkSite },
    { name: 'robots.txt', fn: checkRobots },
    { name: 'sitemap.xml', fn: checkSitemap },
    { name: 'API endpoint', fn: checkApi }
  ];
  
  for (const check of checks) {
    try {
      const result = await check.fn();
      if (result) success++;
      else failed++;
    } catch (error) {
      console.error(`❌ Error during "${check.name}" check:`, error);
      failed++;
    }
  }
  
  console.log('\n📊 Verification Summary:');
  console.log(`✅ Passed: ${success} checks`);
  console.log(`❌ Failed: ${failed} checks`);
  
  if (failed === 0) {
    console.log('🎉 All checks passed! Deployment looks good.');
  } else {
    console.log('⚠️ Some checks failed. Please review the issues above.');
  }
}

runChecks(); 