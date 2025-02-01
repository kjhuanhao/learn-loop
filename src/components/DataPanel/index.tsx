"use client"

import { ChartNoAxesCombined, FolderOpen } from "lucide-react"
import { SwitchPanelButton } from "../SwitchPanelButton"
import { Chart } from "./chart"
import { Heatmap } from "./heatmap"
import { TodayDataPanel } from "./today"
import { QuestionGroup } from "@/components/Group"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

interface DataPanelProps {
  activeIndex: number
  setActiveIndex: (index: number) => void
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
      <TodayDataPanel />
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
