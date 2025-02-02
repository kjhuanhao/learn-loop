"use client"
import { useChat } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { useSize } from "ahooks"
import { useRef } from "react"
import { BotIcon } from "lucide-react"

interface ChatComponentProps {
  question?: string
  prompt?: string
}
export const ChatComponent = () => {
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
  } = useChat()

  return (
    <>
      {isShowIndicator && (
        <div className="w-full text-primary-1 px-2 font-semibold text-xl border rounded-lg  h-[calc(100vh-5rem)] bg-white flex flex-col gap-2 justify-center items-center">
          <BotIcon className="w-10 h-10" />
          <span>AI</span>
        </div>
      )}
      <Chat
        ref={ref}
        className="h-[calc(100vh-5rem)] border bg-white rounded-lg p-3"
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
    </>
  )
}
