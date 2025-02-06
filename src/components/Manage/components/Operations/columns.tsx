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
import { Badge } from "@/components/ui/badge"

import { updateQuestionAction } from "@/actions/question"
import { useToast } from "@/hooks/use-toast"
import { MasteryLevelStatus, QuestionTypeStatus } from "@/components/Status"

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
        targetGroups: [...question.groups.map((g) => g.id), groupId],
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
        return <QuestionTypeStatus type={type} />
      },
    },
    {
      accessorKey: "masteryLevel",
      header: "掌握程度",
      cell: ({ row }) => {
        const level = row.getValue("masteryLevel") as QuestionMasteryLevel
        return <MasteryLevelStatus level={level} />
      },
    },
    {
      accessorKey: "reviewCount",
      header: "复习次数",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-background">
          {row.getValue("reviewCount")}
        </Badge>
      ),
    },
    {
      accessorKey: "groups",
      header: "所属计划题组",
      cell: ({ row }) => {
        const groups = row.getValue("groups") as QuestionGroup[]
        return (
          <div className="flex flex-wrap gap-1">
            {groups?.length ? (
              groups.map((group) => (
                <Badge
                  key={group.id}
                  variant="secondary"
                  className="bg-secondary/50"
                >
                  {group.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        )
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
