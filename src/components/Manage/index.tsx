"use client"

import { getFolderListAction } from "@/actions/folder"
import { getQuestionGroupListAction } from "@/actions/group"
import type { Folder } from "@/types/folder"
import type { Group } from "@/types/group"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { OperationPanel } from "./operation"
import { ManageSidebar } from "./sidebar"

export const Manage = () => {
  const queryClient = useQueryClient()
  const [active, setActive] = useState<"folder" | "group">("folder")
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [selectedFolderId, setSelectedFolderId] = useState<string>("")

  const { data: folderList, isPending: isFolderListLoading } = useQuery({
    queryKey: ["folderList"],
    queryFn: getFolderListAction,
  })

  const { data: groupList, isPending: isGroupListLoading } = useQuery({
    queryKey: ["groupList"],
    queryFn: getQuestionGroupListAction,
  })

  const groups = (groupList?.success ? groupList.data : []) as Group[]
  const folders = [
    {
      id: "",
      name: "全部题目",
      isCanDelete: false,
      userId: null,
      questionCount: null,
    },
    ...(folderList?.success ? (folderList.data as Folder[]) : []),
  ] as Folder[]

  const handleQuestionsDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["folderList"] })
    queryClient.invalidateQueries({ queryKey: ["groupList"] })
  }

  return (
    <div className="flex">
      <ManageSidebar
        active={active}
        setActive={setActive}
        folders={folders}
        groups={groups}
        isLoading={isFolderListLoading || isGroupListLoading}
        selectedFolderId={selectedFolderId}
        selectedGroupId={selectedGroupId}
        setSelectedFolderId={setSelectedFolderId}
        setSelectedGroupId={setSelectedGroupId}
      />
      <OperationPanel
        active={active}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        selectedGroupId={selectedGroupId}
        folders={folders}
        groups={groups}
        onQuestionsDeleted={handleQuestionsDeleted}
      />
    </div>
  )
}
