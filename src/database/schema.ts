import { QuestionMasteryLevelEnum } from "@/enum/question.enum"
import type { QuestionContent, QuestionMasteryLevel } from "@/types/question"
import { sql } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  json,
  integer,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"

/**
 * 用户表
 */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // 用户名
  email: text("email").notNull().unique(), // 邮箱
  emailVerified: boolean("email_verified").notNull(), // 邮箱是否验证
  image: text("image"), // 头像
  createdAt: timestamp("created_at").notNull(), // 创建时间
  updatedAt: timestamp("updated_at").notNull(), // 更新时间
})

// 用户关联关系
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  questions: many(question),
  questionGroups: many(questionGroup),
}))

/**
 * 会话表
 */
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(), // 过期时间
  token: text("token").notNull().unique(), // 会话token
  createdAt: timestamp("created_at").notNull(), // 创建时间
  updatedAt: timestamp("updated_at").notNull(), // 更新时间
  ipAddress: text("ip_address"), // IP地址
  userAgent: text("user_agent"), // 用户代理
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
})

// 会话关联关系
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

/**
 * 账户表 - 用于第三方登录
 */
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(), // 第三方账号ID
  providerId: text("provider_id").notNull(), // 提供商ID
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
  accessToken: text("access_token"), // 访问令牌
  refreshToken: text("refresh_token"), // 刷新令牌
  idToken: text("id_token"), // ID令牌
  accessTokenExpiresAt: timestamp("access_token_expires_at"), // 访问令牌过期时间
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"), // 刷新令牌过期时间
  scope: text("scope"), // 权限范围
  password: text("password"), // 密码
  createdAt: timestamp("created_at").notNull(), // 创建时间
  updatedAt: timestamp("updated_at").notNull(), // 更新时间
})

// 账户关联关系
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

/**
 * 验证表 - 用于邮箱验证等
 */
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(), // 标识符
  value: text("value").notNull(), // 验证值
  expiresAt: timestamp("expires_at").notNull(), // 过期时间
  createdAt: timestamp("created_at"), // 创建时间
  updatedAt: timestamp("updated_at"), // 更新时间
})

export const questionTypeEnum = pgEnum("type", ["multiple", "single", "text"])

/**
 * 问题表
 */
export const question = pgTable("question", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(), // 问题标题
  content: json("content").$type<QuestionContent>(), // 问题内容
  lastAnswer: text("last_answer"), // 最后一次回答
  description: text("description"), // 问题描述
  type: questionTypeEnum("type").notNull(), // 问题类型：多选、单选、文本
  masteryLevel: text("mastery_level") // 问题熟练度：初学者、中级、熟练、专家
    .$type<QuestionMasteryLevel>()
    .notNull()
    .default(QuestionMasteryLevelEnum.BEGINNER),
  reviewCount: integer("review_count").notNull(), // 复习次数
  nextReviewAt: timestamp("next_review_at").notNull(), // 下次复习时间
  createdAt: timestamp("created_at").notNull().defaultNow(), // 创建时间
  updatedAt: timestamp("updated_at").notNull().defaultNow(), // 更新时间
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
  folderId: text("folder_id")
    .notNull()
    .references(() => questionFolder.id), // 关联问题分类ID
})

// 问题关联关系
export const questionRelations = relations(question, ({ one, many }) => ({
  user: one(user, {
    fields: [question.userId],
    references: [user.id],
  }),
  questionToGroups: many(questionToGroup),
  folder: one(questionFolder, {
    fields: [question.folderId],
    references: [questionFolder.id],
  }),
}))

// 问题分类
export const questionFolder = pgTable("question_folder", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").unique().notNull(), // 文件夹名称
  isCanDelete: boolean("is_can_delete").notNull().default(true), // 是否可以删除
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
})

// 问题分类关联关系
export const questionFolderRelations = relations(
  questionFolder,
  ({ one, many }) => ({
    user: one(user, {
      fields: [questionFolder.userId],
      references: [user.id],
    }),
    questions: many(question),
  })
)

/**
 * 问题组表
 */
// export const questionGroupStatusEnum = pgEnum("status", [
//   "not_started",
//   "in_progress",
//   "completed",
// ])

export const questionGroup = pgTable("question_group", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 组名
  description: text("description"), // 描述
  tag: json("tag").$type<string[]>().notNull(), // 标签
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
  createdAt: timestamp("created_at").notNull().defaultNow(), // 创建时间
  updatedAt: timestamp("updated_at").notNull().defaultNow(), // 更新时间
})

// 问题组关联关系
export const questionGroupRelations = relations(
  questionGroup,
  ({ one, many }) => ({
    user: one(user, {
      fields: [questionGroup.userId],
      references: [user.id],
    }),
    questionToGroups: many(questionToGroup),
  })
)

/**
 * 题目与题组关系表 - 多对多关系
 */
export const questionToGroup = pgTable(
  "question_to_group",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }), // 关联问题ID
    groupId: text("group_id")
      .notNull()
      .references(() => questionGroup.id, { onDelete: "cascade" }), // 关联问题组ID
    isCompleted: boolean("is_completed").notNull().default(false), // 是否完成
    createdAt: timestamp("created_at").notNull().defaultNow(), // 创建时间
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.questionId, table.groupId] }),
    }
  }
)

// 问题-问题组关联关系
export const questionToGroupRelations = relations(
  questionToGroup,
  ({ one }) => ({
    question: one(question, {
      fields: [questionToGroup.questionId],
      references: [question.id],
    }),
    group: one(questionGroup, {
      fields: [questionToGroup.groupId],
      references: [questionGroup.id],
    }),
  })
)

interface UserSetting {
  cycle: string
}

export const userSetting = pgTable("user_setting", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
  setting: json("setting").$type<UserSetting>(), // 设置
})

/**
 * 用户学习记录表
 */
export const userLearningRecord = pgTable("user_learning_record", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
  questionCount: integer("question_count").notNull().default(0), // 学习题目总数
  reviewCount: integer("review_count").notNull().default(0), // 复习题目数
  learningTime: decimal("learning_time", { precision: 9, scale: 1 })
    .notNull()
    .default("0.0"), // 学习时长（分钟）
  continuousDay: integer("continuous_day").notNull().default(0), // 连续学习天数
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// 用户学习记录关联关系
export const userLearningRecordRelations = relations(
  userLearningRecord,
  ({ one }) => ({
    user: one(user, {
      fields: [userLearningRecord.userId],
      references: [user.id],
    }),
  })
)

/**
 * 每日学习记录表
 */
export const dailyLearningRecord = pgTable("daily_learning_record", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id), // 关联用户ID
  learningTime: decimal("learning_time", { precision: 9, scale: 1 })
    .notNull()
    .default("0.0"), // 学习总时长（分钟）
  questionCount: integer("question_count").notNull().default(0), // 学习题目总数
  reviewCount: integer("review_count").notNull().default(0), // 复习题目数
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// 每日学习记录关联关系
export const dailyLearningRecordRelations = relations(
  dailyLearningRecord,
  ({ one }) => ({
    user: one(user, {
      fields: [dailyLearningRecord.userId],
      references: [user.id],
    }),
  })
)
