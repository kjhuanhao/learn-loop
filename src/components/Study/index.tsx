"use client"
import {
  getAllQuestionListByGroupIdAction,
  type QuestionWithQuestionToGroup,
} from "@/actions/question"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Details } from "./components/details"
import { QuestionList } from "./components/question-list"
import { useEffect, useState } from "react"
import { useQuestionStore } from "@/stores/questionSlice"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChatComponent } from "../Chat"
import { QuestionTypeEnum } from "@/enum/question.enum"

export const Study = () => {
  const { slug } = useParams()
  const { setQuestions } = useQuestionStore()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)
  const { questions } = useQuestionStore()
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

  const getContext = () => {
    const question = questions[activeQuestionIndex]
    if (!question) return ""
    const baseContext = `你是一个擅长帮助用户解答各种问题的助手，你需要根据如下的信息完成用户的提问，但是切记不要直接给出答案，尽可能启发用户\n用户的问题是：${question.title}\n `
    if (
      question.type === QuestionTypeEnum.SINGLE ||
      question.type === QuestionTypeEnum.MULTIPLE
    ) {
      return (
        baseContext +
        `该题的选项如下：${JSON.stringify(question?.content?.options)}\n `
      )
    }
    return baseContext
  }

  return (
    <div className="flex p-2 items-center gap-3  bg-gray-100 dark:bg-gray-800">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60} className="h-full">
          <Details
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            isLoading={isPending}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40}>
          <ChatComponent getContext={getContext} />
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
