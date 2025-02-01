"use client"

import type { QuestionEditorRef } from "@/components/QuestionEditor"
import { QuestionTypeEnum } from "@/enum/question.enum"
import { useRef, useState } from "react"

type QuestionType = keyof typeof QuestionTypeEnum

export const useQuestion = () => {
  const [selectedType, setSelectedType] = useState<QuestionType>("SINGLE")
  const [title, setTitle] = useState("")
  const [open, setOpen] = useState(false)
  const [isAnswer, setIsAnswer] = useState(false)

  const [textContent, setTextContent] = useState("")
  const [textAnswer, setTextAnswer] = useState("")
  const editorContentRef = useRef<QuestionEditorRef>(null)
  const editorAnswerRef = useRef<QuestionEditorRef>(null)

  const handleEditorSwitch = (value: boolean) => {
    // 如果新的状态和当前状态相同，不需要切换
    if (value === isAnswer) return

    try {
      // 保存当前编辑器的内容
      if (!value) {
        // 切换到内容编辑器
        if (editorAnswerRef.current) {
          const currentAnswer = editorAnswerRef.current.getHTML()
          if (currentAnswer) {
            setTextAnswer(currentAnswer)
          }
        }
      } else {
        // 切换到答案编辑器
        if (editorContentRef.current) {
          const currentContent = editorContentRef.current.getHTML()
          if (currentContent) {
            setTextContent(currentContent)
          }
        }
      }

      // 先更新状态
      setIsAnswer(value)
    } catch (error) {
      console.error("Error switching editor:", error)
    }
  }

  const resetForm = () => {
    setTitle("")
    setTextContent("")
    setTextAnswer("")
    setIsAnswer(false)
    setSelectedType("SINGLE")
  }

  return {
    // 状态
    selectedType,
    title,
    open,
    isAnswer,

    textContent,
    textAnswer,

    // refs
    editorContentRef,
    editorAnswerRef,

    // 方法
    setSelectedType,
    setTitle,
    setOpen,
    setTextContent,
    setTextAnswer,
    handleEditorSwitch,

    // 工具方法
    resetForm,
  }
}
