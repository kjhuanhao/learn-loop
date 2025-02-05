import type { QuestionWithQuestionToGroup } from "@/actions/question"
import { QuestionMasteryLevelEnum } from "@/enum/question.enum"

export const computeReview = (
  questions: QuestionWithQuestionToGroup,
  userSelectedMastery: (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]
): {
  nextReviewDate: Date
  isCompleted: boolean
} => {
  const currentMastery = questions.masteryLevel
  const reviewCount = questions.reviewCount || 0
  let isCompleted = false
  const now = new Date()

  // 根据用户选择的掌握程度设置基础复习间隔（单位：天）
  let baseIntervalDays = 1

  if (userSelectedMastery === QuestionMasteryLevelEnum.BEGINNER) {
    baseIntervalDays = 1 // 不熟悉，需要每天复习
  } else if (userSelectedMastery === QuestionMasteryLevelEnum.INTERMEDIATE) {
    baseIntervalDays = 2 // 有点印象，隔天复习
  } else if (userSelectedMastery === QuestionMasteryLevelEnum.PROFICIENCY) {
    baseIntervalDays = 5 // 比较熟悉，隔几天复习
  } else if (userSelectedMastery === QuestionMasteryLevelEnum.EXPERTISE) {
    return {
      nextReviewDate: now,
      isCompleted: true,
    }
  }

  // 如果用户选择的熟练度低于当前熟练度，缩短复习间隔
  if (
    userSelectedMastery === QuestionMasteryLevelEnum.BEGINNER &&
    currentMastery !== QuestionMasteryLevelEnum.BEGINNER
  ) {
    baseIntervalDays = 1 // 强制每天复习
  }

  // 根据复习次数微调间隔
  const reviewMultiplier = Math.min(1 + reviewCount * 0.1, 1.5) // 最多延长1.5倍，减小复习次数的影响
  const intervalDays = Math.round(baseIntervalDays * reviewMultiplier)

  // 计算下次复习时间
  const nextReviewDate = new Date(
    now.getTime() + intervalDays * 24 * 60 * 60 * 1000
  )

  return {
    nextReviewDate,
    isCompleted,
  }
}
