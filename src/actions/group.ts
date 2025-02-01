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
        })
        .from(questionGroup)
        .where(eq(questionGroup.userId, user.id))
        .leftJoin(
          questionToGroup,
          eq(questionGroup.id, questionToGroup.groupId)
        )
        .groupBy(
          questionGroup.id,
          questionGroup.name,
          questionGroup.createdAt,
          questionGroup.updatedAt,
          questionGroup.userId
        )
        .orderBy(desc(questionGroup.createdAt))

      return groups.map((group) => ({
        id: group.question_group.id,
        name: group.question_group.name,
        createdAt: group.question_group.createdAt,
        updatedAt: group.question_group.updatedAt,
        userId: group.question_group.userId,
        questionCount: group.questionCount,
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
