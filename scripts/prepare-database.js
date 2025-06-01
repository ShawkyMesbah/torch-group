#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const main = async () => {
  try {
    console.log('🔄 Preparing database for production...');

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }

    // Check if migrations directory exists
    const migrationsDir = join(process.cwd(), 'prisma', 'migrations');
    if (!existsSync(migrationsDir)) {
      throw new Error('Migrations directory not found. Run `prisma migrate dev` first');
    }

    // Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Run migrations
    console.log('🔄 Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Verify database connection
    console.log('🔍 Verifying database connection...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();

    // Check which tables exist
    console.log('📊 Checking existing tables...');
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `;
    const tableNames = tables.map(t => t.tablename);
    console.log('Found tables:', tableNames);

    // Create indexes only for existing tables
    console.log('📊 Creating database indexes...');
    const indexQueries = [];
    
    if (tableNames.includes('analytics')) {
      indexQueries.push('CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp)');
    }
    
    if (tableNames.includes('blog_posts')) {
      indexQueries.push('CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at)');
    }
    
    if (tableNames.includes('contact_messages')) {
      indexQueries.push('CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at)');
    }
    
    if (tableNames.includes('talents')) {
      indexQueries.push('CREATE INDEX IF NOT EXISTS idx_talents_active ON talents(active)');
    }
    
    if (tableNames.includes('users')) {
      indexQueries.push('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    }

    // Execute index creation queries
    for (const query of indexQueries) {
      try {
        await prisma.$executeRawUnsafe(query);
        console.log(`✅ Created index: ${query}`);
      } catch (error) {
        console.warn(`⚠️ Failed to create index: ${query}`, error.message);
      }
    }

    await prisma.$disconnect();
    console.log('✅ Database preparation completed successfully!');
  } catch (error) {
    console.error('❌ Error preparing database:', error);
    process.exit(1);
  }
};

main(); 