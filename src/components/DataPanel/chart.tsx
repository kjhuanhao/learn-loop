"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface ChartData {
  date: string
  questions: number
  time: number
}

interface ActionResponse<T> {
  data: T
}

const chartConfig = {
  questions: {
    label: "学习题目数",
    color: "hsl(var(--chart-1))",
  },
  time: {
    label: "学习时长(小时)",
    color: "hsl(var(--chart-2))",
  },
} as const

// 将分钟转换为小时，保留一位小数
const minutesToHours = (minutes: string) => {
  return parseFloat((parseFloat(minutes) / 60).toFixed(1))
}

export const Chart = () => {
  const [activeMetric, setActiveMetric] =
    React.useState<keyof typeof chartConfig>("questions")

  const { data: response, isLoading } = useRecords()

  const records = response?.data || []

  const learningData = React.useMemo(() => {
    if (!records.length) return []

    // 按日期降序排序
    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // 只取最近30天的数据
    const recentRecords = sortedRecords.slice(0, 30)

    return recentRecords.map((record) => ({
      date: new Date(record.createdAt).toISOString().split("T")[0],
      questions: record.questionCount + record.reviewCount,
      time: minutesToHours(record.learningTime),
    }))
  }, [records])

  const total = React.useMemo(
    () => ({
      questions: learningData.reduce((acc, curr) => acc + curr.questions, 0),
      time: learningData.reduce((acc, curr) => acc + curr.time, 0),
    }),
    [learningData]
  )

  if (isLoading) {
    return (
      <Card className="w-full rounded-2xl">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted/50 rounded animate-pulse" />
          </div>
          <div className="flex flex-wrap">
            <div className="h-24 w-40 bg-muted/50 rounded animate-pulse" />
            <div className="h-24 w-40 bg-muted/50 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[250px] w-full bg-muted/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full rounded-2xl">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-lg font-medium text-card-foreground">
            近30天学习趋势
          </CardTitle>
          <CardDescription>展示最近30天的学习数据统计</CardDescription>
        </div>
        <div className="flex flex-wrap">
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(
            (key) => (
              <button
                key={key}
                data-active={activeMetric === key}
                className="inline-flex flex-col justify-center gap-1 border-t px-6 py-4 text-left
                even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0
                hover:bg-muted/30 transition-colors"
                onClick={() => setActiveMetric(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={learningData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                style={{
                  fontSize: "0.75rem",
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("zh-CN", {
                    month: "numeric",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={35}
                domain={[0, "auto"]}
                style={{
                  fontSize: "0.75rem",
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickFormatter={(value) =>
                  activeMetric === "questions"
                    ? Math.round(value).toString()
                    : value.toFixed(1)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}
                formatter={(value: number, name: string) => {
                  const config = chartConfig[name as keyof typeof chartConfig]
                  const formattedValue =
                    name === "questions" ? Math.round(value) : value.toFixed(1)
                  return [formattedValue, config.label]
                }}
              />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={chartConfig[activeMetric].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
