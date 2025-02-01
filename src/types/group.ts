import { questionGroup, questionToGroup } from "@/database/schema"

export type Group = typeof questionGroup.$inferSelect & {
  questionCount: number
  questionToGroup: (typeof questionToGroup.$inferSelect)[]
}

export interface GroupListResponse {
  data: Group[]
  total: number
}
