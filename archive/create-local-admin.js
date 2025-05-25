// Script to create a local admin JSON file for development purposes
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

async function main() {
  try {
    console.log('Creating local admin user file for development...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user object
    const adminUser = {
      id: 'admin-user-id',
      name: 'Shawqy',
      email: 'admin@torchgroup.co',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write to file
    fs.writeFileSync(
      path.join(dir, 'admin-user.json'), 
      JSON.stringify(adminUser, null, 2)
    );
    
    console.log('Local admin user file created successfully at data/admin-user.json');
    console.log('User details:');
    console.log({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });
    
    console.log('\nYou can use this account to log in to the dashboard.');
    console.log('Email: admin@torchgroup.co');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating local admin user file:', error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 