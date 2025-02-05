"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllTodayLearningRecord } from "@/actions/record"

interface LearningRecord {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  learningTime: string
  questionCount: number
  reviewCount: number
  continuousDay?: number
}

interface ActionResponse<T> {
  data: T
}

export const useRecords = () => {
  return useQuery({
    queryKey: ["record"],
    queryFn: async () => {
      const result = await getAllTodayLearningRecord()
      return result as ActionResponse<LearningRecord[]>
    },
  })
}
