/**
 * Database Setup Script
 * 
 * This script provides instructions on how to set up PostgreSQL database for Torch Group.
 */

console.log(`
============================================================
TORCH GROUP DATABASE SETUP
============================================================

Follow these steps to set up your PostgreSQL database:

1. INSTALL POSTGRESQL
   - Download and install PostgreSQL from https://www.postgresql.org/download/
   - During installation, set a password for the postgres user
   - Remember this password for the DATABASE_URL configuration

2. CREATE DATABASE
   - Open psql command line tool or pgAdmin
   - Run the following commands:
   
     CREATE DATABASE torch_group;
     
3. CONFIGURE DATABASE URL
   - Create a .env.local file in the project root with:
   
     DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/torch_group"
     DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/torch_group"
     NEXTAUTH_SECRET="some-strong-secret-key"
     NEXTAUTH_URL="http://localhost:3000"
     
   - Replace YOUR_PASSWORD with your PostgreSQL password

4. RUN PRISMA MIGRATIONS
   - Execute the following commands:
   
     npx prisma migrate dev --name init
     
5. CREATE ADMIN USER
   - After migrations, run the admin user creation script:
   
     node scripts/create-admin-user.js
     
============================================================
`);

// If this script is run with the --check flag, it will validate the database connection
if (process.argv.includes('--check')) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  async function checkConnection() {
    try {
      console.log('Checking database connection...');
      await prisma.$connect();
      console.log('✅ Database connection successful!');
      
      // Check schema
      console.log('Checking database schema...');
      const users = await prisma.user.findMany({ take: 1 });
      console.log(`✅ Schema check successful! Found ${users.length} users.`);
      
      console.log('Your database is ready to use!');
    } catch (error) {
      console.error('❌ Database connection failed:');
      console.error(error);
      
      console.log(`
Please ensure:
1. PostgreSQL is running
2. The database 'torch_group' exists
3. Your .env.local file has the correct DATABASE_URL and DIRECT_URL
      `);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  checkConnection();
} 