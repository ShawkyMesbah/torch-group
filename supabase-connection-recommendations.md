# Supabase Connection Recommendations

After multiple attempts to connect to your Supabase database, here are some recommendations to resolve the connection issues:

## 1. Get the Exact Connection Strings from Supabase Dashboard

The most reliable way to solve this issue is to get the exact connection strings directly from your Supabase Dashboard:

1. Log in to your Supabase account
2. Go to your project
3. Click on "Project Settings" → "Database"
4. Find the "Connection Pooling" section
5. Copy both the Transaction pooling string (for DATABASE_URL) and Session pooling string (for DIRECT_URL)

## 2. Update Your Schema to Support Supavisor

Make sure your schema.prisma file includes the directUrl property:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL") 
  directUrl = env("DIRECT_URL")
}
```

## 3. Enable Direct Connections

Supabase may have restrictions on direct database access. To enable it:

1. Go to your Supabase Dashboard
2. Navigate to "Project Settings" → "Database"
3. Under "Connection Settings", ensure "Direct Connections" is enabled
4. If your network only supports IPv4, you may need to enable the IPv4 add-on

## 4. Check Network Restrictions

Some network environments (like corporate networks) might block the necessary ports. Try testing from a different network if possible.

## 5. Correct Connection String Format

For Supabase with Prisma, use these formats in your .env file:

```
# For application connections (using connection pooling)
DATABASE_URL="postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# For migrations and direct database operations
DIRECT_URL="postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

Replace the placeholders with your actual project values from the Supabase dashboard.

## 6. Additional Query Parameters

You may need these additional parameters:

- Add `?pgbouncer=true` to DATABASE_URL (using port 6543)
- Add `?connect_timeout=30` to increase connection timeout
- Add `?pool_timeout=30` if you experience timeouts

## 7. Contact Supabase Support

If you've tried all of the above and still can't connect, consider contacting Supabase support with your project ID and connection attempts. 