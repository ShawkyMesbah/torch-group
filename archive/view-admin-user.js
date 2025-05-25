// Script to view the admin user data
const fs = require('fs');
const path = require('path');

try {
  // Read the admin user data
  const adminUserPath = path.join(__dirname, 'data', 'admin-user.json');
  const adminUserBackupPath = path.join(__dirname, 'admin-user-backup.json');
  
  let adminUserData;
  
  if (fs.existsSync(adminUserPath)) {
    adminUserData = JSON.parse(fs.readFileSync(adminUserPath, 'utf8'));
    console.log('Admin user data from data/admin-user.json:');
  } else if (fs.existsSync(adminUserBackupPath)) {
    adminUserData = JSON.parse(fs.readFileSync(adminUserBackupPath, 'utf8'));
    console.log('Admin user data from admin-user-backup.json:');
  } else {
    console.log('Admin user data file not found');
    process.exit(1);
  }
  
  // Mask the password hash for security
  const maskedData = { ...adminUserData };
  if (maskedData.password) {
    maskedData.password = maskedData.password.substring(0, 10) + '...';
  }
  
  console.log(JSON.stringify(maskedData, null, 2));
  
  console.log('\nAdmin user details:');
  console.log(`ID: ${adminUserData.id}`);
  console.log(`Name: ${adminUserData.name}`);
  console.log(`Email: ${adminUserData.email}`);
  console.log(`Role: ${adminUserData.role}`);
  
} catch (error) {
  console.error('Error reading admin user data:', error);
} 