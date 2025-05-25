# Torch Group Analytics System

The Torch Group website includes a robust analytics system for tracking user interactions and providing insights through the admin dashboard. The system features a fallback mechanism for offline data collection when the primary database is unavailable.

## Architecture Overview

The analytics system consists of:

1. **Client-side tracking utils** (`src/utils/analytics.ts`)
2. **API routes** for recording events and retrieving statistics
3. **Dashboard UI** with visualization components
4. **Fallback storage mechanisms** when the database is unavailable

## Event Types

The system currently tracks the following event types:

- `PAGE_VIEW` - Records visits to pages
- `FORM_SUBMIT` - Tracks form submissions
- `PHONE_VERIFIED` - Logs successful phone verifications
- `TALENT_CLICK` - Tracks interactions with talent profiles

## How Event Tracking Works

1. When a trackable event occurs, the client calls the appropriate tracking function:
   ```typescript
   import { trackPageView, trackFormSubmit, trackPhoneVerified, trackTalentClick } from "@/utils/analytics";

   // Examples
   trackPageView(); // Automatically captures current path
   trackFormSubmit('contact-form', formData);
   trackPhoneVerified(phoneNumber);
   trackTalentClick(talentId, talentName);
   ```

2. The tracking functions make a POST request to `/api/analytics` with the event data

3. The API route attempts to store the event in this order:
   - Prisma (Database)
   - Raw SQL (if Prisma model isn't migrated yet)
   - Local file storage (if database unavailable)
   - Browser localStorage (fallback for network issues)

## Offline Fallback Mechanism

The system implements multiple fallback layers:

1. **Server-side file storage**
   - Events are stored in `data/analytics-events.json` when the database is unreachable
   - Format: Array of event objects with type, meta data, and timestamp

2. **Client-side localStorage**
   - If the fetch request fails entirely, events are saved in localStorage
   - On page load, the system attempts to sync localStorage events

## Prisma Migration and Synchronization

When Supabase connection is restored:

1. **Run the pending migration**
   ```bash
   npx prisma migrate dev --name add_analytics_events
   ```

2. **Generate Prisma client**
   ```bash
   # On Windows, run as administrator
   npx prisma generate
   ```

3. **Sync local events to database**
   ```bash
   node scripts/sync-local-events-to-db.js
   ```
   This script will:
   - Load events from the local file
   - Insert them into the database
   - Create a backup of the original file
   - Remove successfully synced events from the local file

## Analytics Dashboard

The dashboard (`/dashboard/analytics`) provides visualizations of collected data and supports toggling between different data sources:

### Data Source Toggle

The UI includes a dropdown selector to switch between:

- **Auto (Default)** - Uses database if available, falls back to local file
- **Live Database** - Forces database as the source (may fail if unavailable)
- **File Storage** - Forces local file as the data source
- **Mock Data** - Uses generated mock data (for testing/development)

### Stats and Visualizations

The dashboard displays:
- Overview statistics (page views, form submissions, etc.)
- Daily activity trends
- Talent engagement metrics

## Extending the System

### Adding New Event Types

1. **Update the Prisma schema** (`prisma/schema.prisma`)
   ```prisma
   enum AnalyticsEventType {
     PAGE_VIEW
     FORM_SUBMIT
     PHONE_VERIFIED
     TALENT_CLICK
     NEWSLETTER_SUBMIT // New event type
   }
   ```

2. **Update TypeScript type** (`src/utils/analytics.ts`)
   ```typescript
   type AnalyticsEventType = 'PAGE_VIEW' | 'FORM_SUBMIT' | 'PHONE_VERIFIED' | 'TALENT_CLICK' | 'NEWSLETTER_SUBMIT';
   ```

3. **Add new tracking function** (`src/utils/analytics.ts`)
   ```typescript
   export function trackNewsletterSubmit(email: string) {
     return trackEvent('NEWSLETTER_SUBMIT', {
       email: email.substring(0, 3) + '***' + email.split('@')[1], // Privacy protection
       path: window.location.pathname,
       timestamp: new Date().toISOString(),
     });
   }
   ```

4. **Update API processing** in relevant route handlers

### Implementing Tracking in Components

```tsx
import { trackFormSubmit } from "@/utils/analytics";

// In your form submission handler
const handleSubmit = async (formData) => {
  try {
    // Submit form to server
    await submitToServer(formData);
    
    // Track successful submission
    trackFormSubmit('newsletter-form', { 
      source: 'footer',
      campaign: formData.campaign || 'default'
    });
    
    // Show success message
    setSubmitStatus('success');
  } catch (error) {
    setSubmitStatus('error');
  }
};
```

## Troubleshooting

### Database Connection Issues

If database connection fails:
- Check Supabase status and connection details in `.env`
- Run `node scripts/check-supabase-connection.js` to test connectivity
- Use the "File Storage" option in dashboard until connection is restored

### Missing Events

If events appear to be missing:
- Check browser localStorage for unsyncable events
- Verify that client-side tracking is properly implemented
- Ensure the API routes are correctly handling fallback storage

### Migration Failures

If Prisma migration fails due to network issues:
- Use `prisma db pull` to sync schema changes once connection is restored
- Then run `npx prisma generate` to update the client

## Maintenance Recommendations

1. **Regular backups**: Periodically export analytics data for safekeeping
2. **Cleaning old events**: Implement a retention policy for older events
3. **Monitoring**: Add alerts for database connection failures
4. **Rate limiting**: Consider adding rate limiting to prevent API abuse 