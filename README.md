# Torch Group Website

A modern, responsive website for Torch Group with integrated CMS dashboard, user management, and analytics.

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS, ShadCn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL via Supabase
- **Authentication**: NextAuth.js with role-based authorization
- **File Storage**: UploadThing
- **Email**: Resend
- **SMS Verification**: Twilio (optional)
- **Form Validation**: React Hook Form + Zod
- **Analytics**: Custom analytics implementation with database and file fallbacks
- **Testing**: Jest, React Testing Library

## Features

- **Public Website**
  - Responsive homepage with dynamic sections
  - Blog with CMS integration
  - Services showcase
  - About page
  - Contact form with SMS verification
  - Team members showcase
  - Projects gallery
  - Talents management integration

- **Admin Dashboard**
  - Authentication with role-based access control
  - Blog post management
  - Project management
  - Team member management
  - Talent management
  - Contact form submissions
  - Homepage section reordering
  - Analytics dashboard
  - User management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- UploadThing account for file uploads
- Resend account for email sending (optional)
- Twilio account for SMS verification (optional)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/torch-group.git
   cd torch-group
   ```

2. Install dependencies
   ```bash
   npm install
   # If you encounter dependency conflicts, use:
   npm install --legacy-peer-deps
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. Set up the database
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Create an admin user
   ```bash
   node create-admin.js
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npx tsc --noEmit` - Run TypeScript type check
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run archive:scripts` - Archive development and admin scripts

## Deployment

### Prerequisites

- Vercel account or another hosting provider
- PostgreSQL database (production)
- Environment variables configured in hosting platform

### Deployment Steps

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy the application
4. Run database migrations

## API Documentation

The API documentation is available at `/dashboard/api-docs` when logged in as an admin user. This page lists all available API endpoints, their parameters, and expected responses.

## Project Structure

```
src/
├── app/                    # Next.js routes and API endpoints
│   ├── (admin)/           # Admin routes
│   ├── (public)/          # Public routes
│   └── api/               # API routes
├── components/            # React components organized by feature
│   ├── analytics/         # Analytics components and charts
│   ├── animations/        # Animation components
│   ├── auth/             # Authentication components
│   ├── blog/             # Blog components
│   ├── common/           # Shared components (Header, Footer)
│   ├── contact/          # Contact form and related components
│   ├── dashboard/        # Dashboard components
│   ├── loading/          # Loading components and providers
│   ├── newsletter/       # Newsletter components
│   ├── settings/         # Settings components
│   ├── team/             # Team member components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Library code and utilities
├── store/               # Global state management
├── styles/              # Global styles and CSS
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

Each feature folder may contain:
- Components specific to that feature
- Feature-specific hooks
- Feature-specific types
- Feature-specific utilities

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

All rights reserved © Torch Group

## Overview

The Torch Group website is built with the latest web technologies to ensure optimal performance, security, and ease of management. The site includes both public-facing pages and a comprehensive admin dashboard for content management.

## Technical Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 6
- **Authentication**: NextAuth.js 5
- **UI Components**: ShadCn UI
- **Form Handling**: React Hook Form + Zod validation
- **Media Uploads**: UploadThing
- **Email Sending**: Resend API

## Deployment Requirements

To deploy the Torch Group website, you will need:

1. **Node.js**: Version 20+ recommended
2. **Database**: Supabase or any PostgreSQL database
3. **Environment Variables**: Properly configured .env file (see below)
4. **Hosting Platform**: Vercel (recommended), Netlify, or any hosting service supporting Next.js

## Environment Setup

Before deploying, create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&connection_limit=5
DIRECT_URL=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&sslmode=require

# NextAuth Configuration
NEXTAUTH_SECRET=[your-secret-key]
NEXTAUTH_URL=https://torchgroup.co

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Email Configuration
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=[your-smtp-password]
SMTP_FROM=Torch Group <notifications@torchgroup.co>
RESEND_API_KEY=[your-resend-api-key]

# UploadThing Configuration 
UPLOADTHING_SECRET=[your-uploadthing-secret]
UPLOADTHING_APP_ID=[your-uploadthing-app-id]

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://torchgroup.co
```

## Deployment Steps

1. Clone the repository and navigate to the project directory
2. Install dependencies: `npm install`
3. Set up your environment variables as outlined above
4. Build the project: `npm run build`
5. Start the server: `npm run start`

If deploying to Vercel:

1. Connect your GitHub repository to Vercel
2. Add the environment variables in the Vercel dashboard
3. Deploy the main branch

## Initial Admin Setup

The system comes with an initial admin user that can be accessed with:

- Email: `admin@torchgroup.co`
- Password: `admin123`

**IMPORTANT**: Change this password immediately after your first login.

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Verify all pages are loading correctly
- [ ] Test contact form submission
- [ ] Test newsletter signup
- [ ] Check file uploads in dashboard
- [ ] Verify all API endpoints are working
- [ ] Configure email notification settings
- [ ] Set up analytics tracking (if applicable)

## Content Management

The admin dashboard provides interfaces for managing:

- **Blog Posts**: Create, edit, and publish blog content
- **Team Members**: Add or update team member profiles
- **Talents**: Manage talent profiles and categories
- **Projects**: Add or update project showcases
- **Contact Messages**: View and respond to contact form submissions
- **Users**: Manage admin and editor accounts
- **Homepage Sections**: Reorder homepage sections

## Mobile Responsiveness

The website is fully responsive and optimized for all device sizes. Key responsive features include:

- Responsive navigation with mobile menu
- Flexible grid layouts that adapt to screen size
- Optimized typography and spacing for small screens
- Touch-friendly interactions
- Custom responsive CSS with tailored breakpoints
- Properly scaled images and media elements

## Support

For technical support or questions related to the website, please contact:

- Technical Support: support@torchgroup.co
- Content Management: admin@torchgroup.co

## Client Handoff Notes

Mr. Azzez,

Thank you for choosing our services to develop the Torch Group website. This README provides all the necessary information to deploy and maintain your new website.

Key points to note:

1. The website is built with Next.js 15, providing excellent performance and SEO capabilities
2. All references to your domain have been set to `torchgroup.co`
3. The admin dashboard provides full control over content without requiring technical knowledge
4. The design is fully responsive and tested on mobile, tablet, and desktop devices
5. Email templates are ready for your notifications and customer communications

Please complete the post-deployment checklist after launching the site, and don't hesitate to reach out if you have any questions.

---

© 2024 Torch Group | All Rights Reserved

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Loading Screen

The Torch Group site includes a stylish loading screen with the following features:

- Animated logo with pulsing red glow effect
- Loading indicator with animated dots
- Progress bar indicating load completion
- Automatically appears during initial page load and navigation
- Can be manually triggered for asynchronous operations

The loading implementation consists of several components:

1. **LoadingProvider** - Context provider that manages loading state (`src/components/providers/loading-provider.tsx`)
2. **LoadingScreen** - Visual loading UI with animations (`src/components/ui/loading-screen.tsx`) 
3. **LoadingObserver** - Handles page transitions (`src/components/layout/loading-observer.tsx`)
4. **usePageLoading** - Hook for manual loading control (`src/hooks/use-page-loading.ts`)
5. **LoadingToggle** - Dev tool for testing loading screen (`src/components/ui/loading-toggle.tsx`)

### Usage

To manually control the loading screen in any component:

```tsx
"use client";
import { useLoading } from "@/components/providers/loading-provider";

export default function MyComponent() {
  const { startLoading, stopLoading } = useLoading();
  
  const handleLoadingOperation = async () => {
    startLoading();
    try {
      // Perform async operation
      await someAsyncFunction();
    } finally {
      stopLoading();
    }
  };
  
  return (
    <button onClick={handleLoadingOperation}>
      Perform Operation
    </button>
  );
}
```

For page transitions, the loading is automatically managed by the `LoadingObserver` component.

## Environment Configuration

The project contains several PowerShell scripts for setting up environment variables:

- `create-env.ps1` - Creates a new .env file with default development settings
- `update_env_fixed.ps1` - Updates .env with production-ready settings
- `update_env.ps1` - Updates specific database connection strings
- `update_env_new.ps1` - Updates .env with alternative settings format
- `update_env_arabic.ps1` - Arabic script to update database URLs

### 🔒 Preserving Your Local Environment

All scripts have been updated to:
1. Check if a `.env` file already exists
2. Ask for confirmation before overwriting or modifying existing files
3. Provide clear warnings about potential data loss

To manually set up your environment:
1. Copy `.env.example` to `.env`
2. Update the values with your actual credentials
3. Run `npm run dev` to start the development server

⚠️ **Important**: Cursor will not overwrite your existing `.env` file when running these scripts.
