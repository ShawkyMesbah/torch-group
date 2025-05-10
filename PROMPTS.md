# PROMPTS

## Prompt 1

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

## Prompt 2

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

## Prompt 3

We already set DATABASE_URL in `.env`, make this step done:

- [x] Set up PostgreSQL database

Start from this step:

- [ ] Configure Prisma schema:
  - User (with role)
  - Service (title, icon, description)
  - SubBrand (name, image, summary)
  - About (content, stats)
  - ContactMessage (name, email, phone, message)

## Prompt 4

- [ ] Implement NextAuth.js authentication:
  - Email/Password login
  - JWT handling
  - Role-based access control
  - Protected routes and middleware

## Prompt 5

Implement Landing Page sections step-by-step:
- [ ] Hero Section
- [ ] Our Services
- [ ] About + Sub-Brands
- [ ] Contact Form (submit-only)