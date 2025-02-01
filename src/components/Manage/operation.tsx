"use client"

import {
  deleteQuestionsAction,
  getQuestionListActionByFolderId,
  getQuestionListActionByGroupId,
  updateQuestionAction,
  type QuestionWithGroups,
} from "@/actions/question"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Folder } from "@/types/folder"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { DataTable } from "./components/data-table"
import { EditQuestion } from "./components/editQuestion"
import { CreateNewQuestion } from "./components/Operations/CreateNewQuestion"
import { createColumns } from "./components/Operations/columns"
import type { Group } from "@/types/group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSettingsStore } from "@/stores/settingsSlice"

export const OperationGuide = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-lg font-bold">操作指南</div>
    </div>
  )
}

export const OperationPanel = ({
  active,
  selectedFolderId,
  selectedGroupId,
  folders,
  groups,
  onQuestionsDeleted,
}: {
  active: "folder" | "group"
  selectedFolderId: string
  selectedGroupId: string
  folders: Folder[]
  groups: Group[]
  onQuestionsDeleted: () => void
}) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionWithGroups | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { unClassifiedFolderId } = useSettingsStore()
  const targetFolderId =
    active === "folder" ? selectedFolderId : unClassifiedFolderId

  // 查找当前选中的文件夹和题组
  const selectedFolder = folders.find((f) => f.id === selectedFolderId)
  const selectedGroup = groups.find((g) => g.id === selectedGroupId)

  // 重置状态的 useEffect
  useEffect(() => {
    setPage(1)
    setRowSelection({})
    setEditingQuestion(null)
    // 清除之前的查询缓存
    queryClient.removeQueries({
      queryKey: ["questionList"],
    })
    queryClient.removeQueries({
      queryKey: ["groupQuestionList"],
    })
  }, [active, selectedFolderId, selectedGroupId, queryClient])

  // 文件夹数据查询
  const {
    data: folderData,
    isPending: isFolderPending,
    refetch: refetchFolder,
    error: folderError,
  } = useQuery({
    queryKey: ["questionList", selectedFolderId, page, pageSize],
    queryFn: () =>
      getQuestionListActionByFolderId(selectedFolderId, page, pageSize),
    enabled: active === "folder",
  })

  // 题组数据查询
  const {
    data: groupData,
    isPending: isGroupPending,
    refetch: refetchGroup,
    error: groupError,
  } = useQuery({
    queryKey: ["groupQuestionList", selectedGroupId, page, pageSize],
    queryFn: async () => {
      if (!selectedGroupId)
        return { success: true, data: { data: [], total: 0 } }
      try {
        const response = await getQuestionListActionByGroupId(
          selectedGroupId,
          page,
          pageSize
        )
        return response
      } catch (error) {
        console.error("获取题组数据失败:", error)
        throw error
      }
    },
    enabled: active === "group",
  })

  useEffect(() => {
    if (folderError || groupError) {
      toast({
        title: "获取题目失败",
        description: "请检查网络连接或刷新重试",
        variant: "destructive",
      })
    }
  }, [folderError, groupError, toast])

  // 获取当前显示的数据
  const currentData = active === "folder" ? folderData : groupData
  const isPending = active === "folder" ? isFolderPending : isGroupPending
  const result =
    currentData?.success && currentData.data
      ? currentData.data
      : { data: [], total: 0 }

  const { mutate: deleteQuestions, isPending: isDeleting } = useMutation({
    mutationFn: deleteQuestionsAction,
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "题目已成功删除",
      })
      if (active === "folder") {
        refetchFolder()
      } else {
        refetchGroup()
      }
      onQuestionsDeleted()
      setRowSelection({})
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: "服务器异常",
        variant: "destructive",
      })
      setRowSelection({})
    },
  })

  const { mutate: updateQuestion, isPending: isUpdating } = useMutation({
    mutationFn: updateQuestionAction,
    onSuccess: () => {
      if (active === "folder") {
        refetchFolder()
      } else {
        refetchGroup()
      }
    },
  })

  const selectedQuestions = Object.keys(rowSelection).map(
    (index) => result.data[parseInt(index)]
  )

  const handleBatchDelete = async () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "请先选择要删除的题目",
        variant: "destructive",
      })
      return
    }

    if (active === "group" && selectedGroupId) {
      // 在 group 模式下，从当前组中移除选中的题目
      selectedQuestions.forEach((question) => {
        const newGroups = (question.groups || [])
          .filter((g) => g.id !== selectedGroupId)
          .map((g) => g.id)

        updateQuestion({
          id: question.id,
          title: question.title,
          content: question.content || { options: [], correct: [] },
          type: question.type,
          description: question.description || undefined,
          targetGroups: newGroups,
        })
      })

      toast({
        title: "移除成功",
        description: `已从当前题组中移除选中题目`,
      })
      refetchGroup()
      setRowSelection({})
    } else {
      // 在 folder 模式下，真正删除题目
      deleteQuestions(selectedQuestions.map((q) => q.id))
    }
  }

  const columns = createColumns({
    onEditQuestion: (question) => setEditingQuestion(question),
    onMoveToGroup: (question: QuestionWithGroups, selectedGroups: string[]) => {
      updateQuestion({
        id: question.id,
        title: question.title,
        content: question.content || { options: [], correct: [] },
        type: question.type,
        description: question.description || undefined,
        targetGroups: selectedGroups,
      })
    },
    groups: groups,
  })

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-4 w-full justify-between items-center p-4 border-gray-200">
        <div className="flex gap-2 items-center min-w-0">
          <div className="text-lg font-bold truncate max-w-[300px]">
            {active === "folder"
              ? selectedFolder?.name || "全部题目"
              : selectedGroup?.name || "未选择题目组"}
          </div>
          <div className="text-sm text-gray-500 flex-shrink-0">
            {result.total} 个题目
          </div>
          {Object.keys(rowSelection).length > 0 && (
            <div className="text-sm text-primary flex-shrink-0">
              已选择 {Object.keys(rowSelection).length} 个
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(rowSelection).length > 0 && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBatchDelete}
                isLoading={isDeleting}
              >
                {active === "group" ? "从题组移除" : "删除选中"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    加入到题组
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {groups.map((group) => (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() => {
                        selectedQuestions.forEach((question) => {
                          // 获取当前题目所属的组，排除目标组，然后添加目标组
                          const existingGroupIds = (question.groups || [])
                            .map((g) => g.id)
                            .filter((id) => id !== group.id)

                          updateQuestion({
                            id: question.id,
                            title: question.title,
                            content: question.content || {
                              options: [],
                              correct: [],
                            },
                            type: question.type,
                            description: question.description || undefined,
                            targetGroups: [...existingGroupIds, group.id],
                          })
                        })
                        toast({
                          title: "加入成功",
                          description: `已将选中题目加入到 ${group.name}`,
                        })
                        if (active === "folder") {
                          refetchFolder()
                        } else {
                          refetchGroup()
                        }
                        setRowSelection({})
                      }}
                    >
                      {group.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    移动到文件夹
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {folders.map((folder) => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={() => {
                        selectedQuestions.forEach((question) => {
                          updateQuestion({
                            id: question.id,
                            title: question.title,
                            content: question.content || {
                              options: [],
                              correct: [],
                            },
                            type: question.type,
                            description: question.description || undefined,
                            targetFolderId: folder.id,
                            targetGroups:
                              question.groups?.map((g) => g.id) || [],
                          })
                        })
                        toast({
                          title: "移动成功",
                          description: `已将选中题目移动到 ${folder.name}`,
                        })
                        if (active === "folder") {
                          refetchFolder()
                        } else {
                          refetchGroup()
                        }
                        setRowSelection({})
                      }}
                    >
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <CreateNewQuestion
            folders={folders}
            targetFolderId={targetFolderId}
            onSuccess={() => refetchFolder()}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={result.data}
        isLoading={isPending}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        getData={() =>
          active === "folder"
            ? getQuestionListActionByFolderId(selectedFolderId, page, pageSize)
            : getQuestionListActionByGroupId(selectedGroupId, page, pageSize)
        }
        total={result.total}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      {editingQuestion && (
        <EditQuestion
          question={editingQuestion}
          open={!!editingQuestion}
          folders={folders}
          onOpenChange={(open) => {
            if (!open) {
              setEditingQuestion(null)
            }
          }}
          onSuccess={() => {
            refetchFolder()
          }}
        />
      )}
    </div>
  )
}
