"use server"

import { db } from "@/utils/db"
import { createAction } from "."
import { questionGroup, questionToGroup } from "@/database/schema"
import type { User } from "better-auth/types"
import { eq, and, desc, sql } from "drizzle-orm"

interface CreateNewGroupActionProps {
  name: string
  description?: string
  tag: string[]
}

export const createNewGroupAction = async (body: CreateNewGroupActionProps) => {
  return createAction(
    {
      actionFunc: async (user: User) => {
        const [insertedGroup] = await db
          .insert(questionGroup)
          .values({
            userId: user.id,
            name: body.name,
            description: body.description,
            tag: body.tag,
          })
          .returning()

        return insertedGroup
      },
    },
    body
  )
}

/**
 * 获取题组列表
 * @returns 题组列表
 */
export const getQuestionGroupListAction = async () => {
  return createAction({
    actionFunc: async (user: User) => {
      const groups = await db
        .select({
          question_group: questionGroup,
          questionCount: sql<number>`count(${questionToGroup.questionId})::int`,
          questions: sql<(typeof questionToGroup.$inferSelect)[]>`
            json_agg(
              CASE
                WHEN ${questionToGroup.questionId} IS NOT NULL
                THEN json_build_object(
                  'questionId', ${questionToGroup.questionId},
                  'groupId', ${questionToGroup.groupId},
                  'isCompleted', ${questionToGroup.isCompleted},
                  'createdAt', ${questionToGroup.createdAt}
                )
              END
            ) FILTER (WHERE ${questionToGroup.questionId} IS NOT NULL)
          `,
        })
        .from(questionGroup)
        .where(eq(questionGroup.userId, user.id))
        .leftJoin(
          questionToGroup,
          eq(questionGroup.id, questionToGroup.groupId)
        )
        .groupBy(questionGroup.id)
        .orderBy(desc(questionGroup.createdAt))

      return groups.map((group) => ({
        id: group.question_group.id,
        name: group.question_group.name,
        description: group.question_group.description,
        tag: group.question_group.tag,
        createdAt: group.question_group.createdAt,
        updatedAt: group.question_group.updatedAt,
        userId: group.question_group.userId,
        status: group.question_group.status,
        questionCount: group.questionCount,
        questionToGroup: group.questions || [],
      }))
    },
  })
}

/**
 * 获取题组中的题目
 * @param groupId 题组id
 * @returns 题目
 */
export const getQuestionByGroupIdAction = async (groupId: string) => {
  return createAction(
    {
      actionFunc: async (user: User) => {
        return db
          .select()
          .from(questionToGroup)
          .where(and(eq(questionToGroup.groupId, groupId)))
      },
    },
    { groupId }
  )
}

interface UpdateGroupActionProps {
  id: string
  name: string
  description?: string
  tag: string[]
}

export const updateGroupAction = async (body: UpdateGroupActionProps) => {
  return createAction(
    {
      actionFunc: async (user: User) => {
        const [updatedGroup] = await db
          .update(questionGroup)
          .set({
            name: body.name,
            description: body.description,
            tag: body.tag,
          })
          .where(
            and(
              eq(questionGroup.id, body.id),
              eq(questionGroup.userId, user.id)
            )
          )
          .returning()

        return updatedGroup
      },
    },
    body
  )
}

export const deleteGroupAction = async (groupId: string) => {
  return createAction(
    {
      actionFunc: async (user: User) => {
        return db.delete(questionGroup).where(eq(questionGroup.id, groupId))
      },
    },
    { groupId }
  )
}

export const updateQuestionToGroupAction = async (
  groupId: string,
  questionId: string,
  isCompleted: boolean
) => {
  return createAction({
    actionFunc: async (user: User) => {
      return db
        .update(questionToGroup)
        .set({ isCompleted })
        .where(
          and(
            eq(questionToGroup.groupId, groupId),
            eq(questionToGroup.questionId, questionId)
          )
        )
    },
  })
}
