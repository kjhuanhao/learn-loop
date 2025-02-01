import { questionGroup } from "@/database/schema"

export type Group = typeof questionGroup.$inferSelect & {
  questionCount: number
}

export interface GroupListResponse {
  data: Group[]
  total: number
}
