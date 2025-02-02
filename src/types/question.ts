import {
  QuestionMasteryLevelEnum,
  QuestionTypeEnum,
  type QuestionGroupStatusEnum,
} from "@/enum/question.enum"

import { question } from "@/database/schema"

export type Option = {
  value: string
  label: string
}

export type QuestionType =
  (typeof QuestionTypeEnum)[keyof typeof QuestionTypeEnum]

export type QuestionMasteryLevel =
  (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]

export type QuestionGroupStatus =
  (typeof QuestionGroupStatusEnum)[keyof typeof QuestionGroupStatusEnum]

export type Question = typeof question.$inferSelect & {}

export type QuestionContent = {
  options: Option[] // 选项
  correct: string[] | string // 正确答案
}

export interface EditRef {
  getContent: () => QuestionContent
  setContent?: (content: QuestionContent) => void
}
