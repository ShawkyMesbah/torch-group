// Simple database connection test
const { PrismaClient } = require('./src/generated/prisma');

async function main() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient();

  try {
    // Try a simple query
    console.log('Attempting to connect to the database...');
    
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    
    console.log('✅ Database connection successful!');
    console.log('Query result:', result);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('Test completed - connection closed');
  }
}

main()
  .catch(e => {
    console.error('Unhandled error:', e);
    process.exit(1);
  }); 