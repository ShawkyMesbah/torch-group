# Admin User Setup Guide

## Overview

This document provides instructions for setting up the admin user for the Torch Group application. We've created multiple approaches to handle different scenarios.

## Admin User Details

```
ID: admin-user-id
Name: Shawqy
Email: admin@torchgroup.co
Password: admin123 (hashed in the database)
Role: ADMIN
```

## Setup Methods

### 1. Using the Supabase Dashboard (Recommended)

1. Log in to the Supabase dashboard at https://app.supabase.com
2. Navigate to your project: `ttzulxpncujgizidgwxk`
3. Open the SQL Editor
4. Paste and run the following SQL command:

```sql
-- SQL to insert/update admin user
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-user-id',
  'Shawqy',
  'admin@torchgroup.co',
  '$2b$10$AVDgE3twvvD9t7C8DuU9ReGTRhJ/UJjDmg9v.00UIPoD.0gaxO8DC',
  'ADMIN',
  '2025-05-14T07:13:28.381Z',
  '2025-05-14T07:13:28.383Z'
)
ON CONFLICT (email) 
DO UPDATE SET 
  name = 'Shawqy',
  role = 'ADMIN',
  password = '$2b$10$AVDgE3twvvD9t7C8DuU9ReGTRhJ/UJjDmg9v.00UIPoD.0gaxO8DC',
  "updatedAt" = '2025-05-14T07:13:28.383Z';
```

5. Verify the user was created with this query:

```sql
SELECT * FROM "User" WHERE email = 'admin@torchgroup.co';
```

### 2. Using the Admin Scripts (If you have direct database access)

We've created several scripts to handle the admin user creation:

1. `upsert-admin-user.js` - Tries to use Prisma first, then falls back to direct SQL
2. `insert-admin-user.js` - Uses Prisma to insert/update the admin user
3. `insert-admin-direct-sql.js` - Uses direct SQL with the pg library
4. `admin-ipv6-upsert.js` - Attempts to connect using IPv6 addressing
5. `create-local-admin.js` - Creates a local JSON file for development

To run any of these scripts:

```bash
node script-name.js
```

### 3. Manual User Setup

If you can't access the database directly, you can:

1. Log in to the application using any method
2. Access the users management page in the admin dashboard
3. Create a new user with the admin details above
4. Or update an existing user with these details

## Troubleshooting

If you encounter connection issues:

1. Verify the database URL in the `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:Spinal_Shit1709@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public&sslmode=require
   DIRECT_URL=postgresql://postgres:Spinal_Shit1709@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public&sslmode=require
   ```

2. Check network connectivity to the Supabase instance
3. Ensure the Supabase database is active and accepting connections
4. Use the Supabase dashboard SQL editor for direct database operations

## Local Development

For local development without database access, use:

```bash
node admin-user-mock.js
```

This creates mock files in the `mock-data` directory:
- `admin-user.json` - Contains the full user object
- `admin-insert.sql` - SQL script for manual insertion
- `admin-credentials.txt` - Plain text credentials

## Login Information

After setup, you can log in with:
- Email: admin@torchgroup.co
- Password: admin123 