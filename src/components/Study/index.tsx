"use client"
import {
  getAllQuestionListByGroupIdAction,
  updateQuestionAction,
  type QuestionWithQuestionToGroup,
} from "@/actions/question"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Details } from "./components/details"
import { QuestionList } from "./components/question-list"
import { useEffect, useMemo, useRef, useState } from "react"
import { useQuestionStore } from "@/stores/questionSlice"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChatComponent, getChatContext, getRatingContext } from "../Chat"
import {
  QuestionTypeEnum,
  QuestionMasteryLevelEnum,
} from "@/enum/question.enum"
import { useTimerStore } from "@/stores/timeSlice"
import { useToast } from "@/hooks/use-toast"
import { updateTodayLearningRecord } from "@/actions/record"
import { AnswerFeedback } from "./components/answer-feedback"
import { AnimatePresence, motion } from "framer-motion"
import { computeReview } from "@/utils/computeReview"
import { updateQuestionToGroupAction } from "@/actions/group"

// const Dialog

// TODO: 需要处理 Question 获取异常的情况
export const Study = () => {
  const { slug } = useParams()
  const { setQuestions, getUserAnswer, updateQuestion, getUserStringAnswer } =
    useQuestionStore()
  // const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)
  const { questions, activeQuestionIndex, setActiveQuestionIndex } =
    useQuestionStore()
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithQuestionToGroup | null>(null)
  const ref = useRef<{ handleSubmitChat: (prompt: string) => void }>(null)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const { toast } = useToast()

  const isCurrentQuestionCompleted = useMemo(() => {
    if (!currentQuestion) return false
    const now = new Date()
    const nextReviewAt = new Date(currentQuestion.nextReviewAt)
    setIsFeedbackOpen(nextReviewAt > now)
    return nextReviewAt > now
  }, [currentQuestion?.nextReviewAt])

  // 获取所有的题目
  const { isPending } = useQuery({
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

  // 提交答案后进行检查
  const { mutate: submitAnswer, isPending: isUpdatingRecord } = useMutation({
    mutationFn: async () => {
      if (!currentQuestion) return
      const correctAnswer = currentQuestion.content?.correct
      if (!correctAnswer) return
      const userAnswer = getUserAnswer(currentQuestion.id)

      if (!userAnswer) {
        toast({
          title: "请回答问题后提交",
          variant: "warning",
        })
        return
      }

      let answerIsCorrect = false

      if (
        currentQuestion.type === QuestionTypeEnum.SINGLE ||
        currentQuestion.type === QuestionTypeEnum.MULTIPLE
      ) {
        answerIsCorrect = (correctAnswer as string[]).every((item) =>
          (userAnswer as string[]).includes(item)
        )
        setIsCorrect(answerIsCorrect)
      } else {
        const context = getRatingContext(
          currentQuestion as QuestionWithQuestionToGroup,
          userAnswer as string
        )
        ref.current?.handleSubmitChat(context)
      }

      // 对学习记录进行更新
      if (currentQuestion.reviewCount === 0) {
        if (answerIsCorrect) {
          await updateTodayLearningRecord({
            isIncreaseQuestionCount: true,
            isIncreaseReviewCount: false,
          })
        } else {
          await updateTodayLearningRecord({
            isIncreaseQuestionCount: true,
            isIncreaseReviewCount: false,
          })
        }

        setIsFeedbackOpen(true)
      }
    },
    onSuccess: () => {},
  })

  // 处理熟练度变化
  const { mutateAsync: handleMasteryChange, isPending: isUpdatingMastery } =
    useMutation({
      mutationFn: async (
        mastery: (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]
      ) => {
        if (!currentQuestion) {
          toast({
            title: "题目处理异常",
            variant: "destructive",
          })
          return false
        }

        const { nextReviewDate, isCompleted } = computeReview(
          currentQuestion,
          mastery
        )
        const userAnswer = getUserStringAnswer(currentQuestion.id)
        const answer = userAnswer || undefined
        const storeAnswer = userAnswer ?? null

        try {
          // 对题目的状态进行更新
          await updateQuestionAction({
            id: currentQuestion.id,
            masteryLevel: mastery,
            reviewCount: currentQuestion.reviewCount + 1,
            nextReviewAt: nextReviewDate,
            lastAnswer: answer,
          })

          // 对题组状态进行更新
          if (isCompleted) {
            await updateQuestionToGroupAction(
              currentQuestion.questionToGroup.groupId,
              currentQuestion.id,
              isCompleted
            )
          }
          updateQuestion({
            ...currentQuestion,
            masteryLevel: mastery,
            reviewCount: currentQuestion.reviewCount + 1,
            nextReviewAt: nextReviewDate,
            lastAnswer: storeAnswer,
          })

          return true
        } catch (error) {
          toast({
            title: "题目状态更新失败",
            variant: "destructive",
          })
          return false
        }
      },
    })

  useEffect(() => {
    setCurrentQuestion(questions[activeQuestionIndex])
  }, [activeQuestionIndex, questions])

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)
    } else {
      setActiveQuestionIndex(activeQuestionIndex - 1)
    }
    setIsFeedbackOpen(false)
  }

  return (
    <div className="flex p-2 items-center gap-3 bg-gray-100 dark:bg-gray-800">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={45} minSize={35}>
          <Details
            question={currentQuestion}
            isLoading={isPending}
            submitAnswer={submitAnswer}
            isSubmitting={isUpdatingRecord}
            isFeedbackOpen={isFeedbackOpen}
            isCurrentQuestionCompleted={isCurrentQuestionCompleted}
          />
        </ResizablePanel>
        <ResizableHandle />
        <AnimatePresence mode="wait">
          {isFeedbackOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "30%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <ResizablePanel defaultSize={100}>
                <AnswerFeedback
                  isOpen={isFeedbackOpen}
                  question={currentQuestion}
                  userAnswer={
                    currentQuestion
                      ? (getUserAnswer(currentQuestion.id) ?? null)
                      : null
                  }
                  isCorrect={isCorrect}
                  onNext={handleNextQuestion}
                  onMasteryChange={handleMasteryChange}
                  isCompleted={isCurrentQuestionCompleted}
                  isUpdatingMastery={isUpdatingMastery}
                />
              </ResizablePanel>
              <ResizableHandle />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          animate={{
            width: isFeedbackOpen ? "25%" : "45%",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          <ResizablePanel defaultSize={100} minSize={20}>
            <ChatComponent
              ref={ref}
              getContext={() =>
                getChatContext(currentQuestion as QuestionWithQuestionToGroup)
              }
              isCanChat={!isPending}
            />
          </ResizablePanel>
        </motion.div>
      </ResizablePanelGroup>

      <QuestionList
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        isLoading={isPending}
      />
    </div>
  )
}
