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

// Mock 数据生成函数
const generateMockData = () => {
  const data = []
  const baseDate = new Date("2024-01-01") // 使用固定的基准日期

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + (29 - i))
    // 使用固定的随机种子
    const day = 29 - i
    data.push({
      date: date.toISOString().split("T")[0],
      questions: ((day * 17) % 15) + 5, // 5-20 之间
      reviews: ((day * 23) % 20) + 10, // 10-30 之间
      time: ((day * 31) % 90) + 30, // 30-120 之间
    })
  }
  return data
}

const chartConfig = {
  questions: {
    label: "学习&复习数",
    color: "hsl(var(--chart-1))",
  },
  reviews: {
    label: "学习时长(小时)",
    color: "hsl(var(--chart-2))",
  },
  time: {
    label: "摆烂情况",
    color: "hsl(var(--chart-3))",
  },
} as const

export const Chart = () => {
  const [activeMetric, setActiveMetric] =
    React.useState<keyof typeof chartConfig>("questions")
  const learningData = React.useMemo(() => generateMockData(), [])

  const total = React.useMemo(
    () => ({
      questions: learningData.reduce((acc, curr) => acc + curr.questions, 0),
      reviews: learningData.reduce((acc, curr) => acc + curr.reviews, 0),
      time: learningData.reduce((acc, curr) => acc + curr.time, 0),
    }),
    [learningData]
  )

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
                  return [value, config.label]
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
