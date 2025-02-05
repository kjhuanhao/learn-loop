"use client"

import { Tooltip } from "@/components/ui/tooltip"
import { CalendarClock, CalendarIcon, Clock, Share2, Zap } from "lucide-react"
import { TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { cn } from "@/lib/utils"

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

interface TodayDataPanelProps {
  displayData: DisplayData
  diffData: DiffData
  isLoading?: boolean
}

const DataCard = ({
  title,
  icon: Icon,
  value,
  diff,
  bgClass,
  textColorClass,
  isLoading,
}: {
  title: string
  icon: any
  value: string
  diff: string
  bgClass: string
  textColorClass: string
  isLoading?: boolean
}) => {
  return (
    <div className={cn("flex flex-col gap-5 rounded-lg p-4", bgClass)}>
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <Icon className={cn("w-5 h-5 ml-2 shrink-0", textColorClass)} />
      </div>
      {isLoading ? (
        <>
          <div className="h-8 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
        </>
      ) : (
        <>
          <span className="text-2xl font-bold">{value}</span>
          <span className={cn("text-sm font-bold", textColorClass)}>
            {diff} 比昨天
          </span>
        </>
      )}
    </div>
  )
}

export const TodayDataPanel = ({
  displayData,
  diffData,
  isLoading,
}: TodayDataPanelProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-card-foreground">
            今日学习概览
          </h3>
          {/* <Tooltip>
            <TooltipTrigger>
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>分享</TooltipContent>
          </Tooltip> */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="今日学习&复习"
          icon={CalendarIcon}
          value={`${displayData.todayTotal}题`}
          diff={diffData.totalDiff}
          bgClass="bg-card-primary-background"
          textColorClass="text-color-primary-bright"
          isLoading={isLoading}
        />

        <DataCard
          title="今日总时长"
          icon={Clock}
          value={`${displayData.todayTime}小时`}
          diff={diffData.timeDiff}
          bgClass="bg-card-primary-1-background"
          textColorClass="text-color-secondary-bright"
          isLoading={isLoading}
        />

        <DataCard
          title="累计学习"
          icon={CalendarClock}
          value={`${displayData.totalTime}小时`}
          diff={diffData.timeDiff}
          bgClass="bg-card-primary-2-background"
          textColorClass="text-color-accent-bright"
          isLoading={isLoading}
        />

        <DataCard
          title="连续学习"
          icon={Zap}
          value={`${displayData.continuousDay}天`}
          diff={diffData.continuousDiff}
          bgClass="bg-card-primary-3-background"
          textColorClass="text-color-warning-bright"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
