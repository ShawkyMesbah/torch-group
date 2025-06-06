// Enhanced test database connection
const { PrismaClient } = require('./src/generated/prisma');

async function main() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // First test a simple query
    console.log('Attempting to connect to the database...');
    
    // Try to query the database
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    console.log('✅ Database connection successful!');
    console.log('Found users:', users);
    
    return users;
  } catch (error) {
    console.error('❌ Database connection failed:');
    
    if (error.message && error.message.includes("Can't reach database server")) {
      console.error('Connection error: Unable to reach the database server.');
      console.error('Please check:');
      console.error(' - Network connectivity');
      console.error(' - Firewall settings');
      console.error(' - Database server status');
      console.error(' - Connection string (port, credentials)');
      
      // Print environment variables for debugging
      console.log('\nCurrent connection string (redacted password):');
      const dbUrl = process.env.DATABASE_URL || 'Not set';
      if (dbUrl !== 'Not set') {
        console.log(dbUrl.replace(/:[^:@]+@/, ':******@'));
      } else {
        console.log(dbUrl);
      }
    } else {
      console.error(error);
    }
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
