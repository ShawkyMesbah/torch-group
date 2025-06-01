const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

async function checkDatabase() {
  // Load environment variables based on NODE_ENV
  const env = process.argv.includes('--env') ? 
    process.argv[process.argv.indexOf('--env') + 1] : 
    process.env.NODE_ENV || 'development';

  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${env}`)
  });

  console.log(`Checking database connection for ${env} environment...`);

  const prisma = new PrismaClient();

  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if we can query the database
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful (${userCount} users found)`);

    // Check database migrations
    const migrations = await prisma.$queryRaw`SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 1`;
    console.log('✅ Latest migration:', migrations[0]?.migration_name || 'No migrations found');

    // Check database size and connections
    const dbStats = await prisma.$queryRaw`
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as db_size,
        (SELECT count(*) FROM pg_stat_activity) as active_connections
    `;
    console.log(`✅ Database size: ${dbStats[0].db_size}`);
    console.log(`✅ Active connections: ${dbStats[0].active_connections}`);

    await prisma.$disconnect();
    console.log('\nAll database checks passed successfully! ✨');

  } catch (error) {
    console.error('\n❌ Database check failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkDatabase().catch(console.error); 