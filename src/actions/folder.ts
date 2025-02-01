"use server"

import { db } from "@/utils/db"
import { createAction } from "."
import { questionFolder, question } from "@/database/schema"
import type { User } from "better-auth/types"
import { and, eq, sql } from "drizzle-orm"

interface CreateNewFolderActionProps {
  name: string
}

/**
 * 创建新的问题分类
 * @param body
 * @returns
 */
export const createNewFolderAction = async (
  body: CreateNewFolderActionProps
) => {
  return createAction(
    {
      actionFunc: async (user: User) => {
        const [insertedFolder] = await db
          .insert(questionFolder)
          .values({
            userId: user.id,
            name: body.name,
          })
          .returning()

        return {
          ...insertedFolder,
          questionCount: 0,
        }
      },
    },
    body
  )
}

/**
 * 获取问题分类列表
 * @returns
 */
export const getFolderListAction = async () => {
  return createAction({
    actionFunc: async (user: User) => {
      const folderList = await db
        .select({
          id: questionFolder.id,
          name: questionFolder.name,
          isCanDelete: questionFolder.isCanDelete,
          userId: questionFolder.userId,
          questionCount: sql<number>`count(${question.id})::int`,
        })
        .from(questionFolder)
        .leftJoin(question, eq(questionFolder.id, question.folderId))
        .where(eq(questionFolder.userId, user.id))
        .groupBy(
          questionFolder.id,
          questionFolder.name,
          questionFolder.isCanDelete,
          questionFolder.userId
        )
      return folderList
    },
  })
}

/**
 * 删除问题分类
 * @param folderId
 * @returns
 */
export const deleteFolderAction = async (folderId: string) => {
  return createAction({
    actionFunc: async (user: User) => {
      await db
        .delete(questionFolder)
        .where(
          and(
            eq(questionFolder.id, folderId),
            eq(questionFolder.userId, user.id)
          )
        )
    },
  })
}

/**
 * 更新问题分类
 * @param folderId
 * @param name
 * @returns
 */
export const updateFolderAction = async (folderId: string, name: string) => {
  return createAction({
    actionFunc: async (user: User) => {
      const [updatedFolder] = await db
        .update(questionFolder)
        .set({ name })
        .where(
          and(
            eq(questionFolder.id, folderId),
            eq(questionFolder.userId, user.id)
          )
        )
        .returning()

      const [{ questionCount }] = await db
        .select({
          questionCount: sql<number>`count(${question.id})::int`,
        })
        .from(questionFolder)
        .leftJoin(question, eq(questionFolder.id, question.folderId))
        .where(eq(questionFolder.id, folderId))
        .groupBy(questionFolder.id)

      return {
        ...updatedFolder,
        questionCount,
      }
    },
  })
}
