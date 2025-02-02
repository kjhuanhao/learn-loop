"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuestionStore } from "@/stores/questionSlice"
import { List, X } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  QuestionCompletedStatus,
  QuestionTypeStatus,
} from "@/components/Status"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "motion/react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const QuestionItemSkeleton = () => {
  return (
    <Card className="shadow-none rounded-xl border mb-2">
      <CardHeader className="p-3">
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="px-3 py-2 flex items-center gap-2 justify-between">
        <Skeleton className="h-6 w-[80px]" />
        <Skeleton className="h-6 w-[80px]" />
      </CardContent>
    </Card>
  )
}
const QuestionItem = ({
  item,
  onClick,
  active,
}: {
  item: QuestionWithQuestionToGroup
  onClick: () => void
  active: boolean
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "shadow-none rounded-xl border transition-colors duration-200 hover:bg-muted mb-2 cursor-pointer",
        active && "bg-primary/10"
      )}
    >
      <CardHeader className="p-3 flex">
        <CardTitle className="text-base font-medium">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2 flex items-center gap-2 justify-between">
        <QuestionTypeStatus type={item.type} />
        <QuestionCompletedStatus completed={item.questionToGroup.isCompleted} />
      </CardContent>
    </Card>
  )
}

export const QuestionList = ({
  activeQuestionIndex,
  setActiveQuestionIndex,
  isLoading,
}: {
  activeQuestionIndex: number
  setActiveQuestionIndex: (index: number) => void
  isLoading: boolean
}) => {
  const { questions } = useQuestionStore()
  const [isOpen, setIsOpen] = useState(false)
  const totalQuestions = questions.length
  const reviewedQuestions = questions.filter(
    (item) => item.questionToGroup.isCompleted
  ).length

  const progress =
    totalQuestions > 0 ? (reviewedQuestions / totalQuestions) * 100 : 0

  const shouldShowScroll = isLoading || questions.length > 0
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="question-list"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative p-3 w-[400px] h-screen bg-white rounded-lg shadow-lg bg-secondary"
          >
            <h3 className="font-medium">题目列表</h3>
            <div className="flex items-center gap-2 mt-4">
              {isLoading ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <Progress value={progress} />
              )}
              <span className="text-sm text-muted-foreground shrink-0">
                {isLoading ? (
                  <Skeleton className="h-4 w-[50px]" />
                ) : (
                  `${reviewedQuestions} / ${totalQuestions}`
                )}
              </span>
            </div>
            {shouldShowScroll ? (
              <ScrollArea className="flex flex-col items-center gap-2 max-h-[380px] overflow-y-auto py-4">
                {isLoading
                  ? Array(5)
                      .fill(0)
                      .map((_, index) => <QuestionItemSkeleton key={index} />)
                  : questions.map((item, index) => (
                      <QuestionItem
                        key={item.id}
                        active={index === activeQuestionIndex}
                        item={item}
                        onClick={() => {
                          setActiveQuestionIndex(index)
                          setIsOpen(false)
                        }}
                      />
                    ))}
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[380px] text-muted-foreground">
                暂无题目
              </div>
            )}
            <motion.div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        ) : (
          <div
            className="px-3 py-2 cursor-pointer rounded-lg rounded-l-none hover:bg-gray-100 transition-colors duration-200 shadow border border-muted"
            onClick={() => setIsOpen(true)}
          >
            <List className="w-6 h-6 text-primary-1" />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
