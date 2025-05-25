// Database test using .env.local
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { PrismaClient } = require('@prisma/client');

// Log environment variables (masking sensitive info)
console.log('Using DATABASE_URL from .env.local:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
console.log('Using DIRECT_URL from .env.local:', process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@'));

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('\nConnecting to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database!');
    
    // Try some basic database operations
    console.log('\nRunning database queries:');
    
    // Count users
    const usersCount = await prisma.user.count();
    console.log(`Users in database: ${usersCount}`);
    
    // List all users (first 5)
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Users:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));
    
    // Count other tables
    const blogPostsCount = await prisma.blogPost.count();
    console.log(`Blog posts in database: ${blogPostsCount}`);
    
    const talentsCount = await prisma.talent.count();
    console.log(`Talents in database: ${talentsCount}`);
    
    const contactMessagesCount = await prisma.contactMessage.count();
    console.log(`Contact messages in database: ${contactMessagesCount}`);
    
    console.log('\n✅ Database connection and queries completed successfully!');
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  }
}

main(); 