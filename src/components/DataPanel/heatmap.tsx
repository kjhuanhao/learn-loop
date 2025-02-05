"use client"

import React, { useMemo } from "react"
import {
  format,
  eachDayOfInterval,
  subDays,
  startOfMonth,
  isSameMonth,
} from "date-fns"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRecords } from "@/hooks/use-records"

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
  title = "学习记录",
  tooltipText = "记录每日学习题目数量",
  dateFormatter = (date: Date) => format(date, "yyyy-MM-dd"),
  tooltipFormatter = (count: number) => `${count} 题`,
  className = "",
}) => {
  const { data: response, isLoading } = useRecords()

  // 生成月份标签数据
  const monthLabels = useMemo(() => {
    const today = new Date()
    const oneYearAgo = subDays(today, 365)
    const dates = eachDayOfInterval({ start: oneYearAgo, end: today })

    const months: { text: string; weekIndex: number }[] = []
    let currentMonth: Date | null = null

    dates.forEach((date, index) => {
      if (!currentMonth || !isSameMonth(currentMonth, date)) {
        currentMonth = date
        months.push({
          text: format(date, "M月"),
          weekIndex: Math.floor(index / 7),
        })
      }
    })

    return months
  }, [])

  // 生成过去一年的日期数据
  const contributionData = useMemo(() => {
    const today = new Date()
    const oneYearAgo = subDays(today, 365)

    const dates = eachDayOfInterval({
      start: oneYearAgo,
      end: today,
    })

    // 如果正在加载或没有数据，返回空数据
    if (isLoading || !response?.data) {
      console.log("Heatmap: Loading or no data")
      return dates.map((date) => ({
        date,
        count: 0,
        tooltipText: dateFormatter(date),
      }))
    }

    // 将记录数据转换为 Map，key 是日期，value 是当天的题目总数
    const contributionMap = new Map(
      response.data.map((record) => [
        dateFormatter(new Date(record.createdAt)),
        record.questionCount + record.reviewCount,
      ])
    )

    const result = dates.map((date) => ({
      date,
      count: contributionMap.get(dateFormatter(date)) || 0,
      tooltipText: dateFormatter(date),
    }))

    return result
  }, [response?.data, isLoading, dateFormatter])

  // 获取贡献度对应的样式类名
  const getContributionClassName = (count: number): string => {
    if (count === 0) return "bg-muted"
    if (count <= 5) return "bg-primary/20"
    if (count <= 10) return "bg-primary/40"
    if (count <= 15) return "bg-primary/70"
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
        <div className="relative">
          {/* 月份标签 */}
          <div
            className="grid grid-flow-col gap-1 mb-2 ml-6"
            style={{
              width: "max-content",
              minWidth: "100%",
              gridTemplateColumns: `repeat(${totalWeeks}, minmax(auto, 1fr))`,
            }}
          >
            {monthLabels.map((month, index) => (
              <div
                key={`month-${index}`}
                className="text-xs text-muted-foreground"
                style={{
                  gridColumnStart: month.weekIndex + 1,
                }}
              >
                {month.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* 星期标签 */}
            <div className="flex flex-col justify-between py-[2px] text-xs text-muted-foreground h-[116px]">
              <div>一</div>
              <div>二</div>
              <div>三</div>
              <div>四</div>
              <div>五</div>
              <div>六</div>
              <div>日</div>
            </div>

            {/* 热力图网格 */}
            <div
              className="grid grid-flow-col gap-1"
              style={{
                width: "max-content",
                minWidth: "calc(100% - 1.5rem)",
                gridTemplateColumns: `repeat(${totalWeeks}, minmax(auto, 1fr))`,
              }}
              role="grid"
              aria-label="学习记录热力图"
            >
              {/* 周数据 */}
              {Array.from({ length: totalWeeks }).map((_, weekIndex) => (
                <div
                  key={weekIndex}
                  className="grid grid-rows-7 gap-1"
                  role="row"
                >
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex
                    const dayData = contributionData[dataIndex]

                    if (!dayData)
                      return (
                        <div
                          key={`empty-${weekIndex}-${dayIndex}`}
                          className="w-3 h-3 rounded-sm bg-muted"
                          role="gridcell"
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
      </div>
    </div>
  )
}
