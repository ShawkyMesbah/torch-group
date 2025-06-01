import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  analyticsEnabled: boolean
}

interface SettingsStore {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  theme: 'system',
  sidebarCollapsed: false,
  analyticsEnabled: true,
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'settings-storage',
    }
  )
) 