import { create } from "zustand"
import type { QuestionWithQuestionToGroup } from "@/actions/question"

interface QuestionState {
  questions: QuestionWithQuestionToGroup[]
  setQuestions: (questions: QuestionWithQuestionToGroup[]) => void
  getQuestions: (id: string) => QuestionWithQuestionToGroup | undefined
  userAnswer: { id: string; answer: string | string[] }[]
  setUserAnswer: (answer: { id: string; answer: string[] | string }) => void
  getUserAnswer: (id: string) => string | string[] | undefined
}

export const useQuestionStore = create<QuestionState>()((set, get) => ({
  questions: [],
  userAnswer: [],

  setQuestions: (questions: QuestionWithQuestionToGroup[]) =>
    set({ questions }),
  getQuestions: (id: string) => {
    const { questions } = get()
    return questions.find((question) => question.id === id)
  },

  setUserAnswer: (answer: { id: string; answer: string[] | string }) => {
    const { userAnswer } = get()
    const index = userAnswer.findIndex((item) => item.id === answer.id)
    if (index !== -1) {
      userAnswer[index] = answer
    } else {
      userAnswer.push(answer)
    }
    set({ userAnswer })
  },

  getUserAnswer: (id: string) => {
    const { userAnswer } = get()
    return userAnswer.find((answer) => answer.id === id)?.answer
  },
}))
