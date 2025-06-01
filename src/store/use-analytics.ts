import { create } from 'zustand'

export interface AnalyticsEvent {
  id: string
  type: string
  data: any
  timestamp: number
}

interface AnalyticsStore {
  events: AnalyticsEvent[]
  isTracking: boolean
  addEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => void
  clearEvents: () => void
  setTracking: (isTracking: boolean) => void
}

export const useAnalytics = create<AnalyticsStore>((set) => ({
  events: [],
  isTracking: true,
  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),
  clearEvents: () => set({ events: [] }),
  setTracking: (isTracking) => set({ isTracking }),
})) 