# Torch Group Website - Deployment Checklist

This document provides a comprehensive checklist for deploying the Torch Group website to production.

## Pre-Deployment Tasks

- [ ] Configure DNS settings for `torchgroup.co` domain
- [ ] Set up SSL certificate for secure HTTPS connections
- [ ] Create database in Supabase or preferred PostgreSQL provider
- [ ] Set up email service (SMTP or Resend.com) for notifications
- [ ] Create UploadThing account for file uploads
- [ ] Prepare all environment variables from `.env.example`

## Environment Variables Setup

- [ ] Database connection strings (DATABASE_URL, DIRECT_URL)
- [ ] NextAuth secret and URL (NEXTAUTH_SECRET, NEXTAUTH_URL)
- [ ] Supabase credentials (if using Supabase)
- [ ] Email service credentials
- [ ] UploadThing credentials
- [ ] Base URL configuration

### Safe Environment Variable Handling

We provide several tools to help manage environment variables:

1. Use `npm run env:check` to verify if a .env file exists
2. Use `npm run env:create` to safely create a new .env file (won't overwrite existing)
3. Use `npm run env:create:force` only when you need to reset to defaults

For environment scripts:
- `create-env.ps1` - Creates a new .env file (won't overwrite existing)
- `update_env_fixed.ps1` - Updates for production (asks for confirmation)
- `update_env.ps1` - Updates connection strings only (asks for confirmation)

⚠️ **Important**: Never overwrite environment files in production without backup!

## Deployment Process

### Vercel Deployment (Recommended)

- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up custom domain `torchgroup.co` in Vercel
- [ ] Deploy project from main branch
- [ ] Verify build completes successfully
- [ ] Check deployment logs for any errors

### Self-Hosted Deployment

- [ ] Clone repository to server
- [ ] Install Node.js (v20+)
- [ ] Create `.env` file with all required variables
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` to build the project
- [ ] Set up process manager (PM2 recommended)
- [ ] Configure reverse proxy (Nginx or similar)
- [ ] Set up SSL certificate (Let's Encrypt recommended)
- [ ] Start the application with `npm run start`

## Post-Deployment Verification

- [ ] Verify homepage loads correctly
- [ ] Check all public pages (About, Services, Blog)
- [ ] Test responsive design on mobile devices
- [ ] Verify admin login works (`admin@torchgroup.co`)
- [ ] Change default admin password
- [ ] Test contact form submission
- [ ] Verify contact form emails are received
- [ ] Test newsletter subscription
- [ ] Verify file uploads work in dashboard
- [ ] Check all dashboard features

## Content Setup

- [ ] Replace any placeholder content
- [ ] Add initial blog posts
- [ ] Configure team members
- [ ] Set up projects
- [ ] Configure talents
- [ ] Reorder homepage sections if needed

## SEO & Analytics

- [ ] Verify meta tags are correct on all pages
- [ ] Set up Google Analytics or preferred analytics service
- [ ] Create robots.txt file
- [ ] Submit sitemap to search engines
- [ ] Set up Google Search Console

## Performance & Optimization

- [ ] Test website performance with Lighthouse
- [ ] Optimize any large images
- [ ] Verify loading times are acceptable
- [ ] Check for any layout shifts or UI issues
- [ ] Ensure all animations run smoothly

## Security Checks

- [ ] Verify authentication system works correctly
- [ ] Test role-based access controls
- [ ] Ensure API routes are properly protected
- [ ] Check for any exposed environment variables

## Backup & Recovery Plan

- [ ] Set up database backups
- [ ] Document recovery procedures
- [ ] Prepare rollback plan in case of issues

## Launch Checklist

- [ ] Final review of all pages and features
- [ ] Confirmation from client on content and functionality
- [ ] Go live with production domain
- [ ] Monitor for any issues in the first 48 hours
- [ ] Schedule follow-up for any necessary adjustments

---

## Contact Information

For support during the deployment process, please contact:

- Technical Support: support@torchgroup.co
- Project Manager: manager@torchgroup.co

---

© 2024 Torch Group | All Rights Reserved 