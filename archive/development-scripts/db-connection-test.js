// Database connection test with environment variables
require('dotenv').config(); // Load environment variables
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Environment check:');
  console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('- DIRECT_URL exists:', !!process.env.DIRECT_URL);
  
  // Mask sensitive parts of the connection string for logging
  const maskConnectionString = (str) => {
    if (!str) return 'undefined';
    return str.replace(/:[^:@]+@/, ':****@');
  };
  
  console.log('- DATABASE_URL:', maskConnectionString(process.env.DATABASE_URL));
  console.log('- DIRECT_URL:', maskConnectionString(process.env.DIRECT_URL));
  
  // Create Prisma client using environment variables
  const prisma = new PrismaClient();
  
  try {
    console.log('\nConnecting to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database!');
    
    // Try a simple database query
    console.log('Running test query...');
    const usersCount = await prisma.user.count();
    console.log(`Users found: ${usersCount}`);
    
    await prisma.$disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

testConnection(); 