"use client"
import { useElapsedTime } from "use-elapsed-time"
import { useCallback, useEffect, useRef } from "react"
import { useTimerStore } from "@/stores/timeSlice"
import {
  getTodayLearningRecord,
  upsertTodayLearningRecordWithTime,
} from "@/actions/record"
import { useMutation, useQuery } from "@tanstack/react-query"

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

  // 基准时间
  const baseTimeRef = useRef(0)

  // 获取今日学习记录
  const { data: todayRecord } = useQuery({
    queryKey: ["todayLearningRecord"],
    queryFn: getTodayLearningRecord,
  })

  // 更新学习记录
  const { mutate } = useMutation({
    mutationFn: async () => {
      // 将秒转换为分钟字符串，保留一位小数
      const minutes = (time / 60).toFixed(1).toString()
      await upsertTodayLearningRecordWithTime(minutes)
    },
  })

  const { elapsedTime, reset: resetTime } = useElapsedTime({
    isPlaying,
    updateInterval,
    onUpdate: (elapsed) => {
      // 使用基准时间 + 已经过时间来计算总时间
      const totalTime = baseTimeRef.current + elapsed
      setTime(totalTime)
      // 每分钟更新一次学习记录
      if (Math.floor(totalTime) % 60 === 0 && totalTime > 0) {
        mutate()
      }
    },
  })

  // 初始化时设置已有的学习时间
  useEffect(() => {
    if (todayRecord?.data) {
      // 将分钟字符串转换为秒
      const savedMinutes = todayRecord.data.learningTime
        ? parseFloat(todayRecord.data.learningTime)
        : 0
      // 转换为秒
      const seconds = Math.floor(savedMinutes * 60)
      baseTimeRef.current = seconds
      setTime(seconds)
      resetTime()
    } else {
      // 如果没有记录，从 0 开始
      baseTimeRef.current = 0
      setTime(0)
      resetTime()
    }
  }, [todayRecord, setTime, resetTime])

  // 自动开始
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true)
    }
    // 清理函数
    return () => {
      if (autoStart) {
        setIsPlaying(false)
        // 停止时保存记录
        mutate()
      }
    }
  }, [autoStart, setIsPlaying, mutate])

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
    // 暂停时保存学习记录
    mutate()
  }, [setIsPlaying, mutate])

  const reset = useCallback(() => {
    resetTime()
    resetStore()
    // 重置时也要保存记录
    mutate()
  }, [resetTime, resetStore, mutate])

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev)
    // 如果是暂停，保存记录
    if (isPlaying) {
      mutate()
    }
  }, [setIsPlaying, isPlaying, mutate])

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
