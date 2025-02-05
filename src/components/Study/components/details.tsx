"use client"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useQuestionStore } from "@/stores/questionSlice"
import { useEffect, useState } from "react"

export type DetailsProps = {
  question: QuestionWithQuestionToGroup | null
  activeQuestionIndex: number
  setActiveQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
  submitAnswer: () => void
  isSubmitting: boolean
  isFeedbackOpen: boolean
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
      className="h-[200px] w-full box-border !text-[16px]"
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
  isFeedbackOpen,
}: DetailsProps) => {
  const { questions } = useQuestionStore()

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
          {question.type === "text" && <TextQuestion question={question} />}
        </div>
      </>
    )
  }

  return (
    <div className="border rounded-lg bg-white h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">题目描述</h3>
        {!isFeedbackOpen && (
          <Button disabled={isLoading || isSubmitting} onClick={submitAnswer}>
            提交
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? <QuestionSkeleton /> : renderQuestionContent()}
      </div>

      {!isFeedbackOpen && (
        <div className="p-4 border-t">
          <div className="flex justify-end items-center gap-2">
            <Button
              variant="outline"
              disabled={isLoading || activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
            >
              上一题
            </Button>
            <Button
              variant="outline"
              disabled={
                isLoading || activeQuestionIndex === questions.length - 1
              }
              onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
            >
              下一题
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
