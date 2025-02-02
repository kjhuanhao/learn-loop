"use client"

import { createNewQuestionAction } from "@/actions/question"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  QuestionMasteryLevelEnum,
  QuestionTypeEnum,
} from "@/enum/question.enum"
import { useQuestionUpdate } from "@/hooks/use-question-update"
import { useToast } from "@/hooks/use-toast"
import { useSettingsStore } from "@/stores/settingsSlice"
import type { Folder } from "@/types/folder"
import type { EditRef, QuestionContent } from "@/types/question"
import { useMutation } from "@tanstack/react-query"
import { AlignLeft, CheckSquare, CircleDot, PlusIcon } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { QuestionForm } from "../question-form"
import { useQueryClient } from "@tanstack/react-query"

interface CreateNewQuestionProps {
  targetFolderId: string | undefined
  folders: Folder[]
  onSuccess?: () => void
  setSelectedFolderId: (id: string) => void
}

export const CreateNewQuestion = ({
  targetFolderId,
  folders,
  onSuccess,
  setSelectedFolderId,
}: CreateNewQuestionProps) => {
  const {
    selectedType,
    title,
    open,
    isAnswer,
    textContent,
    textAnswer,
    editorContentRef,
    editorAnswerRef,
    setSelectedType,
    setTitle,
    setOpen,
    resetForm,
    handleEditorSwitch,
  } = useQuestionUpdate()
  const { toast } = useToast()
  const singleEditRef = useRef<EditRef>(null)
  const multipleEditRef = useRef<EditRef>(null)
  const queryClient = useQueryClient()
  console.log(targetFolderId, "targetFolderId")

  const { mutate: createNewQuestion, isPending: isCreating } = useMutation({
    mutationFn: createNewQuestionAction,
    onSuccess: (data) => {
      if (data.success && data.data) {
        toast({
          title: "创建成功",
          description: "题目已成功创建",
        })
        resetForm()
        setOpen(false)
        onSuccess?.()
        queryClient.invalidateQueries({ queryKey: ["folderList"] })
      }
    },
    onError: (error) => {
      toast({
        title: "创建失败，请重试",
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

  const handleCreateQuestion = () => {
    const baseOptions = {
      title,
      masteryLevel: QuestionMasteryLevelEnum.BEGINNER,
      reviewCount: 0,
      nextReviewAt: new Date(),
    }
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
      createNewQuestion({
        ...baseOptions,
        content,
        folderId: targetFolderId,
        type: QuestionTypeEnum.SINGLE,
      })
    }
    if (selectedType === "MULTIPLE") {
      const content = multipleEditRef.current?.getContent()
      if (!content || !validateContent(content)) {
        return
      }
      createNewQuestion({
        ...baseOptions,
        content,
        folderId: targetFolderId,
        type: QuestionTypeEnum.MULTIPLE,
      })
      console.log(targetFolderId, "target")
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
      if (!textContent) {
        toast({
          title: "编辑器异常,请反馈 bug",
          variant: "destructive",
        })
        return
      }
      createNewQuestion({
        ...baseOptions,
        content: {
          options: [],
          correct: answer,
        },
        folderId: targetFolderId,
        description: description,
        type: QuestionTypeEnum.TEXT,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              <PlusIcon className="w-4 h-4 mr-2" />
              添加题目
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>题目类型</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedType("SINGLE")
                setOpen(true)
              }}
            >
              <CircleDot className="mr-2 h-4 w-4" />
              单选题
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedType("MULTIPLE")
                setOpen(true)
              }}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              多选题
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedType("TEXT")
                setOpen(true)
              }}
            >
              <AlignLeft className="mr-2 h-4 w-4" />
              简答题
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-[800px] w-[95vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="space-y-3">
            <DialogTitle>创建/导入新题目</DialogTitle>
            <DialogDescription>
              你可以创建新的题目，或者从其他地方导入题目
            </DialogDescription>
          </div>
        </DialogHeader>

        <QuestionForm
          title={title}
          folders={folders}
          selectedFolderId={targetFolderId || ""}
          setSelectedFolderId={setSelectedFolderId}
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
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>

          <Button
            className="ml-auto"
            disabled={isCreating}
            isLoading={isCreating}
            onClick={handleCreateQuestion}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
