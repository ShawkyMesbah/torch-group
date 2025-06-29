# Torch Group Dashboard System

## Overview

This comprehensive dashboard system provides complete content management capabilities for the Torch Group website. It includes full CRUD operations for all content types, real-time statistics, and a professional dark-themed interface.

## 🚀 Features

### Core Dashboard Components
- **Real-time Statistics Dashboard** - Overview of all content types with live counts
- **Content Management** - Full CRUD operations for all content types
- **Professional UI** - Dark theme with consistent design system
- **Mobile Responsive** - Optimized for all device sizes
- **Authentication** - Secure session-based authentication
- **Search & Filtering** - Advanced filtering capabilities for all content types

### Content Types Managed
1. **Services** - B2B, B2C, B2T, B2A service offerings
2. **Brands** - Brand portfolio with logos and descriptions
3. **Projects** - Client work and project showcase
4. **Blog Posts** - Content management system
5. **Team Members** - Staff and team management
6. **Talents** - Talent directory management
7. **Contact Messages** - Customer inquiry management
8. **Analytics** - Performance tracking and insights

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/
│   │   └── dashboard/
│   │       ├── page.tsx                 # Main dashboard overview
│   │       ├── services/
│   │       │   ├── page.tsx            # Services management
│   │       │   └── new/page.tsx        # Create new service
│   │       ├── brands/
│   │       │   └── page.tsx            # Brands management
│   │       ├── projects/
│   │       │   └── page.tsx            # Projects management
│   │       ├── blog/
│   │       ├── team/
│   │       ├── talents/
│   │       ├── messages/
│   │       └── analytics/
│   └── api/
│       ├── services/                    # Services API endpoints
│       ├── brands/                      # Brands API endpoints
│       ├── projects/                    # Projects API endpoints
│       ├── blog/
│       ├── team-members/
│       ├── talents/
│       └── contact/
├── components/
│   └── dashboard/
│       ├── DashboardOverview.tsx        # Main dashboard component
│       └── loading/
└── prisma/
    └── schema.prisma                    # Database schema
```

## 🗄️ Database Schema

### New Models Added
```prisma
model Service {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  content     String
  category    ServiceCategory
  isPublished Boolean  @default(false)
  isFeatured  Boolean  @default(false)
  order       Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Brand {
  id           String   @id @default(cuid())
  name         String   @unique
  description  String
  logoUrl      String?
  websiteUrl   String?
  isActive     Boolean  @default(true)
  isComingSoon Boolean  @default(false)
  order        Int?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model HomepageSection {
  id        String   @id @default(cuid())
  title     String
  content   String
  order     Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SiteConfig {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

### Enhanced Existing Models
- **Project** - Added portfolio management capabilities
- **BlogPost** - Enhanced with CMS features
- **TeamMember** - Improved team management
- **Talent** - Enhanced talent directory
- **ContactMessage** - Better inquiry management

## 🔧 API Endpoints

### Services API
- `GET /api/services` - List all services with filtering
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get specific service
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service
- `GET /api/services/count` - Get service statistics

### Brands API
- `GET /api/brands` - List all brands with filtering
- `POST /api/brands` - Create new brand
- `GET /api/brands/[id]` - Get specific brand
- `PUT /api/brands/[id]` - Update brand
- `DELETE /api/brands/[id]` - Delete brand
- `GET /api/brands/count` - Get brand statistics

### Projects API
- `GET /api/projects` - List all projects with filtering
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/count` - Get project statistics

### Authentication
All CREATE, UPDATE, and DELETE operations require authentication via session tokens.

## 🎨 Design System

### Color Scheme
- **Primary**: Red (#DC2626)
- **Background**: Dark grays (#111827, #1F2937)
- **Text**: White and gray variants
- **Accents**: Blue, Green, Purple, Pink for categories

### Component Patterns
- **Cards**: Rounded corners with subtle borders
- **Buttons**: Consistent hover states and loading indicators
- **Forms**: Dark theme with red accent colors
- **Tables**: Responsive with action buttons
- **Loading States**: Skeleton loaders and spinners

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Next.js 14+
- Prisma ORM

### Installation
1. **Database Setup**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. **Environment Variables**
   Ensure these are set in your `.env` file:
   ```env
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="your-url"
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Access Dashboard**
   Navigate to `/dashboard` after authentication

### First Time Setup
1. Create your first admin user through the authentication system
2. Access the dashboard at `/dashboard`
3. Start creating content through the various management pages

## 📱 Usage Guide

### Dashboard Overview
- View real-time statistics for all content types
- Quick actions for creating new content
- Recent activity monitoring
- Performance metrics

### Content Management
1. **Services**: Manage B2B, B2C, B2T, B2A service offerings
2. **Brands**: Upload logos, manage brand information
3. **Projects**: Showcase client work with images and details
4. **Blog**: Full CMS with rich text editing
5. **Team**: Manage team member profiles
6. **Talents**: Directory of available talents

### Features
- **Search & Filter**: Find content quickly
- **Bulk Operations**: Manage multiple items
- **Status Management**: Published/Draft states
- **Image Upload**: Integrated file management
- **SEO Optimization**: Meta tags and slug management

## 🔒 Security Features

- **Session-based Authentication**: Secure user sessions
- **Role-based Access Control**: Admin/Staff permissions
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: Cross-site request forgery protection
- **SQL Injection Prevention**: Prisma ORM protection

## 🎯 Performance Optimizations

- **Code Splitting**: Dynamic imports for large components
- **Caching**: SWR for data fetching with caching
- **Image Optimization**: Next.js Image component
- **Database Indexing**: Optimized queries with proper indexes
- **Loading States**: Skeleton loaders for better UX

## 🔄 Data Flow

```
Frontend Dashboard → API Routes → Prisma ORM → PostgreSQL Database
                  ↘               ↗
                   Authentication Middleware
```

### Key Patterns
1. **Client-side State Management**: React hooks for local state
2. **Server-side Data Fetching**: API routes with proper error handling
3. **Real-time Updates**: Optimistic updates with fallback
4. **Form Validation**: Client and server-side validation

## 🧪 Testing

### API Testing
Test all endpoints using tools like Postman or curl:
```bash
# Test service creation
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Service","slug":"test-service","description":"Test","category":"B2B"}'
```

### UI Testing
- Manual testing of all CRUD operations
- Responsive design testing
- Authentication flow testing

## 📈 Analytics & Monitoring

### Built-in Analytics
- Content creation/update tracking
- User activity monitoring
- Performance metrics
- Error logging

### Monitoring
- Real-time dashboard statistics
- Content status monitoring
- System health checks

## 🔧 Customization

### Adding New Content Types
1. **Update Database Schema** in `prisma/schema.prisma`
2. **Create API Routes** in `src/app/api/[content-type]/`
3. **Build Dashboard Pages** in `src/app/(admin)/dashboard/[content-type]/`
4. **Update Overview Component** to include new statistics

### Styling Customization
- Modify Tailwind classes in components
- Update design system variables
- Customize color schemes in configuration

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL in .env
2. **Authentication**: Verify NEXTAUTH_SECRET and URL
3. **Permissions**: Ensure proper user roles
4. **API Errors**: Check server logs and network requests

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Authentication configured
- [ ] File upload configured
- [ ] SSL certificates installed
- [ ] Performance monitoring enabled

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **AWS**: Full control deployment
- **DigitalOcean**: Cost-effective hosting

## 📞 Support

For technical support or questions about the dashboard system:
1. Check this documentation
2. Review the code comments
3. Test in development environment
4. Check browser console for errors

## 🔄 Future Enhancements

### Planned Features
- [ ] Advanced analytics dashboard
- [ ] Bulk import/export functionality
- [ ] Advanced user role management
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Advanced file management
- [ ] Workflow automation

### Performance Improvements
- [ ] Server-side caching
- [ ] Edge computing integration
- [ ] Advanced image optimization
- [ ] Database query optimization

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Compatibility**: Next.js 14+, React 18+, Node.js 18+ 