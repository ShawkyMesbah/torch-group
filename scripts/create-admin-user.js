/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database.
 * Usage: node scripts/create-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser() {
  try {
    console.log('\n============================================');
    console.log('TORCH GROUP ADMIN USER CREATION');
    console.log('============================================\n');
    
    // Check if env vars are set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set.');
      console.log('Please create a .env.local file with your database connection string.');
      process.exit(1);
    }
    
    // Default values
    const defaultEmail = 'admin@torchgroup.co';
    const defaultName = 'Torch Admin';
    
    // Get user input
    const email = await promptUser(`Enter admin email (default: ${defaultEmail}): `, defaultEmail);
    const name = await promptUser(`Enter admin name (default: ${defaultName}): `, defaultName);
    const password = await promptUser('Enter admin password: ');
    
    if (!password) {
      console.error('❌ Password cannot be empty.');
      process.exit(1);
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log(`\nUser with email ${email} already exists.`);
      const update = await promptUser('Do you want to update this user? (y/n): ');
      
      if (update.toLowerCase() === 'y') {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update user
        await prisma.user.update({
          where: { email },
          data: {
            name,
            password: hashedPassword,
            role: 'ADMIN'
          }
        });
        
        console.log('\n✅ Admin user updated successfully!');
      } else {
        console.log('\nOperation cancelled.');
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('\n✅ Admin user created successfully!');
    }
    
    console.log('\nYou can now log in with these credentials at:');
    console.log('- Admin Login: /admin-login');
    console.log('- Standard Login: /login');
    
  } catch (error) {
    console.error('❌ An error occurred:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Helper function to prompt for user input
function promptUser(question, defaultValue = '') {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Run the script
createAdminUser(); 