"use server"
import { userLearningRecord } from "@/database/schema"
import { db } from "@/utils/db"
import { createAction } from "."

interface CreateUserLearningRecord {
  questionCount: number
  correctCount: number
  reviewCount: number
  learningTime: string
  continuousDay: number
  dailyProgress: number
}

export const createUserLearningRecord = async (
  props: CreateUserLearningRecord
) => {
  return createAction({
    actionFunc: async (user) => {
      const record = await db.insert(userLearningRecord).values({
        userId: user.id,
        ...props,
      })
      return record
    },
  })
}
