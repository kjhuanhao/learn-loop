"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRef, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useQuestionUpdate } from "@/hooks/use-question-update"
import { useMutation } from "@tanstack/react-query"
import type { QuestionContent } from "@/types/question"
import { QuestionTypeEnum } from "@/enum/question.enum"
import {
  updateQuestionAction,
  type QuestionWithGroups,
} from "@/actions/question"
import { QuestionForm } from "./question-form"
import type { Folder } from "@/types/folder"

interface EditQuestionProps {
  question: QuestionWithGroups
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  folders: Folder[]
}

export const EditQuestion = ({
  question,
  open,
  onOpenChange,
  onSuccess,
  folders,
}: EditQuestionProps) => {
  const {
    selectedType,
    title,
    isAnswer,
    textContent,
    textAnswer,
    editorContentRef,
    editorAnswerRef,
    setSelectedType,
    setTitle,
    setTextContent,
    setTextAnswer,
    resetForm,
    handleEditorSwitch,
  } = useQuestionUpdate()

  const { toast } = useToast()
  const singleEditRef = useRef<{
    getContent: () => QuestionContent
    setContent: (content: QuestionContent) => void
  }>(null)
  const multipleEditRef = useRef<{
    getContent: () => QuestionContent
    setContent: (content: QuestionContent) => void
  }>(null)
  const [selectedFolderId, setSelectedFolderId] = useState(question.folderId)

  // 初始化表单数据
  useEffect(() => {
    if (question) {
      setTitle(question.title)
      setSelectedType(question.type.toUpperCase() as any)

      // 预填充内容
      if (question.type === QuestionTypeEnum.TEXT) {
        setTextContent(question.description || "")
        if (question.content) {
          setTextAnswer(
            typeof question.content.correct === "string"
              ? question.content.correct
              : ""
          )
        }
      }
    }
  }, [question, setTitle, setSelectedType, setTextContent, setTextAnswer])

  // 单独处理选项的预填充
  useEffect(() => {
    if (question?.content && question.type !== QuestionTypeEnum.TEXT) {
      // 使用 setTimeout 确保组件已经渲染完成
      const timer = setTimeout(() => {
        const content = question.content as QuestionContent

        if (
          question.type === QuestionTypeEnum.SINGLE &&
          singleEditRef.current
        ) {
          singleEditRef.current.setContent(content)
        }
        if (
          question.type === QuestionTypeEnum.MULTIPLE &&
          multipleEditRef.current
        ) {
          multipleEditRef.current.setContent(content)
        }
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [question, selectedType])

  const { mutate: updateQuestion, isPending: isUpdating } = useMutation({
    mutationFn: updateQuestionAction,
    onSuccess: (data) => {
      toast({
        title: "更新成功",
        description: "题目已成功更新",
      })
      resetForm()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: "更新失败，请重试",
        description: error.message,
      })
    },
  })

  const validateContent = (content: QuestionContent) => {
    if (content.options.some((option) => !option.label)) {
      toast({
        title: "请确保每个选项都有内容",
        variant: "destructive",
      })
      return false
    }
    if (content.correct.length === 0) {
      toast({
        title: "请选择正确答案",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleUpdateQuestion = () => {
    const baseOptions = {
      title,
      id: question.id,
      targetFolderId: selectedFolderId,
      sourceGroup: question.groups,
    }
    console.log(selectedFolderId, "q")

    if (title === "") {
      toast({
        title: "请输入题目名称",
        variant: "destructive",
      })
      return
    }

    if (selectedType === "SINGLE") {
      const content = singleEditRef.current?.getContent()
      if (!content || !validateContent(content)) {
        return
      }
      updateQuestion({
        ...baseOptions,
        content,
        type: QuestionTypeEnum[selectedType],
      })
    }

    if (selectedType === "MULTIPLE") {
      const content = multipleEditRef.current?.getContent()
      if (!content || !validateContent(content)) {
        return
      }
      updateQuestion({
        ...baseOptions,
        content,
        type: QuestionTypeEnum[selectedType],
      })
    }

    if (selectedType === "TEXT") {
      const answer = editorAnswerRef?.current?.getMarkdown()
      const description = editorContentRef.current?.getMarkdown()
      if (!answer) {
        toast({
          title: "请填写答案",
          variant: "destructive",
        })
        handleEditorSwitch(true)
        return
      }
      if (!textContent || !description) {
        toast({
          title: "编辑器异常,请反馈 bug",
          variant: "destructive",
        })
        return
      }
      updateQuestion({
        ...baseOptions,
        content: {
          options: [],
          correct: answer,
        },
        description: description,
        type: QuestionTypeEnum[selectedType],
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[800px] w-[95vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="space-y-3">
            <DialogTitle>编辑题目</DialogTitle>
            <DialogDescription>
              你可以修改题目的内容、选项和答案
            </DialogDescription>
          </div>
        </DialogHeader>

        <QuestionForm
          title={title}
          folders={folders}
          selectedFolderId={selectedFolderId}
          selectedType={selectedType}
          isAnswer={isAnswer}
          textContent={textContent}
          textAnswer={textAnswer}
          editorContentRef={editorContentRef}
          editorAnswerRef={editorAnswerRef}
          singleEditRef={singleEditRef}
          multipleEditRef={multipleEditRef}
          onTitleChange={setTitle}
          handleEditorSwitch={handleEditorSwitch}
          setSelectedFolderId={setSelectedFolderId}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="ml-auto"
            disabled={isUpdating}
            isLoading={isUpdating}
            onClick={handleUpdateQuestion}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
