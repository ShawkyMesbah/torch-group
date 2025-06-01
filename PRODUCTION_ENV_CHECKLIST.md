# Production Environment Variables Checklist

> **Always review this checklist before any deployment or environment change.**

## Required Variables

### Database Configuration
- [X] `DATABASE_URL` - Production PostgreSQL connection string with connection pool settings
- [X] `DIRECT_URL` - Direct database connection URL (for migrations)
- [X] `DATABASE_CONNECTION_LIMIT` - Maximum number of database connections (recommended: 25)

### Authentication
- [X] `NEXTAUTH_SECRET` - Secure random string for session encryption (min 32 chars)
- [X] `NEXTAUTH_URL` - Production site URL (https://torchgroup.co)
- [X] `NEXTAUTH_JWT_SECRET` - Secret for JWT tokens (different from NEXTAUTH_SECRET)

### File Upload
- [X] `UPLOADTHING_SECRET` - UploadThing API secret
- [X] `UPLOADTHING_APP_ID` - UploadThing application ID
- [X] `UPLOAD_MAX_SIZE` - Maximum file upload size in bytes

### Email Service
- [X] `RESEND_API_KEY` - Resend API key for email sending
- [X] `EMAIL_FROM` - Verified sender email address
- [X] `EMAIL_REPLY_TO` - Reply-to email address for notifications

### Optional Services
- [ ] `TWILIO_ACCOUNT_SID` - Twilio account SID for SMS
- [ ] `TWILIO_AUTH_TOKEN` - Twilio auth token
- [ ] `TWILIO_PHONE_NUMBER` - Twilio phone number

### Analytics
- [X] `ANALYTICS_ENABLED` - Set to 'true' to enable analytics
- [X] `ANALYTICS_DB_TABLE` - Database table for analytics (default: 'analytics')
- [X] `ANALYTICS_RETENTION_DAYS` - Number of days to retain analytics data

## Security Recommendations

1. Use strong, randomly generated values for secrets:
   ```bash
   openssl rand -base64 32
   ```
2. Never reuse secrets between environments
3. Rotate secrets periodically (recommended: every 90 days)
4. Use environment-specific database users
5. Enable SSL for database connections
6. Set appropriate connection pool limits
7. Store secrets in a secure vault service

## Deployment Configuration

### Vercel
- [X] `VERCEL_ORG_ID` - Vercel organization ID
- [X] `VERCEL_PROJECT_ID` - Vercel project ID
- [X] `VERCEL_TOKEN` - Vercel deployment token
- [X] `VERCEL_ENV` - Environment name (production/staging)

### Database
- [X] Set `connection_limit` in DATABASE_URL
- [X] Configure SSL mode for database connection
- [X] Set up database backup schedule
- [X] Configure connection timeouts
- [X] Set statement timeout limits

## Monitoring
- [X] Set up error tracking service
- [X] Configure performance monitoring
- [X] Set up uptime monitoring
- [X] Enable database query logging
- [X] Configure log retention policies

## Pre-deployment Checklist
1. [X] Verify all required variables are set
2. [X] Test database connection with production credentials
3. [X] Verify email sending works with production API key
4. [X] Test file upload functionality
5. [X] Run database migrations
6. [X] Verify analytics tracking
7. [ ] Test SMS verification if enabled
8. [X] Check security headers
9. [X] Verify rate limiting configuration
10. [X] Test backup and restore procedures

## Post-deployment Verification
1. [X] Run health check endpoint
2. [X] Verify authentication flow
3. [X] Test file upload in production
4. [X] Confirm email notifications
5. [X] Check analytics data collection
6. [X] Verify database connection pool
7. [X] Monitor error logs
8. [X] Check SSL/TLS configuration
9. [X] Verify CDN configuration
10. [X] Test backup restoration

## Backup and Recovery
1. [X] Configure automated database backups
2. [X] Set up file storage backups
3. [X] Document restore procedures
4. [X] Test recovery process
5. [X] Set up monitoring for backup jobs

## Performance Optimization
1. [X] Configure Redis caching (if used)
2. [X] Set up CDN for static assets
3. [X] Enable database query caching
4. [X] Configure connection pooling
5. [X] Set up rate limiting 