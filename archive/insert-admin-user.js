// Script to directly insert or update admin user in Supabase
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to Supabase database...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@torchgroup.co' }
    });

    // Hash password for the admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    if (existingAdmin) {
      console.log('Admin user already exists - updating details...');
      
      // Update the existing admin
      const updatedAdmin = await prisma.user.update({
        where: { email: 'admin@torchgroup.co' },
        data: { 
          name: 'Shawqy',
          role: 'ADMIN',
          password: hashedPassword
        }
      });
      
      console.log('Admin user updated successfully');
      console.log({
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role
      });
      return;
    }

    // Create admin user with specified credentials
    const admin = await prisma.user.create({
      data: {
        id: 'admin-user-id', // Specific ID as requested
        name: 'Shawqy',
        email: 'admin@torchgroup.co',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully');
    console.log({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error('Error managing admin user:', error);
    if (error.code === 'P2002') {
      console.error('Unique constraint violation. The user ID or email already exists.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 