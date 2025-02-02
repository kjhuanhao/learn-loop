"use client"
import {
  getAllQuestionListByGroupIdAction,
  type QuestionWithQuestionToGroup,
} from "@/actions/question"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Details } from "./components/details"
import { QuestionList } from "./components/question-list"
import { useEffect, useRef, useState } from "react"
import { useQuestionStore } from "@/stores/questionSlice"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChatComponent, getChatContext, getRatingContext } from "../Chat"
import { QuestionTypeEnum } from "@/enum/question.enum"
import { useTimerStore } from "@/stores/timeSlice"
import { useToast } from "@/hooks/use-toast"
import { createUserLearningRecord } from "@/actions/record"

// const Dialog

// TODO: 需要处理 Question 获取异常的情况
export const Study = () => {
  const { slug } = useParams()
  const { setQuestions, getUserAnswer } = useQuestionStore()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)
  const { questions } = useQuestionStore()
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithQuestionToGroup | null>(null)
  const { getMinutes } = useTimerStore()
  const ref = useRef<{ handleSubmitChat: (prompt: string) => void }>(null)
  const { toast } = useToast()
  // 获取所有的题目
  const { data, isPending } = useQuery({
    queryKey: ["questionList", slug],
    queryFn: async () => {
      const data = await getAllQuestionListByGroupIdAction(slug as string)
      setQuestions(data.data as QuestionWithQuestionToGroup[])
      return data
    },
    enabled: !!slug,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const { mutate: createRecord, isPending: isCreatingRecord } = useMutation({
    mutationFn: createUserLearningRecord,
    onSuccess: () => {},
  })

  useEffect(() => {
    setCurrentQuestion(questions[activeQuestionIndex])
  }, [activeQuestionIndex, questions])

  const submitAnswer = () => {
    if (!currentQuestion) return
    const correctAnswer = currentQuestion.content?.correct
    if (!correctAnswer) return
    const userAnswer = getUserAnswer(currentQuestion.id)

    let isCorrect = false
    if (!userAnswer) {
      toast({
        title: "请回答问题后提交",
        variant: "warning",
      })
      return
    }
    if (
      currentQuestion.type === QuestionTypeEnum.SINGLE ||
      currentQuestion.type === QuestionTypeEnum.MULTIPLE
    ) {
      isCorrect = (correctAnswer as string[]).every((item) =>
        (userAnswer as string[]).includes(item)
      )
    } else {
      const context = getRatingContext(
        currentQuestion as QuestionWithQuestionToGroup,
        userAnswer as string
      )
      console.log(context, "context")

      ref.current?.handleSubmitChat(context)
    }

    return isCorrect
  }

  return (
    <div className="flex p-2 items-center gap-3  bg-gray-100 dark:bg-gray-800">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60} className="h-full">
          <Details
            question={currentQuestion}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            isLoading={isPending}
            submitAnswer={submitAnswer}
            isSubmitting={isCreatingRecord}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40}>
          <ChatComponent
            ref={ref}
            getContext={() =>
              // TODO: 需要处理 currentQuestion 为 null 的情况
              getChatContext(currentQuestion as QuestionWithQuestionToGroup)
            }
            isCanChat={!isPending}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <QuestionList
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        isLoading={isPending}
      />
    </div>
  )
}
