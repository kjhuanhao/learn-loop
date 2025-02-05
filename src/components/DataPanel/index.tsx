"use client"

import { ChartNoAxesCombined, FolderOpen } from "lucide-react"
import { SwitchPanelButton } from "../SwitchPanelButton"
import { Chart } from "./chart"
import { Heatmap } from "./heatmap"
import { TodayDataPanel } from "./today"
import { QuestionGroup } from "@/components/Group"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useRecords } from "@/hooks/use-records"

interface LearningRecord {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  learningTime: string
  questionCount: number
  reviewCount: number
  continuousDay?: number
}

interface ActionResponse<T> {
  data: T
}

interface DisplayData {
  todayTotal: number
  yesterdayTotal: number
  todayTime: string
  yesterdayTime: string
  totalTime: string
  continuousDay: number
}

interface DiffData {
  totalDiff: string
  timeDiff: string
  continuousDiff: string
}

interface DataPanelProps {
  activeIndex: number
  setActiveIndex: (index: number) => void
}

// 计算今日与昨日的数据差异
const calculateDiff = (today: number, yesterday: number) => {
  const diff = today - yesterday
  return diff >= 0 ? `+${diff}` : `${diff}`
}

// 计算时间差异（小时）
const calculateTimeDiff = (today: string, yesterday: string) => {
  const diffMinutes = parseFloat(today) - parseFloat(yesterday)
  const diffHours = diffMinutes / 60
  return diffHours >= 0 ? `+${diffHours.toFixed(1)}` : `${diffHours.toFixed(1)}`
}

// 将分钟转换为小时，保留一位小数
const minutesToHours = (minutes: string) => {
  return (parseFloat(minutes) / 60).toFixed(1)
}

const variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
}

export const DataPanel = ({ activeIndex, setActiveIndex }: DataPanelProps) => {
  const [preloadedChart, setPreloadedChart] = useState<React.ReactNode | null>(
    null
  )
  const [preloadedGroup, setPreloadedGroup] = useState<React.ReactNode | null>(
    null
  )

  const { data: response, isLoading } = useRecords()

  const records = response?.data || []

  const defaultRecord = {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "",
    questionCount: 0,
    reviewCount: 0,
    learningTime: "0",
    continuousDay: 0,
  }

  const todayData = records[0] || defaultRecord
  const yesterdayData = records[1] || defaultRecord

  // 计算展示数据
  const displayData: DisplayData = {
    todayTotal: todayData.questionCount + todayData.reviewCount,
    yesterdayTotal: yesterdayData.questionCount + yesterdayData.reviewCount,
    todayTime: minutesToHours(todayData.learningTime),
    yesterdayTime: minutesToHours(yesterdayData.learningTime),
    totalTime: minutesToHours(
      records
        .reduce(
          (acc: number, curr: LearningRecord) =>
            acc + parseFloat(curr.learningTime),
          0
        )
        .toString()
    ),
    continuousDay: todayData.continuousDay || 0,
  }

  // 计算差异
  const diffData: DiffData = {
    totalDiff: calculateDiff(
      displayData.todayTotal,
      displayData.yesterdayTotal
    ),
    timeDiff: calculateTimeDiff(
      todayData.learningTime,
      yesterdayData.learningTime
    ),
    continuousDiff: "+1",
  }

  // 预加载组件
  useEffect(() => {
    const preloadComponents = async () => {
      // 预加载非当前显示的组件
      if (activeIndex === 0) {
        setPreloadedChart(<Chart />)
      } else {
        setPreloadedGroup(<QuestionGroup />)
      }
    }
    preloadComponents()
  }, [activeIndex])

  return (
    <div className="space-y-4">
      <TodayDataPanel
        displayData={displayData}
        diffData={diffData}
        isLoading={isLoading}
      />
      <SwitchPanelButton
        panels={[
          {
            title: "我的题组",
            onClick: () => setActiveIndex(0),
            icon: FolderOpen,
          },
          {
            title: "趋势数据",
            onClick: () => setActiveIndex(1),
            icon: ChartNoAxesCombined,
          },
        ]}
        activeIndex={activeIndex}
      />
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activeIndex === 0 ? (
            <motion.div
              key="questionGroup"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
            >
              <QuestionGroup />
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
            >
              <Chart />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* 预加载的组件，使用 hidden 隐藏 */}
      <div className="hidden">
        {preloadedChart}
        {preloadedGroup}
      </div>
      <Heatmap />
    </div>
  )
}
