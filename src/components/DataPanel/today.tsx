"use client"

import { Tooltip } from "@/components/ui/tooltip"
import { CalendarClock, CalendarIcon, Clock, Share2, Zap } from "lucide-react"
import { TooltipContent, TooltipTrigger } from "../ui/tooltip"

export const TodayDataPanel = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-card-foreground">
            今日学习概览
          </h3>
          <Tooltip>
            <TooltipTrigger>
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>分享</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-5 bg-card-primary-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span>今日学习&复习</span>
            <CalendarIcon className="w-5 h-5 ml-2 text-color-primary-bright shrink-0" />
          </div>
          <span className="text-2xl font-bold">24题</span>
          <span className="text-sm font-bold text-color-primary-bright">
            +12 比昨天
          </span>
        </div>

        <div className="flex flex-col gap-5 bg-card-primary-1-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span>今日总时长</span>
            <Clock className="w-5 h-5 ml-2 text-color-secondary-bright shrink-0" />
          </div>
          <span className="text-2xl font-bold">2.4小时</span>
          <span className="text-sm font-bold text-color-secondary-bright">
            +1.2 比昨天
          </span>
        </div>

        <div className="flex flex-col gap-5 bg-card-primary-2-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span>累计学习</span>
            <CalendarClock className="w-5 h-5 ml-2 text-color-accent-bright shrink-0" />
          </div>
          <span className="text-2xl font-bold">25小时</span>
          <span className="text-sm font-bold text-color-accent-bright">
            +1.2 比昨天
          </span>
        </div>

        <div className="flex flex-col gap-5 bg-card-primary-3-background rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span>连续学习</span>
            <Zap className="w-5 h-5 ml-2 text-color-warning-bright shrink-0" />
          </div>
          <span className="text-2xl font-bold">14天</span>
          <span className="text-sm font-bold text-color-warning-bright">
            +1 比昨天
          </span>
        </div>
      </div>
    </div>
  )
}
