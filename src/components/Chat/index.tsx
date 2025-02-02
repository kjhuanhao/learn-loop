"use client"
import { useChat } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { useSize } from "ahooks"
import { useRef } from "react"
import { BotIcon } from "lucide-react"
import { cn } from "@/lib/utils" // 假设使用了 clsx 或类似的工具函数

interface ChatComponentProps {
  getContext?: () => string
  isCanChat?: boolean
}

export const ChatComponent = ({
  getContext,
  isCanChat = true,
}: ChatComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const isShowIndicator = size?.width && size.width < 100

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
  } = useChat({
    body: {
      context: getContext ? getContext() : "",
    },
  })

  const handleDisabledSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 可以添加提示，比如 "当前不可用" 等
  }

  return (
    <>
      {isShowIndicator && (
        <div className="w-full text-primary-1 px-2 font-semibold text-xl border rounded-lg h-[calc(100vh-5rem)] bg-white flex flex-col gap-2 justify-center items-center">
          <BotIcon className="w-10 h-10" />
          <span>AI</span>
        </div>
      )}
      <div
        className={cn(
          "relative",
          !isCanChat &&
            "after:absolute after:inset-0 after:bg-white/60 after:cursor-not-allowed"
        )}
      >
        <Chat
          ref={ref}
          className={cn(
            "h-[calc(100vh-5rem)] border bg-white rounded-lg p-3",
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
}
