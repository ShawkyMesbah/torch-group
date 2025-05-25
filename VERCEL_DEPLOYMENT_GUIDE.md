# Vercel Deployment Guide for Torch Group Website

This guide provides step-by-step instructions for deploying the Torch Group website to Vercel.

## Prerequisites

Before deploying to Vercel, ensure you have:

1. A Vercel account (https://vercel.com/signup)
2. A GitHub, GitLab, or Bitbucket account with your project repository
3. All environment variables ready for configuration
4. A PostgreSQL database ready for production use (e.g., Supabase, Neon, etc.)

## Step 1: Prepare Your Project

Ensure your project is ready for deployment:

1. Run a production build locally to catch any issues:
   ```bash
   npm run build
   ```

2. Commit all changes to your repository:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push
   ```

## Step 2: Connect to Vercel

1. Log in to your Vercel account
2. Click "Add New..." > "Project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your torch-group repository
5. Vercel will automatically detect that it's a Next.js project

## Step 3: Configure Project Settings

1. **Project Name**: Enter a name for your deployment (e.g., "torch-group")
2. **Framework Preset**: Ensure "Next.js" is selected
3. **Root Directory**: Leave as default (if your project is in the root)
4. **Build and Output Settings**: 
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

## Step 4: Configure Environment Variables

Add all required environment variables in the Vercel project settings:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&connection_limit=5
DIRECT_URL=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&sslmode=require

# NextAuth Configuration
NEXTAUTH_SECRET=[your-secret-key]
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Email Configuration
RESEND_API_KEY=[your-resend-api-key]
EMAIL_FROM=noreply@torchgroup.co

# UploadThing Configuration 
UPLOADTHING_SECRET=[your-uploadthing-secret]
UPLOADTHING_APP_ID=[your-uploadthing-app-id]

# Application Configuration
NODE_ENV=production
SITE_URL=https://your-vercel-deployment-url.vercel.app
```

Make sure to update these values with your actual production credentials.

## Step 5: Deploy

1. Click "Deploy" button
2. Vercel will clone your repository, install dependencies, and build the project
3. Once deployment is complete, Vercel will provide a URL to access your application

## Step 6: Set Up Custom Domain (Optional)

1. In your project dashboard, go to "Settings" > "Domains"
2. Add your custom domain (e.g., "torchgroup.co")
3. Follow the instructions to configure DNS settings for your domain

## Step 7: Set Up Database Schema

After deployment, you need to apply your database schema:

### Option 1: Using Prisma Deploy From Local Machine

1. Set up a local `.env` file with the same DATABASE_URL as your Vercel deployment
2. Run Prisma deploy:
   ```bash
   npx prisma db push
   ```

### Option 2: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Run Prisma deploy command:
   ```bash
   vercel env pull .env
   npx prisma db push
   ```

## Step 8: Post-Deployment Tasks

1. Create an admin user for the production environment
2. Test all features of the website
3. Verify analytics are being tracked correctly
4. Check all API endpoints are working as expected
5. Test the contact form and newsletter subscription
6. Complete the POST_DEPLOYMENT_CHECKLIST.md items

## Vercel Deployment Features

### Automatic Deployments

Vercel automatically creates new deployments whenever you push to your Git repository. This allows for continuous deployment of your application.

### Preview Deployments

Vercel creates preview deployments for pull requests, allowing you to test changes before merging them into production.

### Environment Variables Management

Vercel provides easy management of environment variables with different values for production, preview, and development environments.

### Analytics and Monitoring

Vercel offers built-in analytics and monitoring for your deployed applications:

1. Go to your project dashboard
2. Click on "Analytics" to view performance metrics
3. Set up custom alerts for monitoring

### Scaling Options

Vercel automatically scales your application based on traffic. For additional scaling options:

1. Go to "Settings" > "General"
2. Explore serverless function configuration options
3. Consider upgrading to a Team or Enterprise plan for more resources

## Troubleshooting

### Build Failures

1. Check the build logs for specific errors
2. Verify your dependencies are compatible with Vercel
3. Ensure your Next.js version is supported
4. Check for any environment variables that might be missing

### Database Connection Issues

1. Verify your DATABASE_URL is correctly formatted
2. Check if your database allows connections from Vercel's IP ranges
3. Verify your database is online and accessible

### NextAuth Configuration Issues

1. Ensure NEXTAUTH_URL is set to your actual deployment URL
2. Verify NEXTAUTH_SECRET is properly configured
3. Check callback URLs are correctly set up

### Static Asset Issues

1. Check if your images and other static assets are properly referenced
2. Verify path issues by checking browser console errors
3. Ensure your public directory is correctly structured

## Next Steps After Deployment

1. Set up CI/CD workflow for automated testing before deployment
2. Configure monitoring and alerts for your production environment
3. Set up regular database backups
4. Create a maintenance schedule for updates and security patches
5. Monitor performance and make optimizations as needed
6. Consider setting up a staging environment for testing before production

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [PostgreSQL on Vercel Guide](https://vercel.com/guides/postgresql-on-vercel) 