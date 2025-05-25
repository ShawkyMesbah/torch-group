// Script to upsert admin user using direct SQL with IPv6 connection
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  console.log('Starting admin user upsert with IPv6 connection...');
  
  // Specify connection options with the IPv6 address directly
  const connectionConfig = {
    user: 'postgres',
    password: 'Spinal_Shit1709',
    host: '2a05:d014:1c06:5f04:6931:8018:282d:f5f8',
    database: 'postgres',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    },
    // Specify that we want to use IPv6
    family: 6
  };
  
  const client = new Client(connectionConfig);
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Successfully connected to database');
    
    // Hash password for the admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Current timestamp for createdAt/updatedAt
    const now = new Date().toISOString();
    
    // Check if user already exists
    console.log('Checking if admin user already exists...');
    const checkQuery = 'SELECT * FROM "User" WHERE email = $1';
    const checkResult = await client.query(checkQuery, ['admin@torchgroup.co']);
    
    if (checkResult.rows.length > 0) {
      // User exists, update
      console.log('Admin user exists, updating details...');
      
      const updateQuery = `
        UPDATE "User" 
        SET name = $1, role = $2, password = $3, "updatedAt" = $4
        WHERE email = $5
        RETURNING id, name, email, role;
      `;
      
      const updateResult = await client.query(updateQuery, [
        'Shawqy',
        'ADMIN',
        hashedPassword,
        now,
        'admin@torchgroup.co'
      ]);
      
      console.log('✅ Admin user successfully updated');
      console.log(updateResult.rows[0]);
    } else {
      // User doesn't exist, create
      console.log('Admin user does not exist, creating new user...');
      
      const insertQuery = `
        INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, role;
      `;
      
      const insertResult = await client.query(insertQuery, [
        'admin-user-id',
        'Shawqy',
        'admin@torchgroup.co',
        hashedPassword,
        'ADMIN',
        now,
        now
      ]);
      
      console.log('✅ Admin user successfully created');
      console.log(insertResult.rows[0]);
    }
    
    // Verify user exists
    console.log('Verifying admin user in database...');
    const verifyQuery = 'SELECT id, name, email, role FROM "User" WHERE email = $1';
    const verifyResult = await client.query(verifyQuery, ['admin@torchgroup.co']);
    
    console.log('✅ Verified admin user exists in database:');
    console.log(verifyResult.rows[0]);
    
    console.log('✅ Admin user operation completed successfully');
  } catch (error) {
    console.error('❌ Database operation failed:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the main function
main()
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 