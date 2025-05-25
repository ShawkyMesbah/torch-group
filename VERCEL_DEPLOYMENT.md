# Vercel Deployment Guide for Torch Group

This guide outlines the steps to deploy the Torch Group website to Vercel with proper SEO and environment configuration.

## Deployment Steps

1. Login to your Vercel account
2. Create a new project and link it to your GitHub repository
3. Configure the following environment variables
4. Deploy the application

## Environment Variables

Set the following environment variables in your Vercel project settings:

### Database Configuration
```
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres?schema=public&pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:[password]@[host]:[port]/postgres?schema=public
```

### NextAuth Configuration
```
NEXTAUTH_SECRET=[generate-a-long-secure-random-string]
NEXTAUTH_URL=https://torchgroup.co
```

### Twilio SMS Verification (Optional)
```
TWILIO_ACCOUNT_SID=[your-twilio-account-sid]
TWILIO_AUTH_TOKEN=[your-twilio-auth-token]
TWILIO_FROM_NUMBER=[your-twilio-phone-number]
```

### General Settings
```
NODE_ENV=production
SITE_URL=https://torchgroup.co
ANALYTICS_ENABLED=true
```

### UploadThing Configuration
```
UPLOADTHING_SECRET=[your-uploadthing-secret]
UPLOADTHING_APP_ID=[your-uploadthing-app-id]
```

## Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x or later
- **Install Command**: `npm ci`

## Domain Configuration

1. Add your domain (torchgroup.co) in the Vercel project settings
2. Configure DNS settings with your domain registrar
   - Add an A record pointing to Vercel's IP addresses
   - Add CNAME records for www and other subdomains

## Post-Deployment Checks

After deploying, verify:

1. The website loads correctly at https://torchgroup.co
2. Authentication works properly
3. Database connection is successful
4. Contact form sends verification codes (if Twilio is configured)
5. Analytics data is being collected

## SEO Verification

- Confirm meta tags are properly loaded
- Test Open Graph preview using https://www.opengraph.xyz
- Verify robots.txt is accessible at https://torchgroup.co/robots.txt
- Submit sitemap to Google Search Console at https://torchgroup.co/sitemap.xml
- Run Lighthouse audit to check SEO score and fix any issues 