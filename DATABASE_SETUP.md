# Database Setup Guide for Torch Group

This guide will help you set up a PostgreSQL database for the Torch Group project.

## Prerequisites

- PostgreSQL installed on your machine or a remote server
- Node.js and npm installed
- Access to project files

## Quick Setup

Follow these steps to quickly set up your database:

1. **Install PostgreSQL**
   - Download from [PostgreSQL website](https://www.postgresql.org/download/)
   - During installation, set a password for the postgres user
   - Make sure the PostgreSQL service is running

2. **Create the Database**
   ```sql
   CREATE DATABASE torch_group;
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root with:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/torch_group"
   DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/torch_group"
   NEXTAUTH_SECRET="some-strong-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
   
   Replace `YOUR_PASSWORD` with your PostgreSQL password.

4. **Run Database Setup**
   ```bash
   # View setup instructions
   npm run db:setup
   
   # Check database connection
   npm run db:check
   
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Create an admin user
   npm run db:admin
   ```

## Detailed Steps

### 1. PostgreSQL Installation

#### Windows
1. Download the installer from [PostgreSQL Windows Installer](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the instructions
3. Install all components, including pgAdmin
4. Set a password for the postgres user
5. Keep the default port (5432)
6. Complete the installation

#### macOS
1. Use Homebrew: `brew install postgresql`
2. Start the service: `brew services start postgresql`
3. Set a password: `psql postgres` then `\password postgres`

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo passwd postgres
```

### 2. Creating the Database

#### Using psql
```bash
# Connect as postgres user
psql -U postgres

# Create database
CREATE DATABASE torch_group;

# Verify creation
\l

# Exit
\q
```

#### Using pgAdmin
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" and select "Create" > "Database"
4. Enter "torch_group" as the name
5. Click "Save"

### 3. Setting Up Environment Variables

Create a `.env.local` file in your project root with:

```
# Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/torch_group"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/torch_group"

# NextAuth Configuration
NEXTAUTH_SECRET="some-strong-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Site Configuration
SITE_URL="http://localhost:3000"
SITE_NAME="Torch Group"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### 4. Running Migrations

Prisma migrations will create all the tables and relationships defined in the schema:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Creating an Admin User

Run the admin user creation script:

```bash
npm run db:admin
```

Follow the prompts to create an admin user. By default, it will create:
- Email: admin@torchgroup.co
- Name: Torch Admin
- Password: (you will be prompted to enter this)

### 6. Verifying the Setup

Check your database connection:

```bash
npm run db:check
```

You can also explore your database with Prisma Studio:

```bash
npm run prisma:studio
```

This will open a web interface at http://localhost:5555 where you can view and edit your data.

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Ensure PostgreSQL is running:
   - Windows: Check Services
   - macOS: `brew services list`
   - Linux: `sudo systemctl status postgresql`

2. Check your connection string:
   - Verify the password is correct
   - Make sure the port is correct (default is 5432)
   - If using a remote database, check network access

3. Check PostgreSQL authentication:
   - Ensure your user has the proper permissions
   - Check pg_hba.conf for allowed connections

### Migration Issues

If migrations fail:

1. Check for existing database objects:
   - Drop the database and recreate it if needed
   - Clear any existing schemas that conflict

2. Check permissions:
   - Ensure your PostgreSQL user has CREATE permissions

3. Check Prisma schema:
   - Make sure the schema is valid
   - Run `npx prisma validate` to check for errors

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) 