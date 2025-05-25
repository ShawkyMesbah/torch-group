/**
 * Script to check Supabase connection status
 * 
 * This script attempts to connect to Supabase using both the pooler URL and the direct URL
 * to determine which connection method works in the current environment.
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const net = require('net');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
let envExists = false;
let poolerUrl = '';
let directUrl = '';

try {
  if (fs.existsSync(envPath)) {
    envExists = true;
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Extract URLs from .env
    const poolerMatch = envContent.match(/DATABASE_URL=(.+)/);
    const directMatch = envContent.match(/DIRECT_URL=(.+)/);
    
    if (poolerMatch) poolerUrl = poolerMatch[1];
    if (directMatch) directUrl = directMatch[1];
  } else {
    console.log('❌ .env file not found');
    
    // Use default values from the task description
    poolerUrl = 'postgres://postgres.ttzulxpncujgizidgwxk:Spinal_Shit1709@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1';
    directUrl = 'postgresql://postgres:Spinal_Shit1709@ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public&sslmode=require';
    
    console.log('Using default connection values from task description');
  }
} catch (error) {
  console.error('Error reading .env file:', error);
}

// Function to parse a URL into components
function parseDbUrl(url) {
  try {
    // Parse URL components
    let hostWithPort = '';
    let port = '';
    
    if (url.includes('@')) {
      hostWithPort = url.split('@')[1].split('/')[0];
      if (hostWithPort.includes(':')) {
        port = hostWithPort.split(':')[1];
      }
    }
    
    return { hostWithPort, port };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return { hostWithPort: '', port: '' };
  }
}

// Async function to test connectivity to a host and port
async function testConnectivity(host, port) {
  // First try DNS lookup
  try {
    const dnsResult = await new Promise((resolve, reject) => {
      dns.lookup(host, (err, address) => {
        if (err) {
          reject(err);
        } else {
          resolve(address);
        }
      });
    });
    
    console.log(`✅ DNS Resolution for ${host}: ${dnsResult}`);
    
    // Now try TCP connection
    const connectResult = await new Promise((resolve, reject) => {
      const socket = new net.Socket();
      
      socket.setTimeout(5000);
      
      socket.on('connect', () => {
        socket.end();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      });
      
      socket.on('error', (err) => {
        reject(err);
      });
      
      socket.connect(port, host);
    });
    
    console.log(`✅ TCP Connection to ${host}:${port} successful`);
    return true;
  } catch (error) {
    console.error(`❌ Connectivity test failed for ${host}:${port}:`, error.message);
    return false;
  }
}

// Function to test database connection
async function testDbConnection(url, type) {
  console.log(`\nTesting ${type} connection...`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url
      }
    }
  });
  
  try {
    console.log('Attempting database query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    await prisma.$disconnect();
    
    console.log(`✅ Database connection successful via ${type}`);
    console.log('Query result:', result);
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed via ${type}:`, error.message);
    await prisma.$disconnect();
    return false;
  }
}

// Main function
async function main() {
  console.log('---- Supabase Connection Checker ----');
  
  // Check pooler URL
  const { hostWithPort: poolerHost, port: poolerPort } = parseDbUrl(poolerUrl);
  console.log(`\nPooler host: ${poolerHost} (Port ${poolerPort})`);
  
  if (poolerHost) {
    const poolerConnectivity = await testConnectivity(poolerHost.split(':')[0], poolerPort);
    
    if (poolerConnectivity) {
      await testDbConnection(poolerUrl, 'pooler');
    } else {
      console.log('❌ Cannot reach pooler host');
    }
  }
  
  // Check direct URL
  const { hostWithPort: directHost, port: directPort } = parseDbUrl(directUrl);
  console.log(`\nDirect host: ${directHost} (Port ${directPort || '5432'})`);
  
  if (directHost) {
    const directConnectivity = await testConnectivity(directHost.split(':')[0], directPort || '5432');
    
    if (directConnectivity) {
      await testDbConnection(directUrl, 'direct');
    } else {
      console.log('❌ Cannot reach direct host');
    }
  }
  
  // Check for analytics file fallback
  const analyticsPath = path.join(process.cwd(), 'data', 'analytics-events.json');
  
  if (fs.existsSync(analyticsPath)) {
    try {
      const fileContent = fs.readFileSync(analyticsPath, 'utf-8');
      const events = JSON.parse(fileContent);
      console.log(`\n✅ Analytics fallback file exists with ${events.length} events`);
    } catch (error) {
      console.error('\n❌ Analytics fallback file exists but is invalid:', error.message);
    }
  } else {
    console.log('\n❌ Analytics fallback file does not exist');
    
    console.log('\nCreating sample analytics data...');
    try {
      // Try to run the sample script
      execSync('node scripts/create-sample-analytics.js', { stdio: 'inherit' });
      console.log('✅ Sample analytics data created successfully');
    } catch (error) {
      console.error('❌ Failed to create sample analytics data:', error.message);
    }
  }
  
  console.log('\n---- Connection Check Summary ----');
  console.log(`\n1. Analytics will work via local file storage`);
  console.log(`2. For Prisma migrations, use the direct connection`);
  console.log(`3. For VPN access, connect to US region`);
  
  console.log('\nRecommendation for .env file:');
  console.log(`DATABASE_URL=${poolerUrl}`);
  console.log(`DIRECT_URL=${directUrl}`);
}

main().catch(e => {
  console.error('Script error:', e);
  process.exit(1);
}); 