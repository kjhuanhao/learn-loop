"use client"
import { useElapsedTime } from "use-elapsed-time"
import { useCallback, useEffect } from "react"
import { useTimerStore } from "@/stores/timeSlice"

interface UseStudyTimerProps {
  autoStart?: boolean
  updateInterval?: number
}

interface FormattedTime {
  hours: string
  minutes: string
  seconds: string
}

export const useStudyTimer = ({
  autoStart = false,
  updateInterval = 1,
}: UseStudyTimerProps = {}) => {
  const {
    time,
    isPlaying,
    setTime,
    setIsPlaying,
    reset: resetStore,
  } = useTimerStore()

  const { elapsedTime, reset: resetTime } = useElapsedTime({
    isPlaying,
    updateInterval,
    onUpdate: (time) => setTime(time),
  })

  // 自动开始
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true)
    }
    // 清理函数
    return () => {
      if (autoStart) {
        setIsPlaying(false)
      }
    }
  }, [autoStart, setIsPlaying])

  const formatTime = useCallback((timeInSeconds: number): FormattedTime => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds % 60)

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    }
  }, [])

  const getReadableTime = useCallback((timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds % 60)

    const parts = []
    if (hours > 0) parts.push(`${hours}小时`)
    if (minutes > 0) parts.push(`${minutes}分钟`)
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}秒`)

    return parts.join("")
  }, [])

  const start = useCallback(() => {
    setIsPlaying(true)
  }, [setIsPlaying])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  const reset = useCallback(() => {
    resetTime()
    resetStore()
  }, [resetTime, resetStore])

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [setIsPlaying])

  const formattedTime = formatTime(time)
  const readableTime = getReadableTime(time)

  return {
    // 时间状态
    time,
    ...formattedTime,
    readableTime,

    // 计时器状态
    isPlaying,

    // 控制方法
    start,
    pause,
    reset,
    toggle,
  }
}
