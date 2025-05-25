# Torch Group - Deployment Quick Start

This document provides a condensed guide for deploying the Torch Group website to Vercel.

## Pre-Deployment Checklist

1. **Critical Items**
   - [x] Code is building successfully (verified with `npm run build`)
   - [x] All API routes are implemented and functioning
   - [x] Authentication and dashboard access are working
   - [x] SEO assessment complete (99/100 score)
   - [ ] OG Image needs to be created (see `public/images/OG_IMAGE_TODO.md`)

2. **Environment Setup**
   - Ensure you have a `.env` file with all required variables (see `.env.example` if needed)
   - Update all API keys and credentials for production
   - Configure the database connection string for production database

## Deployment Steps

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push
   ```

2. **Vercel Setup**
   - Log in to your Vercel account
   - Click "Add New..." > "Project"
   - Connect to your GitHub repository
   - Configure the project:
     - Framework preset: Next.js
     - Root directory: (leave default)
     - Build command: `npm run build`
     - Install command: `npm ci`
   - Add all environment variables from your `.env` file
   - Click "Deploy"

3. **Post-Deployment**
   - Set up custom domain (torchgroup.co)
   - Configure DNS records
   - Test all functionality on live site
   - Run performance audits with Lighthouse

## Critical Environment Variables

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

## Database Setup

After deployment, you need to set up the database:

```bash
# From local machine, pointing to production database
npx prisma db push
```

## Reference Documentation

For detailed deployment instructions, refer to:
- `VERCEL_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Detailed checklist for deployment
- `POST_DEPLOYMENT_CHECKLIST.md` - Tasks to complete after deployment

## Notes for Launch

- SEO is excellent (99/100)
- API routes are all implemented and functioning
- Build completes successfully
- Fix missing image alt tags
- Create proper OG image before production launch 