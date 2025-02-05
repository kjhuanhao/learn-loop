import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { MasterySubmit } from "./submit-mastery"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import {
  QuestionTypeEnum,
  QuestionMasteryLevelEnum,
} from "@/enum/question.enum"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface AnswerFeedbackProps {
  isOpen: boolean
  question: QuestionWithQuestionToGroup | null
  userAnswer: string[] | string | null
  isCorrect: boolean
  onNext: () => void
  isCompleted: boolean
  isUpdatingMastery: boolean
  onMasteryChange: (
    mastery: (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]
  ) => Promise<boolean>
}

export const AnswerFeedback = ({
  isOpen,
  question,
  userAnswer,
  isCorrect,
  onNext,
  onMasteryChange,
  isCompleted,
  isUpdatingMastery,
}: AnswerFeedbackProps) => {
  if (!question) return null

  const [mastery, setMastery] = useState<
    | (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]
    | null
  >(question.masteryLevel ?? null)
  const [isShowMasterySubmit, setIsShowMasterySubmit] = useState(!isCompleted)

  const handleMasteryChange = async (
    value: (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]
  ) => {
    setMastery(value)
    const result = await onMasteryChange(value)
    if (result) {
      setIsShowMasterySubmit(false)
    }
  }

  const formatAnswer = (answer: string[] | string | null) => {
    if (!answer) return "未作答"
    if (Array.isArray(answer)) {
      return answer.join(", ")
    }
    return answer
  }

  const renderAnswerSection = (
    title: string,
    answer: string[] | string | null,
    isUserAnswer = false,
    showStatus = false
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">{title}</span>
        {isUserAnswer &&
          showStatus &&
          (isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          ))}
      </div>
      <div
        className={`p-4 rounded-lg ${
          isUserAnswer && showStatus
            ? isCorrect
              ? "bg-green-50 dark:bg-green-950"
              : "bg-red-50 dark:bg-red-950"
            : "bg-gray-50 dark:bg-gray-900"
        }`}
      >
        {formatAnswer(answer)}
      </div>
    </div>
  )

  return (
    <div className="border rounded-lg bg-white h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">答题反馈</h3>
        {isOpen && (
          <div className="flex gap-2">
            <Button onClick={onNext} disabled={!isCompleted && !mastery}>
              下一题
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {isOpen ? (
          <div className="p-4 space-y-6">
            {!isCompleted && isShowMasterySubmit && (
              <div>
                <MasterySubmit
                  value={mastery}
                  onChange={handleMasteryChange}
                  isLoading={isUpdatingMastery}
                />
              </div>
            )}

            <div className="space-y-4">
              {renderAnswerSection(
                "你的答案",
                userAnswer,
                true,
                question.type !== QuestionTypeEnum.TEXT
              )}
              {renderAnswerSection(
                "正确答案",
                question.content?.correct ?? null,
                false,
                false
              )}
            </div>

            {question.type !== QuestionTypeEnum.TEXT && (
              <div className="space-y-4">
                <div className="font-medium">解析：</div>
                <div className="prose max-w-none dark:prose-invert">
                  暂无解析
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            提交答案后查看反馈
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
