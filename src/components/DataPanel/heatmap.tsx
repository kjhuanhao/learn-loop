"use client"

import React, { useMemo } from "react"
import { format, eachDayOfInterval, subDays } from "date-fns"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Contribution {
  date: Date
  count: number
}

interface ContributionDay {
  date: Date
  count: number
  tooltipText: string
}

interface HeatmapProps {
  /**
   * 开始日期到结束日期的贡献数据
   */
  data?: Contribution[]
  /**
   * 热力图标题
   * @default "学习记录"
   */
  title?: string
  /**
   * 提示文本
   * @default "记录每日学习题目数量"
   */
  tooltipText?: string
  /**
   * 自定义日期格式化函数
   * @default (date: Date) => format(date, 'yyyy-MM-dd')
   */
  dateFormatter?: (date: Date) => string
  /**
   * 自定义工具提示文本格式化函数
   * @default (count: number) => `${count} 题`
   */
  tooltipFormatter?: (count: number) => string
  /**
   * 热力图容器类名
   */
  className?: string
}

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  title = "学习记录",
  tooltipText = "记录每日学习题目数量",
  dateFormatter = (date: Date) => format(date, "yyyy-MM-dd"),
  tooltipFormatter = (count: number) => `${count} 题`,
  className = "",
}) => {
  // 生成过去一年的日期数据
  const contributionData = useMemo(() => {
    const today = new Date()
    const oneYearAgo = subDays(today, 365)

    const dates = eachDayOfInterval({
      start: oneYearAgo,
      end: today,
    })

    // 如果没有提供数据，生成随机数据
    if (!data) {
      return dates.map((date) => ({
        date,
        count: Math.floor(Math.random() * 10),
        tooltipText: dateFormatter(date),
      }))
    }

    // 将提供的数据转换为 Map 以便快速查找
    const contributionMap = new Map(
      data.map((item) => [dateFormatter(item.date), item.count])
    )

    return dates.map((date) => ({
      date,
      count: contributionMap.get(dateFormatter(date)) || 0,
      tooltipText: dateFormatter(date),
    }))
  }, [data, dateFormatter])

  // 获取贡献度对应的样式类名
  const getContributionClassName = (count: number): string => {
    if (count === 0) return "bg-muted"
    if (count <= 2) return "bg-primary/20"
    if (count <= 4) return "bg-primary/40"
    if (count <= 6) return "bg-primary/70"
    return "bg-primary"
  }

  // 计算周数
  const totalWeeks = Math.ceil(contributionData.length / 7)

  return (
    <div
      className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-card-foreground">{title}</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-muted-foreground">Less</span>
          <div className="flex items-center space-x-1 mx-2">
            <div className="w-3 h-3 rounded-sm bg-muted"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
            <div className="w-3 h-3 rounded-sm bg-primary"></div>
          </div>
          <span className="text-muted-foreground">More</span>
        </div>
      </div>

      {/* 可滚动容器 */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid grid-flow-col gap-1"
          style={{
            width: "max-content",
            minWidth: "100%",
            gridTemplateColumns: `repeat(${totalWeeks}, minmax(auto, 1fr))`,
          }}
        >
          {/* 周数据 */}
          {Array.from({ length: totalWeeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dataIndex = weekIndex * 7 + dayIndex
                const dayData = contributionData[dataIndex]

                if (!dayData)
                  return (
                    <div
                      key={`empty-${weekIndex}-${dayIndex}`}
                      className="w-3 h-3 rounded-sm bg-muted"
                    />
                  )

                return (
                  <Tooltip key={`day-${weekIndex}-${dayIndex}`}>
                    <TooltipTrigger>
                      <div
                        className={`w-3 h-3 rounded-sm ${getContributionClassName(dayData.count)}`}
                        role="gridcell"
                        aria-label={`${dayData.tooltipText}: ${tooltipFormatter(dayData.count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <div>{dayData.tooltipText}</div>
                        <div>{tooltipFormatter(dayData.count)}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
