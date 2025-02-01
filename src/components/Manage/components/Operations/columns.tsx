"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  QuestionMasteryLevelEnum,
  QuestionTypeEnum,
} from "@/enum/question.enum"
import type {
  GetQuestionListResponse,
  QuestionWithGroups,
  QuestionGroup,
} from "@/actions/question"
import type {
  Question,
  QuestionMasteryLevel,
  QuestionType,
} from "@/types/question"
import type { Group } from "@/types/group"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, Edit } from "lucide-react"

import { updateQuestionAction } from "@/actions/question"
import { useToast } from "@/hooks/use-toast"

interface CreateColumnsProps {
  onEditQuestion: (question: QuestionWithGroups) => void
  onMoveToGroup: (
    question: QuestionWithGroups,
    selectedGroups: string[]
  ) => void
  groups: Group[]
}

export const createColumns = ({
  onEditQuestion,
  onMoveToGroup,
  groups,
}: CreateColumnsProps): ColumnDef<
  GetQuestionListResponse["data"][number]
>[] => {
  const { toast } = useToast()

  const handleMoveToGroup = async (
    question: QuestionWithGroups,
    groupId: string
  ) => {
    try {
      const response = await updateQuestionAction({
        id: question.id,
        title: question.title,
        content: question.content || { options: [], correct: [] },
        type: question.type,
        description: question.description || undefined,
        targetGroups: [groupId],
      })

      if (response.success) {
        toast({
          title: "加入成功",
          description: `已将选中题目加入到 ${
            groups.find((group) => group.id === groupId)?.name
          }`,
          variant: "default",
        })
        onMoveToGroup(question, [groupId])
      }
    } catch (error) {
      console.error("Failed to move question:", error)
      toast({
        title: "加入失败",
        variant: "destructive",
      })
    }
  }

  return [
    {
      accessorKey: "title",
      header: "题目",
      cell: ({ row }) => (
        <div
          className="font-medium max-w-[400px] truncate"
          title={row.getValue("title")}
        >
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "类型",
      cell: ({ row }) => {
        const type = row.getValue("type") as QuestionType
        const typeMap = {
          [QuestionTypeEnum.SINGLE]: "单选题",
          [QuestionTypeEnum.MULTIPLE]: "多选题",
          [QuestionTypeEnum.TEXT]: "简答题",
        }
        return <div>{typeMap[type]}</div>
      },
    },
    {
      accessorKey: "masteryLevel",
      header: "掌握程度",
      cell: ({ row }) => {
        const level = row.getValue("masteryLevel") as QuestionMasteryLevel
        const levelMap = {
          [QuestionMasteryLevelEnum.BEGINNER]: "初学",
          [QuestionMasteryLevelEnum.INTERMEDIATE]: "进阶",
          [QuestionMasteryLevelEnum.PROFICIENCY]: "熟练",
          [QuestionMasteryLevelEnum.EXPERTISE]: "精通",
        }
        return <div>{levelMap[level]}</div>
      },
    },
    {
      accessorKey: "reviewCount",
      header: "复习次数",
      cell: ({ row }) => <div>{row.getValue("reviewCount")}</div>,
    },
    {
      accessorKey: "groups",
      header: "所属计划题组",
      cell: ({ row }) => {
        const groups = row.getValue("groups") as QuestionGroup[]
        return <div>{groups?.map((group) => group.name).join(", ") || "-"}</div>
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const handleEditClick = () => {
          onEditQuestion(row.original)
        }

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEditClick}
              className="h-8 px-2 lg:px-3"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 px-2 lg:px-3">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {groups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() =>
                          handleMoveToGroup(row.original, group.id)
                        }
                      >
                        {group.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>加入到计划题组</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ]
}
