"use server"
import { getSession } from "@/lib/auth-server"
import type { User } from "better-auth/types"
import * as Sentry from "@sentry/nextjs"
export interface ActionResponse<T> {
  data?: T
  error?: string
  success: boolean
}

interface CreateActionProps<TOutput> {
  actionFunc: (user: User) => Promise<TOutput>
}

const validateUser = async () => {
  const session = await getSession()

  if (!session) {
    throw new Error("用户未登录")
  }

  // 验证 session 是否过期
  if (session.session.expiresAt < new Date()) {
    throw new Error("身份信息已过期, 请重新登入")
  }

  return session.user
}

/**
 * 创建一个统一的 action 处理函数
 * @param actionFunc - 实际执行的异步操作函数
 */
export const createAction = async <TInput, TOutput>(
  props: CreateActionProps<TOutput>,
  body?: TInput
): Promise<ActionResponse<TOutput>> => {
  let user
  try {
    user = await validateUser()
    const result = await props.actionFunc(user)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
      })

      Sentry.setContext("body_context", {
        body: body,
      })
    }

    if (error instanceof Error) {
      Sentry.setExtra("error_details", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }

    Sentry.captureException(error, {
      level: "error",
    })

    throw error
  }
}
