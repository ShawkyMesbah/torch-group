/**
 * Client-side analytics utility
 */

import { AnalyticsEventType } from "@prisma/client";

interface AnalyticsEvent {
  type: AnalyticsEventType;
  meta?: Record<string, any>;
}

class Analytics {
  private static instance: Analytics;
  private queue: AnalyticsEvent[] = [];
  private isProcessing = false;

  private constructor() {
    // Initialize analytics
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => this.processQueue());
    }
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public async pageView(
    path: string,
    referrer?: string,
    userAgent?: string
  ): Promise<string | null> {
    await this.track(AnalyticsEventType.PAGE_VIEW, {
      path,
      referrer,
      userAgent,
    });
    return path;
  }

  public async formSubmit(
    formId: string,
    formData?: Record<string, any>,
    path?: string
  ): Promise<string | null> {
    await this.track(AnalyticsEventType.FORM_SUBMIT, {
      formId,
      formData,
      path,
    });
    return formId;
  }

  public async phoneVerified(
    phone: string,
    path?: string
  ): Promise<string | null> {
    await this.track(AnalyticsEventType.PHONE_VERIFIED, {
      phone,
      path,
    });
    return phone;
  }

  public async talentClick(
    talentId: string,
    talentName: string,
    path?: string
  ): Promise<string | null> {
    await this.track(AnalyticsEventType.TALENT_CLICK, {
      talentId,
      talentName,
      path,
    });
    return talentId;
  }

  private async track(type: AnalyticsEventType, meta: Record<string, any> = {}) {
    this.queue.push({ type, meta });
    await this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const event = this.queue.shift();
        if (!event) continue;

        await fetch("/api/analytics/event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: event.type,
            meta: {
              ...event.meta,
              timestamp: new Date().toISOString(),
            },
          }),
        });
      }
    } catch (error) {
      console.error("Failed to process analytics queue:", error);
      // Put failed events back in the queue
      if (this.queue.length > 0) {
        this.queue.unshift(...this.queue);
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance(); 