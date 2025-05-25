/**
 * Script to sync locally stored analytics events to the database
 * 
 * Run this script after database connectivity has been restored and migrations applied
 * to transfer events from the local JSON file to the Supabase database.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient();

// Path to local analytics events file
const localEventsFilePath = path.join(process.cwd(), 'data', 'analytics-events.json');
const backupFilePath = path.join(process.cwd(), 'data', `analytics-events-backup-${Date.now()}.json`);

async function main() {
  console.log('Starting analytics events synchronization...');
  
  // Check if local file exists
  if (!fs.existsSync(localEventsFilePath)) {
    console.log('No local analytics events file found. Nothing to synchronize.');
    return;
  }
  
  // Test database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Database connection failed. Cannot synchronize events:', error);
    process.exit(1);
  }
  
  // Load local events
  let localEvents;
  try {
    const fileContent = fs.readFileSync(localEventsFilePath, 'utf-8');
    localEvents = JSON.parse(fileContent);
    console.log(`Loaded ${localEvents.length} events from local file.`);
    
    // Create backup of original file
    fs.copyFileSync(localEventsFilePath, backupFilePath);
    console.log(`Created backup at ${backupFilePath}`);
  } catch (error) {
    console.error('Error reading local events file:', error);
    process.exit(1);
  }
  
  // Prepare for synchronization
  const results = {
    total: localEvents.length,
    succeeded: 0,
    failed: 0,
    failedEvents: []
  };
  
  // Process each event
  console.log('Syncing events to database...');
  
  for (const event of localEvents) {
    try {
      // Prepare event for database
      const dbEvent = {
        type: event.type,
        meta: event.meta || {}
      };
      
      // Insert into database
      await prisma.analyticsEvent.create({
        data: dbEvent
      });
      
      results.succeeded++;
      
      // Log progress every 10 events
      if (results.succeeded % 10 === 0) {
        console.log(`Progress: ${results.succeeded}/${results.total} events synced`);
      }
    } catch (error) {
      console.error(`Failed to sync event ${event.id}:`, error);
      results.failed++;
      results.failedEvents.push(event);
    }
  }
  
  // Write failed events back to file if any
  if (results.failedEvents.length > 0) {
    fs.writeFileSync(localEventsFilePath, JSON.stringify(results.failedEvents, null, 2));
    console.log(`Wrote ${results.failedEvents.length} failed events back to the local file.`);
  } else {
    // If all events were synced successfully, create an empty array in the file
    fs.writeFileSync(localEventsFilePath, JSON.stringify([], null, 2));
    console.log('All events synced successfully. Cleared local events file.');
  }
  
  // Log summary
  console.log('\nSynchronization Summary:');
  console.log(`Total events: ${results.total}`);
  console.log(`Successfully synced: ${results.succeeded}`);
  console.log(`Failed to sync: ${results.failed}`);
  console.log(`Backup created at: ${backupFilePath}`);
  
  if (results.total === results.succeeded) {
    console.log('\n✅ All events were synchronized successfully!');
  } else {
    console.log(`\n⚠️ ${results.failed} events could not be synchronized and remain in the local file.`);
  }
}

// Run the main function
main()
  .catch((error) => {
    console.error('Synchronization failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 