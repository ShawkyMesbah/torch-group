// Script to directly insert or update admin user in Supabase using raw SQL
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  // Create a new client using the DATABASE_URL from .env
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Supabase database using direct SQL...');
    await client.connect();
    console.log('Successfully connected to database');

    // Hash password for the admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if user exists
    const checkResult = await client.query(
      'SELECT * FROM "User" WHERE email = $1',
      ['admin@torchgroup.co']
    );

    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists - updating details...');
      
      // Update existing user
      const updateResult = await client.query(
        'UPDATE "User" SET name = $1, role = $2, password = $3 WHERE email = $4 RETURNING *',
        ['Shawqy', 'ADMIN', hashedPassword, 'admin@torchgroup.co']
      );
      
      console.log('Admin user updated successfully');
      console.log({
        id: updateResult.rows[0].id,
        name: updateResult.rows[0].name,
        email: updateResult.rows[0].email,
        role: updateResult.rows[0].role
      });
    } else {
      console.log('Creating new admin user...');
      
      // Get the current timestamp for any date fields
      const now = new Date();
      
      // Insert new user - using parameterized query to prevent SQL injection
      const insertResult = await client.query(
        'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        ['admin-user-id', 'Shawqy', 'admin@torchgroup.co', hashedPassword, 'ADMIN', now, now]
      );
      
      console.log('Admin user created successfully');
      console.log({
        id: insertResult.rows[0].id,
        name: insertResult.rows[0].name,
        email: insertResult.rows[0].email,
        role: insertResult.rows[0].role
      });
    }
  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    // Close the client connection
    await client.end();
    console.log('Database connection closed');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 