// Script to diagnose database issues and reset admin user
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const testConnection = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Database connection test:', testConnection);
    
    // Get all users for diagnosis
    console.log('\nExisting users in database:');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log(allUsers);
    
    // Clear any previous admin users
    console.log('\nRemoving any existing admin users...');
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'admin@example.com' },
          { email: 'admin@torchgroup.com' }
        ]
      }
    });
    
    // Create a fresh admin user with the email being used
    console.log('\nCreating fresh admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const newAdmin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@torchgroup.co',
        password: hashedPassword,
        role: 'ADMIN',
      }
    });
    
    console.log('Admin user created successfully:');
    console.log({
      id: newAdmin.id,
      email: newAdmin.email,
      role: newAdmin.role,
      name: newAdmin.name
    });
    
    console.log('\nDatabase connection and admin user setup completed successfully!');
    console.log('\nPlease try logging in with:');
    console.log('Email: admin@torchgroup.co');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 