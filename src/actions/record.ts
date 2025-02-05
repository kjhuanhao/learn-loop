"use server"
import { dailyLearningRecord } from "@/database/schema"
import { db } from "@/utils/db"
import { createAction } from "."
import { eq, and, sql } from "drizzle-orm"

interface CreateDailyLearningRecord {
  questionCount: number
  correctCount: number
  reviewCount: number
  learningTime: string
  continuousDay: number
  dailyProgress: number
}

/**
 * 获取今日学习记录
 */
export const getTodayLearningRecord = async () => {
  return createAction({
    actionFunc: async (user) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const record = await db
        .select()
        .from(dailyLearningRecord)
        .where(
          and(
            eq(dailyLearningRecord.userId, user.id),
            sql`DATE(created_at) = CURRENT_DATE`
          )
        )
        .limit(1)

      return record[0] || null
    },
  })
}

/**
 * 创建或更新今日学习记录
 */
export const upsertTodayLearningRecordWithTime = async (
  learningTime: string,
  continuousDay?: string
) => {
  return createAction({
    actionFunc: async (user) => {
      const existingRecord = await db
        .select()
        .from(dailyLearningRecord)
        .where(
          and(
            eq(dailyLearningRecord.userId, user.id),
            sql`DATE(created_at) = CURRENT_DATE`
          )
        )
        .limit(1)

      if (existingRecord[0]) {
        // 更新记录
        return db
          .update(dailyLearningRecord)
          .set({
            learningTime,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(dailyLearningRecord.id, existingRecord[0].id))
      } else {
        // 创建新记录
        return db.insert(dailyLearningRecord).values({
          userId: user.id,
          learningTime,
          questionCount: 0,
          reviewCount: 0,
        })
      }
    },
  })
}

interface UpdateTodayLearningRecord {
  isIncreaseQuestionCount: boolean
  isIncreaseReviewCount: boolean
}
/**
 * 增加学习题目数量
 */
export const updateTodayLearningRecord = async (
  props: UpdateTodayLearningRecord
) => {
  return createAction({
    actionFunc: async (user) => {
      const existingRecord = await db
        .select()
        .from(dailyLearningRecord)
        .where(
          and(
            eq(dailyLearningRecord.userId, user.id),
            sql`DATE(created_at) = CURRENT_DATE`
          )
        )
        .limit(1)

      if (existingRecord[0]) {
        // 更新记录
        return db
          .update(dailyLearningRecord)
          .set({
            questionCount: props.isIncreaseQuestionCount
              ? sql`${dailyLearningRecord.questionCount} + 1`
              : dailyLearningRecord.questionCount,
            reviewCount: props.isIncreaseReviewCount
              ? sql`${dailyLearningRecord.reviewCount} + 1`
              : dailyLearningRecord.reviewCount,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(dailyLearningRecord.id, existingRecord[0].id))
      } else {
        // 创建新记录
        return db.insert(dailyLearningRecord).values({
          userId: user.id,
          questionCount: 0,
          reviewCount: 0,
          learningTime: "0.0",
        })
      }
    },
  })
}
