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
  activeQuestionIndex: number
  setActiveQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
}

type QuestionProps = {
  question: QuestionWithQuestionToGroup
}

export const SingleQuestion = ({ question }: QuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const { setUserAnswer, getUserAnswer } = useQuestionStore()
  useEffect(() => {
    const answer = getUserAnswer(question.id)
    console.log(answer, "answer")

    if (answer) {
      setSelectedAnswer(answer[0] as string)
    }
  }, [question.id])
  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={(value) => {
        setSelectedAnswer(value)
        setUserAnswer({ id: question.id, answer: [value] })
      }}
      className="space-y-4"
    >
      {question.content?.options.map((option) => (
        <div
          key={option.value}
          onClick={() => {
            setSelectedAnswer(option.value)
            setUserAnswer({ id: question.id, answer: [option.value] })
          }}
          className="flex  items-center space-x-3 rounded-lg p-4 border hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <RadioGroupItem
            value={option.value}
            id={`${question.id}-${option.value}`}
            className="mt-0.5"
          />
          <Label
            htmlFor={`${question.id}-${option.value}`}
            className="flex-1 cursor-pointer leading-normal"
          >
            {`${option.value}. ${option.label}`}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

const MultipleQuestion = ({ question }: QuestionProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const { setUserAnswer, getUserAnswer } = useQuestionStore()
  useEffect(() => {
    const answer = getUserAnswer(question.id)
    if (answer) {
      setSelectedAnswers(answer as string[])
    }
  }, [question.id])
  return (
    <div>
      {question.content?.options.map((option, index) => (
        <div className="flex items-center space-x-3 rounded-lg p-4 border hover:bg-muted/50 transition-colors cursor-pointer">
          <Checkbox
            key={index}
            checked={selectedAnswers.includes(option.value)}
            value={option.value}
            onCheckedChange={(checked) => {
              setSelectedAnswers(checked ? [option.value] : [])
              setUserAnswer({
                id: question.id,
                answer: checked ? [option.value] : [],
              })
            }}
          />
          <Label>{`${option.value}. ${option.label}`}</Label>
        </div>
      ))}
    </div>
  )
}

const TextQuestion = ({ question }: QuestionProps) => {
  const { setUserAnswer, getUserAnswer } = useQuestionStore()
  const [answer, setAnswer] = useState<string>("")
  useEffect(() => {
    const answer = getUserAnswer(question.id)
    if (answer) {
      setAnswer(answer as string)
    }
  }, [question.id])
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value)
          setUserAnswer({ id: question.id, answer: e.target.value })
        }}
        className="h-full"
      ></Textarea>
    </div>
  )
}

export const Details = ({
  activeQuestionIndex,
  setActiveQuestionIndex,
  isLoading,
}: DetailsProps) => {
  const [activeTab, setActiveTab] = useState("content")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { questions } = useQuestionStore()
  const { toast } = useToast()
  const [question, setQuestion] = useState<QuestionWithQuestionToGroup>()
  const handleShowAnswer = () => {
    setActiveTab("correct")
    setIsDialogOpen(false)
  }

  useEffect(() => {
    const question = questions[activeQuestionIndex]
    setQuestion(question)
  }, [activeQuestionIndex, questions])

  return (
    <div className="border h-[calc(100vh-5rem)] rounded-lg bg-white">
      <Tabs
        className="px-2 pt-2"
        value={activeTab}
        onValueChange={(value) => {
          if (value === "correct") {
            setIsDialogOpen(true)
            return
          }
          setActiveTab(value)
        }}
      >
        <div className="flex items-center">
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
              <Button disabled={isLoading}>提交</Button>
            )}
          </div>
        </div>
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

        <TabsContent
          className="flex flex-col w-full h-[calc(100vh-10rem)]"
          value="content"
        >
          <ScrollArea className="flex-1">
            <div className="px-3">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : (
                <>
                  {question && (
                    <>
                      <h2 className="text-2xl font-bold">{question.title}</h2>
                      <div>{question.description}</div>
                      <div className="py-5 gap-2 justify-between">
                        {question.type === "single" && (
                          <SingleQuestion question={question} />
                        )}
                        {question.type === "multiple" && (
                          <MultipleQuestion question={question} />
                        )}
                        {question.type === "text" && (
                          <TextQuestion question={question} />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center mt-auto">
            <div className="flex justify-end items-center gap-2 ml-auto">
              <Button
                variant="outline"
                disabled={isLoading || activeQuestionIndex === 0}
                onClick={() => {
                  if (activeQuestionIndex === 0) {
                    toast({
                      title: "已经是第一题了",
                      variant: "warning",
                    })
                    return
                  }
                  setActiveQuestionIndex((prev: number) => prev - 1)
                }}
              >
                上一题
              </Button>
              <Button
                variant="outline"
                disabled={
                  isLoading || activeQuestionIndex === questions.length - 1
                }
                onClick={() => {
                  if (activeQuestionIndex === questions.length - 1) {
                    toast({
                      title: "已经是最后一题了",
                      variant: "warning",
                    })
                    return
                  }
                  setActiveQuestionIndex((prev: number) => prev + 1)
                }}
              >
                下一题
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="w-full px-3" value="correct">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              {question.type === "single" && (
                <div>{question.content?.correct}</div>
              )}
              {question.type === "multiple" && (
                <div>{question.content?.correct}</div>
              )}
              {question.type === "text" && (
                <div>{question.content?.correct}</div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
