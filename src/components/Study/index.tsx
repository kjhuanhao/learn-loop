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

export const Study = () => {
  const { slug } = useParams()
  const { setQuestions } = useQuestionStore()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)

  const { data, isPending } = useQuery({
    queryKey: ["questionList", slug],
    queryFn: () => getAllQuestionListByGroupIdAction(slug as string),
    enabled: !!slug,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data?.data) {
      setQuestions(data.data as QuestionWithQuestionToGroup[])
    }
  }, [data])

  return (
    <div className="flex p-2 items-center gap-5  bg-gray-100 dark:bg-gray-800">
      <Details
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        isLoading={isPending}
      />
      <QuestionList
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        isLoading={isPending}
      />
    </div>
  )
}
