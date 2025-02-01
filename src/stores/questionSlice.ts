import { create } from "zustand"
import type { QuestionWithQuestionToGroup } from "@/actions/question"

interface QuestionState {
  questions: QuestionWithQuestionToGroup[]
  setQuestions: (questions: QuestionWithQuestionToGroup[]) => void
  getQuestions: (id: string) => QuestionWithQuestionToGroup | undefined
}

export const useQuestionStore = create<QuestionState>()((set, get) => ({
  questions: [],
  setQuestions: (questions: QuestionWithQuestionToGroup[]) =>
    set({ questions }),
  getQuestions: (id: string) => {
    const { questions } = get()
    return questions.find((question) => question.id === id)
  },
}))
