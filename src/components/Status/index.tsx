import {
  QuestionMasteryLevelEnum,
  QuestionTypeEnum,
} from "@/enum/question.enum"
import { Badge } from "../ui/badge"
import type { QuestionMasteryLevel, QuestionType } from "@/types/question"

export const MasteryLevelStatus = ({
  level,
}: {
  level: QuestionMasteryLevel
}) => {
  const levelConfig = {
    [QuestionMasteryLevelEnum.BEGINNER]: {
      label: "初学",
      variant: "secondary",
    },
    [QuestionMasteryLevelEnum.INTERMEDIATE]: {
      label: "进阶",
      variant: "default",
    },
    [QuestionMasteryLevelEnum.PROFICIENCY]: {
      label: "熟练",
      variant: "outline",
    },
    [QuestionMasteryLevelEnum.EXPERTISE]: {
      label: "精通",
      variant: "destructive",
    },
  }
  const config = levelConfig[level]
  return (
    <Badge
      variant={
        config.variant as "default" | "secondary" | "outline" | "destructive"
      }
    >
      {config.label}
    </Badge>
  )
}

export const QuestionTypeStatus = ({ type }: { type: QuestionType }) => {
  const typeConfig = {
    [QuestionTypeEnum.SINGLE]: { label: "单选题", variant: "default" },
    [QuestionTypeEnum.MULTIPLE]: {
      label: "多选题",
      variant: "secondary",
    },
    [QuestionTypeEnum.TEXT]: { label: "简答题", variant: "outline" },
  }
  const config = typeConfig[type]
  return (
    <Badge variant={config.variant as "default" | "secondary" | "outline"}>
      {config.label}
    </Badge>
  )
}

export const QuestionCompletedStatus = ({
  completed,
}: {
  completed: boolean
}) => {
  return (
    <Badge
      variant={completed ? "default" : "outline"}
      className="text-xs font-medium"
    >
      {completed ? "今日已完成" : "今日未完成"}
    </Badge>
  )
}
