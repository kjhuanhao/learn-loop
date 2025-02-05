"use server"
import { db } from "@/utils/db"
import { createAction } from "."
import {
  question,
  questionFolder,
  questionToGroup,
  questionGroup,
} from "@/database/schema"
import type { User } from "better-auth/types"
import type {
  QuestionContent,
  QuestionMasteryLevel,
  QuestionType,
} from "@/types/question"
import { and, eq, sql, desc, inArray, notInArray } from "drizzle-orm"
import type { InferSelectModel } from "drizzle-orm"

type Question = InferSelectModel<typeof question>

export interface QuestionGroup {
  id: string
  name: string
  description: string | null
  tag: string[]
  status: string
}

export interface QuestionWithGroups extends Question {
  groups: QuestionGroup[]
}

export interface GetQuestionListResponse {
  data: QuestionWithGroups[]
  total: number
}

export interface QuestionWithQuestionToGroup extends Question {
  questionToGroup: typeof questionToGroup.$inferSelect
}

export type GetAllQuestionListResponse = QuestionWithQuestionToGroup[]

interface CreateNewQuestionActionProps {
  title: string
  content: QuestionContent
  type: QuestionType
  description?: string
  masteryLevel: QuestionMasteryLevel
  reviewCount: number
  nextReviewAt: Date
  folderId: string | undefined
}

interface UpdateQuestionActionProps {
  id: string
  title?: string
  content?: QuestionContent
  type?: QuestionType
  targetFolderId?: string
  sourceGroup?: QuestionGroup[]
  targetGroups?: string[]
  description?: string
  masteryLevel?: QuestionMasteryLevel
  reviewCount?: number
  nextReviewAt?: Date
}

/**
 * 创建新的题目
 * @param body
 * @returns
 */
export const createNewQuestionAction = async (
  body: CreateNewQuestionActionProps
) => {
  const create = async (user: User) => {
    return await db.transaction(async (tx) => {
      let targetFolderId = body.folderId
      if (!targetFolderId) {
        if (body.folderId === "" || body.folderId === undefined) {
          const [insertedFolder] = await tx
            .insert(questionFolder)
            .values({
              userId: user.id,
              name: "未分类",
              isCanDelete: false,
            })
            .returning()
          targetFolderId = insertedFolder.id
        }
      }

      const [insertedQuestion] = await tx
        .insert(question)
        .values({
          userId: user.id,
          title: body.title,
          type: body.type,
          reviewCount: body.reviewCount,
          masteryLevel: body.masteryLevel,
          content: body.content,
          folderId: targetFolderId!,
          nextReviewAt: body.nextReviewAt,
          description: body.description,
        })
        .returning()

      return insertedQuestion
    })
  }

  return createAction(
    {
      actionFunc: create,
    },
    body
  )
}

/**
 * 获取未分类文件夹的id
 * @param user
 * @returns
 */
export const getUnClassifiedFolderIdAction = async () => {
  return createAction({
    actionFunc: async (user: User) => {
      const [folder] = await db
        .select()
        .from(questionFolder)
        .where(
          and(
            eq(questionFolder.userId, user.id),
            eq(questionFolder.name, "未分类")
          )
        )
        .limit(1)
      return folder?.id
    },
  })
}

/**
 * 获取题目列表
 * @returns { data: QuestionWithGroups[], total: number }
 */
export const getQuestionListActionByFolderId = async (
  folderId?: string,
  page = 1,
  pageSize = 10
) => {
  return createAction({
    actionFunc: async (user: User) => {
      const offset = (page - 1) * pageSize

      const whereCondition = and(
        eq(question.userId, user.id),
        folderId ? eq(question.folderId, folderId) : undefined
      )

      const [questions, [{ count }]] = await Promise.all([
        db
          .select({
            question: question,
            groups: sql<QuestionGroup[]>`
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', ${questionGroup.id},
                    'name', ${questionGroup.name},
                    'description', ${questionGroup.description},
                    'tag', ${questionGroup.tag},
                    'status', ${questionGroup.status}
                  )
                ) FILTER (WHERE ${questionGroup.id} IS NOT NULL),
                '[]'
              )
            `.as("groups"),
          })
          .from(question)
          .leftJoin(
            questionToGroup,
            eq(question.id, questionToGroup.questionId)
          )
          .leftJoin(
            questionGroup,
            eq(questionToGroup.groupId, questionGroup.id)
          )
          .where(whereCondition)
          .groupBy(question.id)
          .limit(pageSize)
          .offset(offset)
          .orderBy(desc(question.createdAt)),

        db
          .select({ count: sql<number>`count(DISTINCT ${question.id})` })
          .from(question)
          .where(whereCondition),
      ])

      const response: GetQuestionListResponse = {
        data: questions.map((q) => ({
          ...q.question,
          groups: q.groups,
        })),
        total: Number(count),
      }

      return response
    },
  })
}

/**
 * 获取所有题目
 * @param groupId 题组id
 * @returns { data: GetAllQuestionListResponse[]}
 */
export const getAllQuestionListByGroupIdAction = async (groupId: string) => {
  return createAction({
    actionFunc: async (user: User) => {
      const questions = await db
        .select({
          id: question.id,
          title: question.title,
          content: question.content,
          description: question.description,
          type: question.type,
          masteryLevel: question.masteryLevel,
          reviewCount: question.reviewCount,
          nextReviewAt: question.nextReviewAt,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
          questionToGroup: {
            isCompleted: questionToGroup.isCompleted,
            createdAt: questionToGroup.createdAt,
          },
        })
        .from(questionToGroup)
        .innerJoin(
          question,
          and(
            eq(questionToGroup.questionId, question.id),
            eq(question.userId, user.id)
          )
        )
        .where(eq(questionToGroup.groupId, groupId))

      return questions
    },
  })
}

/**
 * 获取题组中的题目
 * @param groupId 题组id
 * @returns 题目
 */
export const getQuestionListActionByGroupId = async (
  groupId?: string,
  page = 1,
  pageSize = 10
) => {
  return createAction({
    actionFunc: async (user: User) => {
      const offset = (page - 1) * pageSize

      const whereCondition = and(
        eq(question.userId, user.id),
        groupId ? eq(questionToGroup.groupId, groupId) : undefined
      )

      const [questions, [{ count }]] = await Promise.all([
        db
          .select({
            question: question,
            groups: sql<QuestionGroup[]>`
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', ${questionGroup.id},
                    'name', ${questionGroup.name},
                    'description', ${questionGroup.description},
                    'tag', ${questionGroup.tag},
                    'status', ${questionGroup.status}
                  )
                ) FILTER (WHERE ${questionGroup.id} IS NOT NULL),
                '[]'
              )
            `.as("groups"),
          })
          .from(question)
          .innerJoin(
            questionToGroup,
            eq(question.id, questionToGroup.questionId)
          )
          .innerJoin(
            questionGroup,
            eq(questionToGroup.groupId, questionGroup.id)
          )
          .where(whereCondition)
          .groupBy(question.id)
          .limit(pageSize)
          .offset(offset)
          .orderBy(desc(question.createdAt)),

        db
          .select({ count: sql<number>`count(DISTINCT ${question.id})` })
          .from(question)
          .innerJoin(
            questionToGroup,
            eq(question.id, questionToGroup.questionId)
          )
          .where(whereCondition),
      ])

      const response: GetQuestionListResponse = {
        data: questions.map((q) => ({
          ...q.question,
          groups: q.groups,
        })),
        total: Number(count),
      }
      console.log("response", response)

      return response
    },
  })
}

/**
 * 更新题目
 * @param body
 * @returns
 */
export const updateQuestionAction = async (body: UpdateQuestionActionProps) => {
  return createAction(
    {
      actionFunc: async (user: User) => {
        return await db.transaction(async (tx) => {
          // 1. 更新问题基本信息
          const updateFields = {
            ...Object.entries({
              title: body.title,
              type: body.type,
              content: body.content,
              description: body.description,
              folderId: body.targetFolderId,
              masteryLevel: body.masteryLevel,
              reviewCount: body.reviewCount,
              nextReviewAt: body.nextReviewAt,
            }).reduce(
              (acc, [key, value]) => {
                if (value !== undefined) {
                  acc[key] = value
                }
                return acc
              },
              {} as Record<string, any>
            ),
            updatedAt: new Date(),
          }

          const [updatedQuestion] = await tx
            .update(question)
            .set(updateFields)
            .where(and(eq(question.id, body.id), eq(question.userId, user.id)))
            .returning()

          // 2. 更新题组关系
          if (body.targetGroups?.length) {
            // 先删除所有现有关系
            await tx
              .delete(questionToGroup)
              .where(eq(questionToGroup.questionId, body.id))

            // 批量插入新关系
            await tx.insert(questionToGroup).values(
              body.targetGroups.map((groupId) => ({
                questionId: body.id,
                groupId: groupId,
                createdAt: new Date(),
              }))
            )
          }

          return updatedQuestion
        })
      },
    },
    body
  )
}

/**
 * 删除题目
 * @param ids
 * @returns
 */
export const deleteQuestionsAction = async (ids: string[]) => {
  return createAction({
    actionFunc: async (user: User) => {
      await db.delete(question).where(inArray(question.id, ids))
    },
  })
}
