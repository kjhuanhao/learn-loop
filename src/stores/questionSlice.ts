import { create } from "zustand"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import type { Option } from "@/types/question"

interface QuestionState {
  questions: QuestionWithQuestionToGroup[]
  setQuestions: (questions: QuestionWithQuestionToGroup[]) => void
  getQuestions: (id: string) => QuestionWithQuestionToGroup | undefined
  updateQuestion: (question: QuestionWithQuestionToGroup) => void
  userAnswer: { id: string; answer: string | Option["value"][] }[]
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
  updateQuestion: (question: QuestionWithQuestionToGroup) => {
    const { questions } = get()
    const index = questions.findIndex((item) => item.id === question.id)
    if (index !== -1) {
      questions[index] = question
    }
    set({ questions })
  },
}))
