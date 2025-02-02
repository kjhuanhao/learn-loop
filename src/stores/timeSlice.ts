import { create } from "zustand"

interface TimerState {
  time: number
  isPlaying: boolean
  setTime: (time: number) => void
  setIsPlaying: (isPlaying: boolean | ((prev: boolean) => boolean)) => void
  reset: () => void
  getMinutes: () => number
}

export const useTimerStore = create<TimerState>((set, get) => ({
  time: 0,
  isPlaying: false,
  setTime: (time) => set({ time }),
  setIsPlaying: (isPlaying) =>
    set((state) => ({
      isPlaying:
        typeof isPlaying === "function"
          ? isPlaying(state.isPlaying)
          : isPlaying,
    })),
  reset: () => set({ time: 0, isPlaying: false }),
  getMinutes: () => Number((get().time / 60).toFixed(1)),
}))
