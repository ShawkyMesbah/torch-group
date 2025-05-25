# Torch Group Project - Prompt Library

This document contains prompts used throughout the development of the Torch Group website and dashboard. They are categorized by feature area for easy reference.

## Project Setup and Configuration

### Initial Project Setup
```
Create development steps in `Scratchpad` of `.cursorrules` to create a corporate website for Torch Group with an admin dashboard using TypeScript, Next.js 15, TailwindCSS, Shadcn, Lucide, Zod, Zustand, Resend, Uploadthing, Prisma, Supabase (PostgreSQL), and next-auth@beta.

Landing Page Sections:
- Hero Section
- Our Services
- About Torch Group
- Sub-Brands (visual only)
- Contact Form (stores messages in DB, no reply system)

Admin Dashboard Features:
- Content Management (CRUD)
- Role-based access (Admin / Manager)
- View-only contact messages
- Authentication with next-auth
- Email verification and notifications
```

### Dependency Installation
```
We already done these steps:
- [x] Initialize Next.js 15 project with TypeScript
- [x] Set up project structure and folders
- [x] Configure ESLint and Prettier

Start from this step:
Install and configure dependencies:
- TailwindCSS  
- Shadcn UI  
- Lucide  
- Prisma  
- Supabase  
- Uploadthing  
- Zod  
- Zustand  
- Resend  
- next-auth@beta
```

### Database Setup
```
We already set DATABASE_URL in `.env`, make this step done:
- [x] Set up PostgreSQL database

Start from this step:
- [ ] Configure Prisma schema:
  - User (with role)
  - Service (title, icon, description)
  - SubBrand (name, image, summary)
  - About (content, stats)
  - ContactMessage (name, email, phone, message)
```

## Authentication and Authorization

### NextAuth Configuration
```
Implement NextAuth.js authentication:
- Email/Password login
- JWT handling
- Role-based access control
- Protected routes and middleware
```

### Role-Based Authorization
```
Create a complete role-based authorization system for the Torch Group website with the following requirements:

1. Two roles: ADMIN and STAFF
2. ADMIN can access all dashboard features
3. STAFF can view content but cannot modify settings
4. Middleware to protect routes based on role
5. API route protection for data modification
6. Client-side role checks for UI adaptation

Ensure the implementation is secure and follows best practices for Next.js 15 with App Router.
```

### Development Mode Authentication
```
Create a development mode fallback for authentication in our Next.js application. When running in development without a database connection, allow login with hardcoded admin credentials (admin@torchgroup.co/admin) while maintaining normal authentication flow in production.
```

## UI Implementation

### Homepage Sections
```
Implement Landing Page sections step-by-step:
- [ ] Hero Section
- [ ] Our Services
- [ ] About + Sub-Brands
- [ ] Contact Form (submit-only)
```

### Hero Section Design
```
Create a modern hero section for the Torch Group homepage with:
1. Animated gradient background with subtle dot pattern
2. Centered logo with red pulse glow effect
3. Headline that emphasizes "Illuminating Brands, Igniting Growth"
4. Two call-to-action buttons: "Explore Torch" and "Get Started"
5. Responsive design that maintains impact on mobile devices
6. Smooth scroll behavior when buttons are clicked

Use TailwindCSS and Framer Motion for animations. Keep the design dark-themed with red accent colors matching Torch branding.
```

### Mobile Navigation
```
Create a mobile-responsive navigation menu for the Torch Group website with the following requirements:

1. Hamburger icon that transforms into an X when menu is open
2. Slide-in animation for menu items
3. Proper accessibility attributes (aria-expanded, etc.)
4. Prevent body scroll when menu is open
5. Close on outside click
6. Smooth transitions between states
7. Match the site's dark theme with red accents
```

### Dashboard UI
```
Design a modern admin dashboard interface for Torch Group with:
1. Sidebar navigation with icon and text labels
2. Overview page with key metrics (users, content, messages)
3. Data tables for content management with sorting and filtering
4. Form components for creating/editing content
5. Modal dialogs for confirmations and quick edits
6. Toast notifications for action feedback
7. Loading states and error handling
8. Responsive design for all screen sizes

Use ShadCn UI components with TailwindCSS for styling. Maintain the Torch Group brand colors (black background with red accents).
```

### Component Refinement
```
Refine the following UI components for the Torch Group website to improve user experience:
1. Contact form - Add underline styling to inputs, improve validation feedback
2. Service cards - Enhance hover effects with subtle animation and glowing effect
3. Talent cards - Add status badges and improve image presentation
4. Hero buttons - Implement smooth scroll behavior to target sections
5. Navigation links - Align with homepage section order for consistency
```

## API and Backend

### API Route Structure
```
Create a comprehensive API route structure for the Torch Group website using Next.js App Router. Include endpoints for:
1. Authentication (login, logout, session)
2. Content management (blog, projects, team)
3. Talent management (create, read, update, delete)
4. Contact form submission
5. Analytics tracking
6. Settings and configuration

Implement proper error handling, validation with Zod, and authorization checks. Each route should follow RESTful principles and return consistent response formats.
```

### Analytics Implementation
```
Implement a comprehensive analytics system for the Torch Group website with the following features:
1. Page view tracking
2. Event tracking (form submissions, talent clicks)
3. Offline storage fallback when database is unavailable
4. API endpoints for syncing offline events
5. Dashboard visualization of analytics data
6. Data source flexibility (database or file-based)
7. Privacy compliance (no PII storage)

The implementation should be resilient to network or database failures and provide accurate reporting in the admin dashboard.
```

### Contact Form API
```
Create a contact form submission API for the Torch Group website with:
1. Data validation using Zod
2. Database storage with Prisma
3. Email notification using Resend
4. File attachment handling with UploadThing
5. Phone verification flow
6. Success/error handling with proper responses
7. Rate limiting to prevent abuse

Ensure the implementation follows security best practices and handles all edge cases gracefully.
```

## Testing and Optimization

### Testing Framework
```
Set up a comprehensive testing framework for the Torch Group project with:
1. Jest configuration for running tests
2. React Testing Library for component tests
3. Unit tests for utility functions
4. Integration tests for API routes
5. Mock implementations for external services
6. Test coverage reporting
7. CI integration for automated testing

Provide examples for each type of test and documentation on how to run tests and interpret results.
```

### Performance Optimization
```
Implement performance optimizations for the Torch Group website focusing on:
1. Image loading optimization with next/image
2. Code splitting and dynamic imports
3. Server vs. client component balance
4. API response caching strategies
5. Bundle size reduction
6. Font loading optimization
7. Core Web Vitals improvements

Measure improvements against baseline performance metrics and document optimization strategies.
```

### Mobile Responsiveness
```
Enhance mobile responsiveness across the Torch Group website by:
1. Creating a dedicated responsive.css file for mobile-specific styles
2. Implementing fluid typography scaling
3. Adapting layouts from multi-column to single-column on small screens
4. Optimizing touch targets for mobile interaction
5. Ensuring form elements are usable on touch devices
6. Testing and fixing overflow issues on small screens
7. Updating viewport meta tag for better accessibility

Document the approach and provide guidelines for maintaining mobile compatibility in future updates.
```

## Deployment and DevOps

### Environment Configuration
```
Create a robust environment configuration system for the Torch Group project with:
1. Development, staging, and production environments
2. Environment-specific variable sets
3. Validation of required variables
4. Secure handling of sensitive information
5. Documentation of all environment variables
6. Helper scripts for environment setup
7. Default fallbacks for development mode

Ensure the implementation follows security best practices and makes local development easy while protecting production configurations.
```

### Deployment Guide
```
Create a comprehensive deployment guide for the Torch Group website on Vercel, including:
1. Environment variable configuration
2. Database connection setup
3. Build process optimization
4. Domain and SSL configuration
5. Monitoring and analytics setup
6. Rollback procedures
7. Post-deployment verification steps

The guide should be detailed enough for a developer to successfully deploy the application without prior knowledge of the project.
```

### CI/CD Pipeline
```
Design a CI/CD pipeline for the Torch Group project with:
1. Automated testing on pull requests
2. Code quality checks (linting, type checking)
3. Preview deployments for feature branches
4. Automated deployment to staging environment
5. Manual promotion to production
6. Notification system for build status
7. Performance measurement for each build

The pipeline should ensure code quality and provide confidence in the deployment process.
```

## Data Management

### Database Schema
```
Design a comprehensive database schema for the Torch Group website using Prisma ORM with models for:
1. Users with role-based access control
2. Blog posts with author relationships
3. Team members with social links
4. Projects with client information
5. Talents categorized by type and status
6. Contact messages with read status
7. Analytics events with metadata

Include necessary relationships, indexes, and constraints to ensure data integrity and performance.
```

### Seed Script
```
Create a seed script for the Torch Group database that generates realistic sample data for:
1. Admin and staff users with secure passwords
2. Blog posts with markdown content and images
3. Team members with profiles and social links
4. Projects with case studies and client information
5. Talents across different categories
6. Contact messages in various states
7. Analytics events for demonstration

The script should handle relationships correctly and use realistic content that represents the Torch Group brand.
```

### Content Migration
```
Develop a strategy and scripts for migrating content from the old Torch Group website to the new platform, including:
1. User account migration with password rehashing
2. Blog post conversion to the new schema
3. Media file migration to UploadThing
4. URL structure preservation for SEO
5. Redirects for changed URLs
6. Validation of migrated content
7. Rollback plan in case of issues

The migration should be non-destructive and verifiable at each step.
```

## Documentation

### API Documentation
```
Create comprehensive API documentation for the Torch Group website, including:
1. Endpoint descriptions and URL patterns
2. Request and response formats
3. Authentication requirements
4. Error codes and handling
5. Rate limiting information
6. Example requests and responses
7. Integration guidelines for external consumers

The documentation should be clear enough for both internal developers and potential external integrators.
```

### User Manual
```
Develop a user manual for the Torch Group admin dashboard covering:
1. Authentication and access control
2. Content management workflows
3. User management procedures
4. Settings and configuration options
5. Analytics interpretation
6. Common troubleshooting scenarios
7. Best practices for content creation

Include screenshots and step-by-step instructions for all major features.
```

### Developer Guide
```
Create a developer guide for the Torch Group project that includes:
1. Project structure and architecture overview
2. Local development environment setup
3. Coding standards and conventions
4. Testing procedures and guidelines
5. Contribution workflow
6. Common development tasks
7. Troubleshooting guide

The guide should enable new developers to quickly become productive on the project.
```