# GitHub Actions Deployment Setup Guide

## Overview

This guide will help you set up automated deployment for the Torch Group project using GitHub Actions and Vercel.

## Prerequisites

- GitHub repository with the Torch Group code
- Vercel account with project created
- Production database (PostgreSQL) set up
- All required API keys and secrets

## Step 1: Configure GitHub Secrets

Navigate to your GitHub repository and go to **Settings → Secrets and variables → Actions**.

### Required Secrets

Add the following repository secrets:

#### Vercel Configuration
```
VERCEL_TOKEN          = your-vercel-token
VERCEL_ORG_ID         = your-vercel-org-id  
VERCEL_PROJECT_ID     = your-vercel-project-id
```

#### Database Configuration
```
DATABASE_URL          = postgresql://user:password@host:port/database?connection_limit=25
DIRECT_URL           = postgresql://user:password@host:port/database
```

#### Authentication
```
NEXTAUTH_SECRET      = your-nextauth-secret-32-chars-minimum
NEXTAUTH_URL         = https://your-domain.com
```

#### Email Service
```
RESEND_API_KEY       = re_your-resend-api-key
```

#### File Upload
```
UPLOADTHING_SECRET   = sk_your-uploadthing-secret
UPLOADTHING_APP_ID   = your-uploadthing-app-id
```

### How to Get These Values

#### Vercel Tokens
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings → Tokens**
3. Create a new token with appropriate scope
4. For ORG_ID and PROJECT_ID, check your project settings in Vercel

#### Database URLs
- Use your PostgreSQL connection string
- For `DATABASE_URL`, add `?connection_limit=25` for connection pooling
- For `DIRECT_URL`, use the same URL without connection limit parameters

#### NextAuth Secret
```bash
# Generate a secure secret
openssl rand -base64 32
```

#### API Keys
- **Resend**: Get from [Resend Dashboard](https://resend.com/api-keys)
- **UploadThing**: Get from [UploadThing Dashboard](https://uploadthing.com/dashboard)

## Step 2: Configure GitHub Environments

Create two environments in your GitHub repository:

### Staging Environment
1. Go to **Settings → Environments**
2. Click **New environment**
3. Name: `staging`
4. Configure environment-specific secrets if needed

### Production Environment  
1. Click **New environment**
2. Name: `production`
3. Add protection rules:
   - ✅ Required reviewers (recommended)
   - ✅ Wait timer (optional)
   - ✅ Deployment branches (main only)

## Step 3: Verify Workflow Configuration

Run the validation script to ensure everything is configured correctly:

```bash
npm run validate:github-actions
```

This will check:
- ✅ Workflow file exists and is valid
- ✅ All required secrets are referenced
- ✅ Test scripts are available
- ✅ Health check endpoints are configured
- ✅ Deployment URL handling is correct

## Step 4: Test the Deployment

### Manual Deployment
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy** workflow
4. Click **Run workflow**
5. Choose environment (staging/production)
6. Click **Run workflow**

### Automatic Deployment
- Push to `main` branch triggers staging deployment
- Manual trigger required for production deployment

## Step 5: Monitor Deployment

The workflow includes several monitoring steps:

### Health Checks
- Automatic health check after deployment
- Retries up to 5 times with 10-second intervals
- Validates `/api/health` endpoint

### Test Execution
- Unit tests with Jest
- End-to-end tests with Playwright
- Performance tests
- Coverage reporting

### Artifacts
- Test reports uploaded on completion
- Coverage reports available for download

## Workflow Features

### Environment-Specific Deployment
- **Staging**: Preview deployments for testing
- **Production**: Live deployments with `--prod` flag

### Database Migrations
- Automatic migration deployment for production
- Uses `DIRECT_URL` for migration connections

### Security
- Secrets properly masked in logs
- Environment isolation
- URL validation before health checks

### Error Handling
- Comprehensive error messages
- Retry mechanisms for transient failures
- Proper exit codes for CI/CD integration

## Troubleshooting

### Common Issues

#### 1. Invalid Deployment URL
```
❌ Invalid deployment URL: undefined
```
**Solution**: Check Vercel token permissions and project configuration

#### 2. Health Check Failures
```
❌ Health check failed after 5 attempts
```
**Solution**: 
- Verify `/api/health` endpoint is working
- Check database connectivity
- Ensure all environment variables are set

#### 3. Database Migration Errors
```
Error: Migration failed
```
**Solution**:
- Verify `DIRECT_URL` is correct
- Check database permissions
- Ensure migration files are valid

#### 4. Test Failures
```
Tests failed with exit code 1
```
**Solution**:
- Run tests locally first: `npm run test:ci`
- Check test configuration
- Verify all dependencies are installed

### Debug Steps

1. **Check Workflow Logs**
   - Go to Actions tab in GitHub
   - Click on failed workflow run
   - Expand failed steps to see detailed logs

2. **Validate Configuration**
   ```bash
   npm run validate:github-actions
   ```

3. **Test Locally**
   ```bash
   # Run the same commands locally
   npm ci
   npm run build
   npm run test:ci
   ```

4. **Verify Secrets**
   - Ensure all secrets are set in GitHub
   - Check secret names match exactly
   - Verify secret values are correct

## Security Best Practices

### Secret Management
- Use separate secrets for staging/production
- Rotate secrets regularly (every 90 days)
- Use least-privilege access for tokens
- Never commit secrets to code

### Environment Protection
- Require reviews for production deployments
- Use branch protection rules
- Limit who can trigger production deployments
- Monitor deployment logs regularly

### Database Security
- Use connection pooling for production
- Separate database users for different environments
- Enable SSL for database connections
- Regular security updates

## Monitoring and Alerts

### Built-in Monitoring
- Health check endpoints
- Performance monitoring
- Error tracking
- Deployment success/failure notifications

### External Monitoring (Recommended)
- Uptime monitoring (e.g., Pingdom, UptimeRobot)
- Error tracking (e.g., Sentry)
- Performance monitoring (e.g., New Relic)
- Log aggregation (e.g., LogRocket)

## Maintenance

### Regular Tasks
- **Weekly**: Review deployment logs
- **Monthly**: Update dependencies
- **Quarterly**: Rotate secrets
- **Annually**: Review and update workflow

### Updates
- Keep GitHub Actions up to date
- Update Node.js version as needed
- Update Vercel CLI when new versions are available
- Monitor for security advisories

## Support

If you encounter issues:

1. Check this documentation first
2. Run the validation script: `npm run validate:github-actions`
3. Review GitHub Actions logs
4. Check Vercel deployment logs
5. Verify all secrets and environment variables

For additional help, refer to:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## Quick Reference

### Validation Command
```bash
npm run validate:github-actions
```

### Manual Deployment
1. Go to GitHub Actions
2. Select Deploy workflow
3. Run workflow with environment choice

### Health Check URL
```
https://your-domain.com/api/health
```

### Required Secrets Checklist
- [ ] VERCEL_TOKEN
- [ ] VERCEL_ORG_ID  
- [ ] VERCEL_PROJECT_ID
- [ ] DATABASE_URL
- [ ] DIRECT_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] RESEND_API_KEY
- [ ] UPLOADTHING_SECRET
- [ ] UPLOADTHING_APP_ID

✅ **Your GitHub Actions deployment is now ready!** 