import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
  display: {
    language: string
    timezone: string
    dateFormat: string
  }
}

interface UserSettingsStore {
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  resetPreferences: () => void
}

const defaultPreferences: UserPreferences = {
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium'
  },
  display: {
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY'
  }
}

export const useUserSettings = create<UserSettingsStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        })),
      resetPreferences: () => set({ preferences: defaultPreferences })
    }),
    {
      name: 'user-preferences'
    }
  )
) 