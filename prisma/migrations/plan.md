# Prisma Migration Plan for Analytics Events

The schema already contains the `AnalyticsEvent` model and `AnalyticsEventType` enum, but migrations have not been applied yet. 
When network connectivity to Supabase is restored, the following steps should be taken:

## Step 1: Run Migration (as Administrator on Windows)

```bash
# For Windows, run as administrator to avoid permission issues
npx prisma migrate dev --name add_analytics_events
```

## Step 2: Generate Prisma Client

```bash
# For Windows, run as administrator to avoid permission issues
npx prisma generate
```

## Step 3: Sync Local Events to Database

After the migration is successful, run the sync script to transfer any locally stored events to the database:

```bash
node scripts/sync-local-events-to-db.js
```

## Troubleshooting

If migrations continue to fail:

1. Try using a VPN to ensure port 6543 is not blocked
2. Use `prisma db pull` as a temporary measure to sync the schema:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```
3. Check the network connectivity with:
   ```bash
   node scripts/check-supabase-connection.js
   ```

## Fallback Strategy

The application is configured to use local file storage (`data/analytics-events.json`) when the database is not available. This ensures analytics continues to work even when Supabase is unreachable.

When database connectivity is restored, the application will automatically begin using the database again. 