"use client"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import { Chat } from "@/components/ui/chat"
import { QuestionTypeEnum } from "@/enum/question.enum"
import { cn } from "@/lib/utils"
import { useSize } from "ahooks"
import { useChat } from "ai/react"
import { BotIcon } from "lucide-react"
import { forwardRef, useImperativeHandle, useRef } from "react"

interface ChatComponentProps {
  getContext?: () => string
  isCanChat?: boolean
}

export interface ChatComponentHandle {
  handleSubmitChat: (prompt: string) => void
}

export const getChatContext = (
  currentQuestion: QuestionWithQuestionToGroup
) => {
  if (!currentQuestion) return ""
  const baseContext = `你是一个擅长帮助用户解答各种问题的助手，你需要根据如下的信息完成用户的提问，但是切记不要直接给出答案，尽可能启发用户\n用户的问题是：${currentQuestion.title}\n `
  if (
    currentQuestion.type === QuestionTypeEnum.SINGLE ||
    currentQuestion.type === QuestionTypeEnum.MULTIPLE
  ) {
    return (
      baseContext +
      `该题的选项如下：${JSON.stringify(currentQuestion?.content?.options)}\n `
    )
  }
  return baseContext
}

export const getRatingContext = (
  currentQuestion: QuestionWithQuestionToGroup,
  userAnswer: string
) => {
  if (!currentQuestion) return ""
  const baseContext = `你是一个擅长针对题目进行评分的助手，你需要根据如下的题目和用户的答案，给出你的评分，并且给出你的评分理由，评分范围是0-100分，
  评分理由需要尽可能详细，评分理由需要尽可能详细，评分理由需要尽可能详细\n题目是：${currentQuestion.title}\n 题目的信息是:${currentQuestion.description} \n用户的答案是：${userAnswer}\n `
  return baseContext
}

export const ChatComponent = forwardRef<
  ChatComponentHandle,
  ChatComponentProps
>(({ getContext, isCanChat = true }, ref) => {
  const chatRef = useRef<HTMLDivElement>(null)
  const size = useSize(chatRef)
  const isShowIndicator = size?.width && size.width < 100

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
    setMessages,
  } = useChat({
    body: {
      context: getContext ? getContext() : "",
    },
  })
  const handleSubmitChat = async (prompt: string) => {
    await append({
      role: "user",
      content: prompt,
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      handleSubmitChat,
    }),
    [setMessages]
  )

  return (
    <>
      {isShowIndicator && (
        <div className="w-full text-primary-1 px-2 font-semibold text-xl border rounded-lg h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 flex flex-col gap-2 justify-center items-center">
          <BotIcon className="w-10 h-10" />
          <span>AI</span>
        </div>
      )}
      <div
        className={cn(
          "relative",
          !isCanChat &&
            "after:absolute after:inset-0 after:bg-white/60 dark:after:bg-slate-950/60 after:cursor-not-allowed"
        )}
      >
        <Chat
          ref={chatRef}
          className={cn(
            "h-[calc(100vh-5rem)] border bg-white dark:bg-slate-950 rounded-lg p-3",
            !isCanChat && "pointer-events-none opacity-70"
          )}
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          suggestions={[
            "给我这道题的思路",
            "给我这道题的解析",
            "对这道题举一反三",
          ]}
        />
      </div>
    </>
  )
})
