// Simple database test with direct connection string
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ttzulxpncujgizidgwxk:Spinal_Shit1709@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database!');
    
    // Try some basic database operations
    console.log('Querying database...');
    
    // Count users
    const usersCount = await prisma.user.count();
    console.log(`Users in database: ${usersCount}`);
    
    // List all users (first 5)
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Users:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));
    
    console.log('✅ Database queries completed successfully!');
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  }
}

main(); 