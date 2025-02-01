import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  unClassifiedFolderId: string | undefined
  setUnClassifiedFolderId: (id: string | undefined) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      unClassifiedFolderId: undefined,
      setUnClassifiedFolderId: (id: string | undefined) =>
        set({ unClassifiedFolderId: id }),
    }),
    {
      name: "settings-storage",
    }
  )
)
