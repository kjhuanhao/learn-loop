import { questionFolder } from "@/database/schema"

export type Folder = typeof questionFolder.$inferSelect & {
  questionCount: number
}
