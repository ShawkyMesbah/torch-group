// Script to upsert admin user in Supabase - uses Prisma with SQL fallback
const { PrismaClient } = require('./src/generated/prisma');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Check or update .env file to ensure correct DATABASE_URL
const fs = require('fs');
const path = require('path');

// DB connection string
const expectedDbUrl = "postgresql://postgres:Spinal_Shit1709@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public&sslmode=require";

// Ensure correct .env configuration
function checkAndUpdateEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if DATABASE_URL needs updating
    if (!envContent.includes(expectedDbUrl)) {
      console.log('Updating DATABASE_URL in .env file...');
      
      // Replace or add DATABASE_URL
      if (envContent.includes('DATABASE_URL=')) {
        envContent = envContent.replace(/DATABASE_URL=.*(\r?\n|$)/g, `DATABASE_URL=${expectedDbUrl}\n`);
      } else {
        envContent += `\nDATABASE_URL=${expectedDbUrl}\n`;
      }
      
      // Replace or add DIRECT_URL
      if (envContent.includes('DIRECT_URL=')) {
        envContent = envContent.replace(/DIRECT_URL=.*(\r?\n|$)/g, `DIRECT_URL=${expectedDbUrl}\n`);
      } else {
        envContent += `DIRECT_URL=${expectedDbUrl}\n`;
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('.env file updated with correct DATABASE_URL');
    } else {
      console.log('DATABASE_URL in .env is already correctly configured');
    }
  } else {
    console.log('Creating new .env file with correct DATABASE_URL');
    fs.writeFileSync(envPath, `DATABASE_URL=${expectedDbUrl}\nDIRECT_URL=${expectedDbUrl}\n`);
  }
}

// Method 1: Try with Prisma
async function upsertAdminWithPrisma() {
  console.log('Attempting to upsert admin user with Prisma...');
  const prisma = new PrismaClient();
  
  try {
    // Hash password for the admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Upsert operation - create if not exists, update if exists
    const result = await prisma.user.upsert({
      where: { 
        email: 'admin@torchgroup.co' 
      },
      update: { 
        name: 'Shawqy',
        role: 'ADMIN',
        password: hashedPassword
      },
      create: {
        id: 'admin-user-id',
        name: 'Shawqy',
        email: 'admin@torchgroup.co',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user successfully upserted with Prisma');
    console.log({
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role
    });
    
    // Verify user exists
    const verifyUser = await prisma.user.findUnique({
      where: { email: 'admin@torchgroup.co' }
    });
    
    console.log('✅ Verified admin user exists in database:');
    console.log({
      id: verifyUser.id,
      name: verifyUser.name,
      email: verifyUser.email,
      role: verifyUser.role
    });
    
    return true;
  } catch (error) {
    console.error('❌ Prisma operation failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Method 2: Fallback to direct SQL if Prisma fails
async function upsertAdminWithSQL() {
  console.log('Falling back to direct SQL for admin user upsert...');
  
  const client = new Client({
    connectionString: expectedDbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('Connected to database using direct SQL');
    
    // Hash password for the admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Current timestamp for createdAt/updatedAt
    const now = new Date().toISOString();
    
    // SQL for PostgreSQL upsert (INSERT ... ON CONFLICT DO UPDATE)
    const upsertQuery = `
      INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = $2,
        password = $4,
        role = $5,
        "updatedAt" = $7
      RETURNING id, name, email, role;
    `;
    
    const result = await client.query(upsertQuery, [
      'admin-user-id', 
      'Shawqy', 
      'admin@torchgroup.co', 
      hashedPassword, 
      'ADMIN', 
      now, 
      now
    ]);
    
    console.log('✅ Admin user successfully upserted with direct SQL');
    console.log(result.rows[0]);
    
    // Verify user exists
    const verifyQuery = 'SELECT id, name, email, role FROM "User" WHERE email = $1';
    const verifyResult = await client.query(verifyQuery, ['admin@torchgroup.co']);
    
    console.log('✅ Verified admin user exists in database:');
    console.log(verifyResult.rows[0]);
    
    return true;
  } catch (error) {
    console.error('❌ Direct SQL operation failed:', error);
    return false;
  } finally {
    await client.end();
  }
}

// Main function
async function main() {
  console.log('Starting admin user upsert operation...');
  
  // Step 1: Check/update .env file
  checkAndUpdateEnvFile();
  
  // Step 2: Try Prisma first
  const prismaSuccess = await upsertAdminWithPrisma();
  
  // Step 3: If Prisma fails, try direct SQL
  if (!prismaSuccess) {
    const sqlSuccess = await upsertAdminWithSQL();
    
    if (!sqlSuccess) {
      console.error('❌ All attempts to upsert admin user failed');
      process.exit(1);
    }
  }
  
  console.log('✅ Admin user upsert operation completed successfully');
}

// Run the main function
main()
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 