import { questionGroup, questionToGroup } from "@/database/schema"

export type QuestionToGroupWithNextReview =
  typeof questionToGroup.$inferSelect & {
    nextReviewAt: Date
  }

export type Group = typeof questionGroup.$inferSelect & {
  questionCount: number
  questionToGroup: QuestionToGroupWithNextReview[]
}

export interface GroupListResponse {
  data: Group[]
  total: number
}
