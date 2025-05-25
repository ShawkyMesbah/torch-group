// Script to create a mock admin user for local development
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Creating mock admin user for local development...');
  
  try {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create the admin user object
    const adminUser = {
      id: 'admin-user-id',
      name: 'Shawqy',
      email: 'admin@torchgroup.co',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create the mock data directory if it doesn't exist
    const mockDir = path.join(__dirname, 'mock-data');
    if (!fs.existsSync(mockDir)) {
      fs.mkdirSync(mockDir, { recursive: true });
    }
    
    // Write the admin user to a JSON file
    const filePath = path.join(mockDir, 'admin-user.json');
    fs.writeFileSync(filePath, JSON.stringify(adminUser, null, 2));
    
    console.log(`✅ Mock admin user created at ${filePath}`);
    console.log('User details:');
    
    // Print the admin user details (without showing full password hash)
    const displayUser = { ...adminUser };
    displayUser.password = displayUser.password.substring(0, 10) + '...';
    console.log(displayUser);
    
    // Create a SQL insert statement that can be run directly in the database
    const sqlInsert = `
-- SQL to insert/update admin user
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  '${adminUser.id}',
  '${adminUser.name}',
  '${adminUser.email}',
  '${adminUser.password}',
  '${adminUser.role}',
  '${adminUser.createdAt}',
  '${adminUser.updatedAt}'
)
ON CONFLICT (email) 
DO UPDATE SET 
  name = '${adminUser.name}',
  role = '${adminUser.role}',
  password = '${adminUser.password}',
  "updatedAt" = '${adminUser.updatedAt}';
    `;
    
    // Write the SQL to a file for later use
    const sqlPath = path.join(mockDir, 'admin-insert.sql');
    fs.writeFileSync(sqlPath, sqlInsert);
    
    console.log(`✅ SQL insert statement created at ${sqlPath}`);
    console.log('SQL can be run directly in the Supabase dashboard SQL editor');
    
    // Save credentials in readable format
    const credentialsText = `
Admin User Credentials:
-----------------------
Email: admin@torchgroup.co
Password: admin123
Role: ADMIN
Name: Shawqy
ID: admin-user-id

Copy these credentials for manual login or for creating the user in the Supabase dashboard.
    `;
    
    const credentialsPath = path.join(mockDir, 'admin-credentials.txt');
    fs.writeFileSync(credentialsPath, credentialsText);
    
    console.log(`✅ Admin credentials saved at ${credentialsPath}`);
    console.log('✅ Mock admin user setup complete');
    
  } catch (error) {
    console.error('❌ Error creating mock admin user:', error);
  }
}

main()
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 