import { create } from 'zustand'

interface PageLoadingStore {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const usePageLoading = create<PageLoadingStore>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
})) 