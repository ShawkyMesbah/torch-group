// Script to create an admin user with specific credentials
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists - updating password...');
      
      // Update the existing admin's password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const updatedAdmin = await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: { 
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('Admin user password updated successfully');
      return;
    }

    // Hash password - using exact password from user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user with exact credentials provided
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 