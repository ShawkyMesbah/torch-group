# Deployment Guide

## Prerequisites

Before deploying the Torch Group website, ensure you have:

1. Node.js 18+ installed
2. A Vercel account (recommended) or another hosting platform
3. A PostgreSQL database (via Supabase or other provider)
4. Required environment variables ready

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key

# File Upload Configuration (UploadThing)
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# Analytics Configuration
ANALYTICS_ENABLED=true
```

## Deployment Steps

### 1. Prepare for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy
```

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### 3. Post-Deployment Checks

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Check file uploads
- [ ] Verify contact form submission
- [ ] Test admin dashboard access
- [ ] Monitor error logs
- [ ] Check analytics tracking

## Performance Monitoring

The application includes built-in performance monitoring:

- Page load metrics tracking
- Custom performance measurements
- Error logging
- Analytics tracking

Access these metrics via:
- `/api/log-performance` - Performance metrics
- `/api/log-error` - Error logs
- Admin dashboard analytics section

## Security Measures

The deployment includes:

1. Security Headers
   - X-DNS-Prefetch-Control
   - X-XSS-Protection
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer-Policy

2. Authentication Protection
   - API routes are protected
   - Admin routes require authentication
   - Rate limiting on sensitive endpoints

3. Error Handling
   - Production error logging
   - Error boundaries for UI components
   - API error handling

## Monitoring Setup

1. Error Monitoring
   - Check `/api/log-error` logs
   - Monitor admin dashboard alerts
   - Set up error notifications

2. Performance Monitoring
   - Track page load times
   - Monitor API response times
   - Check resource usage

3. Analytics
   - User engagement metrics
   - Feature usage statistics
   - Error rates and types

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues
   ```bash
   # Check database connection
   npx prisma db push
   ```

2. Build Errors
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

3. Authentication Problems
   - Verify environment variables
   - Check NextAuth configuration
   - Clear browser cookies

## Maintenance

Regular maintenance tasks:

1. Database
   - Run migrations
   - Monitor performance
   - Backup data

2. Updates
   - Keep dependencies updated
   - Check for security patches
   - Update content regularly

3. Monitoring
   - Check error logs
   - Monitor performance metrics
   - Review analytics data

## Support

For technical support:
- Email: support@torchgroup.co
- Documentation: /dashboard/api-docs
- GitHub Issues: [Repository URL]

---

## Contact Information

For support during the deployment process, please contact:

- Technical Support: support@torchgroup.co
- Project Manager: manager@torchgroup.co

---

© 2024 Torch Group | All Rights Reserved 