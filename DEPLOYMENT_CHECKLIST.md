# Torch Group Deployment Checklist

This checklist ensures that all necessary steps are completed before deploying the Torch Group website to production.

## Pre-Deployment Tasks

### Environment Configuration
- [ ] Set up `.env` file with proper values for production
- [ ] Verify database connection string is correct
- [ ] Ensure all required API keys are valid (Resend, Twilio, UploadThing)
- [ ] Set `NODE_ENV=production`

### Build and Testing
- [ ] Run `npm run test` to ensure all tests pass
- [ ] Run `npm run prepare-deploy` to prepare for deployment
- [ ] Verify build completes successfully with `npm run build`
- [ ] Test production build locally with `npm start`

### SEO Optimization
- [ ] Update `sitemap.xml` with current date and all URLs
- [ ] Verify `robots.txt` configuration
- [ ] Create or update `public/images/og-image.jpg` (1200×630px)
- [ ] Verify all meta tags in layout.tsx
- [ ] Test Open Graph preview with https://www.opengraph.xyz

### Content and Data
- [ ] Ensure public directories exist (data, settings)
- [ ] Verify JSON configuration files are properly formatted
- [ ] Check database migrations are applied

### Analytics and Monitoring
- [ ] Configure analytics tracking endpoint
- [ ] Set up error monitoring (optional)
- [ ] Create offline analytics fallback directories

## Deployment Steps

### Vercel Deployment
- [ ] Login to Vercel dashboard
- [ ] Connect GitHub repository
- [ ] Configure all environment variables
- [ ] Set build settings:
  - Framework preset: Next.js
  - Build command: `next build`
  - Output directory: `.next`
  - Node.js version: 18.x or later
  - Install command: `npm ci`
- [ ] Deploy the project
- [ ] Configure custom domain (torchgroup.co)

## Post-Deployment Verification

### Functionality Testing
- [ ] Verify homepage loads correctly
- [ ] Test all navigation links
- [ ] Test contact form submission
- [ ] Verify newsletter subscription
- [ ] Test admin dashboard login
- [ ] Verify database connections and queries work
- [ ] Test all API endpoints

### Performance and SEO
- [ ] Run Lighthouse audit (Performance, Accessibility, SEO)
- [ ] Verify Core Web Vitals (CLS, LCP, FID)
- [ ] Test mobile responsiveness
- [ ] Check for console errors
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible

### Security
- [ ] Verify authentication works as expected
- [ ] Check API routes have proper authentication
- [ ] Ensure no sensitive data is exposed
- [ ] Test authorization for different user roles

## Critical Items to Complete

- [ ] **Create proper OG image** (public/images/og-image.jpg, 1200×630px)
- [ ] **Complete file upload integration** with UploadThing
- [ ] **Implement email service** with Resend API
- [ ] **Improve mobile responsiveness** of dashboard pages
- [ ] **Set Google verification code** in layout.tsx when available 