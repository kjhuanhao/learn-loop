"use client"
import { useEffect, useState } from "react"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuestionStore } from "@/stores/questionSlice"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

type DetailsProps = {
  question: QuestionWithQuestionToGroup | null
  activeQuestionIndex: number
  setActiveQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
  submitAnswer: () => void
  isSubmitting: boolean
}

type QuestionProps = {
  question: QuestionWithQuestionToGroup
}

const QuestionOption = ({
  option,
  onClick,
  children,
}: {
  option: { value: string; label: string }
  onClick: () => void
  children: React.ReactNode
}) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-3 rounded-lg p-4 border hover:bg-muted/50 transition-colors cursor-pointer"
  >
    {children}
    <Label className="flex-1 cursor-pointer leading-normal">
      {`${option.value}. ${option.label}`}
    </Label>
  </div>
)

const SingleQuestion = ({ question }: QuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const { setUserAnswer, getUserAnswer } = useQuestionStore()

  useEffect(() => {
    const answer = getUserAnswer(question.id)
    if (answer) setSelectedAnswer(answer[0] as string)
  }, [question.id, getUserAnswer])

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
    setUserAnswer({ id: question.id, answer: [value] })
  }
  useEffect(() => {
    console.log("render")
  }, [])

  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={handleAnswerSelect}
      className="space-y-4"
    >
      {question.content?.options.map((option) => (
        <QuestionOption
          key={option.value}
          option={option}
          onClick={() => handleAnswerSelect(option.value)}
        >
          <RadioGroupItem
            value={option.value}
            id={`${question.id}-${option.value}`}
            className="mt-0.5"
          />
        </QuestionOption>
      ))}
    </RadioGroup>
  )
}

const MultipleQuestion = ({ question }: QuestionProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const { setUserAnswer, getUserAnswer } = useQuestionStore()

  useEffect(() => {
    const answer = getUserAnswer(question.id)
    if (answer) setSelectedAnswers(answer as string[])
  }, [question.id, getUserAnswer])

  const handleAnswerToggle = (value: string) => {
    const newAnswers = selectedAnswers.includes(value)
      ? selectedAnswers.filter((item) => item !== value)
      : [...selectedAnswers, value]

    setSelectedAnswers(newAnswers)
    setUserAnswer({ id: question.id, answer: newAnswers })
  }

  return (
    <div className="flex flex-col gap-3">
      {question.content?.options.map((option) => (
        <QuestionOption
          key={option.value}
          option={option}
          onClick={() => handleAnswerToggle(option.value)}
        >
          <Checkbox
            checked={selectedAnswers.includes(option.value)}
            value={option.value}
          />
        </QuestionOption>
      ))}
    </div>
  )
}

const TextQuestion = ({ question }: QuestionProps) => {
  const { setUserAnswer, getUserAnswer } = useQuestionStore()
  const [answer, setAnswer] = useState<string>("")

  useEffect(() => {
    const savedAnswer = getUserAnswer(question.id)
    if (savedAnswer) setAnswer(savedAnswer as string)
  }, [question.id, getUserAnswer])

  const handleAnswerChange = (value: string) => {
    setAnswer(value)
    setUserAnswer({ id: question.id, answer: value })
  }

  return (
    <Textarea
      value={answer}
      onChange={(e) => handleAnswerChange(e.target.value)}
      placeholder="请输入你的答案"
      style={{ resize: "none" }}
      className="h-[200px] w-full box-border"
    />
  )
}

const QuestionSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <div className="space-y-2 mt-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </div>
)
export const Details = ({
  question,
  activeQuestionIndex,
  setActiveQuestionIndex,
  isLoading,
  submitAnswer,
  isSubmitting,
}: DetailsProps) => {
  const [activeTab, setActiveTab] = useState("content")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { questions } = useQuestionStore()

  const handleTabChange = (value: string) => {
    if (value === "correct") {
      setIsDialogOpen(true)
      return
    }
    setActiveTab(value)
  }

  const handleShowAnswer = () => {
    setActiveTab("correct")
    setIsDialogOpen(false)
  }

  const handleNavigateQuestion = (direction: "prev" | "next") => {
    const isFirst = activeQuestionIndex === 0
    const isLast = activeQuestionIndex === questions.length - 1

    if (direction === "prev" && isFirst) {
      toast({ title: "已经是第一题了", variant: "warning" })
      return
    }

    if (direction === "next" && isLast) {
      toast({ title: "已经是最后一题了", variant: "warning" })
      return
    }

    setActiveQuestionIndex((prev) => prev + (direction === "next" ? 1 : -1))
  }

  const renderQuestionContent = () => {
    if (!question) return null

    return (
      <>
        <h2 className="text-2xl font-bold">{question.title}</h2>
        <div>{question.description}</div>
        <div className="py-5 gap-2 justify-between">
          {question.type === "single" && <SingleQuestion question={question} />}
          {question.type === "multiple" && (
            <MultipleQuestion question={question} />
          )}
          {/* {question.type === "text" && <TextQuestion question={question} />} */}
        </div>
      </>
    )
  }

  const renderCorrectAnswer = () => {
    if (!question?.content?.correct) return null
    return <div>{question.content.correct}</div>
  }

  return (
    <div className="border rounded-lg bg-white h-[calc(100vh-5rem)] flex flex-col">
      <Tabs
        className="flex flex-col h-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <div className="flex items-center p-2">
          <TabsList>
            <TabsTrigger value="content" disabled={isLoading}>
              题目描述
            </TabsTrigger>
            <TabsTrigger value="correct" disabled={isLoading}>
              答案
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            {activeTab === "content" && (
              <Button disabled={isLoading} onClick={submitAnswer}>
                提交
              </Button>
            )}
          </div>
        </div>

        {/* 题目内容 */}
        <TabsContent className="flex-1 h-[calc(100%-3rem)]" value="content">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-4">
              {isLoading ? <QuestionSkeleton /> : renderQuestionContent()}
            </div>

            <div className="p-4">
              {question?.type === "text" && (
                <div className="w-full mb-3">
                  <TextQuestion question={question} />
                </div>
              )}
              <div className="flex justify-end items-center gap-2 w-full">
                <Button
                  variant="outline"
                  disabled={isLoading || activeQuestionIndex === 0}
                  onClick={() => handleNavigateQuestion("prev")}
                >
                  上一题
                </Button>
                <Button
                  variant="outline"
                  disabled={
                    isLoading || activeQuestionIndex === questions.length - 1
                  }
                  onClick={() => handleNavigateQuestion("next")}
                >
                  下一题
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>你确定要查看答案吗？</AlertDialogTitle>
              <AlertDialogDescription>
                该行为暂时不会被记录在案
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>我再想想</AlertDialogCancel>
              <AlertDialogAction onClick={handleShowAnswer}>
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* 答案内容 */}
        <TabsContent className="flex-1 h-[calc(100%-3rem)]" value="correct">
          <div className="h-full overflow-y-auto p-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">正确答案：</h3>
                <div className="prose max-w-none">{renderCorrectAnswer()}</div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
