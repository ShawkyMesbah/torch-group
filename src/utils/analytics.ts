/**
 * Client-side analytics utility
 */

import { AnalyticsEventType } from '@/generated/prisma';

interface EventData {
  type: AnalyticsEventType;
  meta: Record<string, any>;
}

// Store event by sending to API endpoint
async function storeEvent(data: EventData): Promise<string | null> {
  try {
    // Try to send to server endpoint
    const response = await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.id;
    }
    
    // Fallback to localStorage if server request fails
    return storeEventLocally(data);
  } catch (error) {
    // Fallback to localStorage on error
    return storeEventLocally(data);
  }
}

// Store event in local storage as fallback
function storeEventLocally(data: EventData): string | null {
  try {
    const id = `browser_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const event = {
      id,
      type: data.type,
      meta: data.meta,
      createdAt: new Date().toISOString(),
    };
    
    // Store in localStorage
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      storedEvents.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
    } catch (e) {
      // Silently fail if localStorage is not available
    }
    
    return id;
  } catch (error) {
    return null;
  }
}

// Public analytics API
export const analytics = {
  /**
   * Track a page view
   */
  pageView: async (path: string, referrer: string = '', userAgent: string = '') => {
    return await storeEvent({
      type: 'PAGE_VIEW',
      meta: {
        path,
        referrer,
        userAgent,
        timestamp: new Date().toISOString(),
      },
    });
  },
  
  /**
   * Track a form submission
   */
  formSubmit: async (formId: string, formData: Record<string, any> = {}, path: string = '') => {
    return await storeEvent({
      type: 'FORM_SUBMIT',
      meta: {
        formId,
        formData,
        path,
        timestamp: new Date().toISOString(),
      },
    });
  },
  
  /**
   * Track a phone verification
   */
  phoneVerified: async (phone: string, path: string = '') => {
    return await storeEvent({
      type: 'PHONE_VERIFIED',
      meta: {
        phone,
        path,
        timestamp: new Date().toISOString(),
      },
    });
  },
  
  /**
   * Track a talent click
   */
  talentClick: async (talentId: string, talentName: string, path: string = '') => {
    return await storeEvent({
      type: 'TALENT_CLICK',
      meta: {
        talentId,
        talentName,
        path,
        timestamp: new Date().toISOString(),
      },
    });
  },
  
  /**
   * Sync offline events to the server
   * This will send any events stored in localStorage to the server
   */
  syncOfflineEvents: async (): Promise<boolean> => {
    try {
      // Get events from localStorage
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      if (events.length === 0) return true;
      
      // Send events to server
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
      
      if (response.ok) {
        // Clear events from localStorage on success
        localStorage.setItem('analytics_events', '[]');
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  },
};

export default analytics; 