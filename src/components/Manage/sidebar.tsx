"use client"

import {
  createNewFolderAction,
  deleteFolderAction,
  updateFolderAction,
} from "@/actions/folder"
import {
  createNewGroupAction,
  deleteGroupAction,
  updateGroupAction,
} from "@/actions/group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Folder } from "@/types/folder"
import type { Group } from "@/types/group"
import type {
  DialogConfig,
  ItemType,
  SidebarItem as TSidebarItem,
} from "@/types/sidebar"
import { useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Scrollbar } from "react-scrollbars-custom"
import { FolderTree, GroupTree } from "./components/Sidebar/file-tree"
import { Search } from "./components/Sidebar/Search"
import { SidebarDialog } from "./components/Sidebar/SidebarDialog"
import { Switch } from "./components/Sidebar/Switch"

// const statusColorMap: Record<Group["status"], string> = {
//   not_started:
//     "bg-card-primary-background text-card-primary-foreground border-0",
//   in_progress:
//     "bg-card-primary-2-background text-card-primary-2-foreground border-0",
//   completed:
//     "bg-card-primary-1-background text-card-primary-1-foreground border-0",
// }

// const statusTextMap: Record<Group["status"], string> = {
//   not_started: "未开始",
//   in_progress: "进行中",
//   completed: "已完成",
// }

interface ManageSidebarProps {
  active: ItemType
  setActive: (active: ItemType) => void
  folders: Folder[]
  groups: Group[]
  isLoading: boolean
  selectedFolderId: string
  selectedGroupId: string
  setSelectedFolderId: (id: string) => void
  setSelectedGroupId: (id: string) => void
}

export const ManageSidebar = ({
  active,
  setActive,
  folders,
  groups = [],
  isLoading,
  selectedFolderId,
  selectedGroupId,
  setSelectedFolderId,
  setSelectedGroupId,
}: ManageSidebarProps) => {
  const [search, setSearch] = useState("")
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    open: false,
    type: "create",
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setDialogConfig((prev) => ({ ...prev, open: false }))
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (dialogConfig.type === "create") {
        if (active === "folder") {
          const response = await createNewFolderAction({
            name: formData.name,
          })
          if (response.success) {
            toast({
              title: "创建成功",
              description: "文件夹已创建",
            })
            queryClient.invalidateQueries({ queryKey: ["folderList"] })
          }
        } else {
          const response = await createNewGroupAction({
            name: formData.name,
            description: formData.description,
            tag: formData.tag || [],
          })
          if (response.success) {
            toast({
              title: "创建成功",
              description: "题组已创建",
            })
            queryClient.invalidateQueries({ queryKey: ["groupList"] })
          }
        }
      } else if (dialogConfig.type === "edit") {
        if (!dialogConfig.item) return

        if (active === "folder") {
          const response = await updateFolderAction(
            dialogConfig.item.id,
            formData.name
          )
          if (response.success) {
            toast({
              title: "更新成功",
              description: "文件夹已更新",
            })
            queryClient.invalidateQueries({ queryKey: ["folderList"] })
          }
        } else {
          const response = await updateGroupAction({
            id: dialogConfig.item.id,
            name: formData.name,
            description: formData.description,
            tag: formData.tag || [],
          })
          if (response.success) {
            toast({
              title: "更新成功",
              description: "题组已更新",
            })
            queryClient.invalidateQueries({ queryKey: ["groupList"] })
          }
        }
      } else if (dialogConfig.type === "delete") {
        if (!dialogConfig.item) return

        if (active === "folder") {
          const response = await deleteFolderAction(dialogConfig.item.id)
          if (response.success) {
            toast({
              title: "删除成功",
              description: "文件夹已删除",
            })
            queryClient.invalidateQueries({ queryKey: ["folderList"] })
            if (selectedFolderId === dialogConfig.item.id) {
              setSelectedFolderId("")
            }
          }
        } else {
          const response = await deleteGroupAction(dialogConfig.item.id)
          if (response.success) {
            toast({
              title: "删除成功",
              description: "题组已删除",
            })
            queryClient.invalidateQueries({ queryKey: ["groupList"] })
            if (selectedGroupId === dialogConfig.item.id) {
              setSelectedGroupId("")
            }
          }
        }
      }

      // 关闭对话框
      setDialogConfig((prev) => ({ ...prev, open: false }))
    } catch (error) {
      console.error("Failed to submit:", error)
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  const handleCreate = () => {
    setDialogConfig({
      type: "create",
      open: true,
    })
  }

  const handleEdit = (item: TSidebarItem) => {
    setDialogConfig({
      type: "edit",
      open: true,
      item,
    })
  }

  const handleDelete = (item: TSidebarItem) => {
    setDialogConfig({
      type: "delete",
      open: true,
      item,
    })
  }

  const filteredItems = (active === "folder" ? folders : groups).filter(
    (item) => item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-1/4 border-r h-[calc(100vh-4rem)] p-4 flex flex-col gap-4">
      <Switch active={active} setActive={setActive} />
      <div className="flex gap-2 items-center justify-between">
        <Search value={search} onChange={setSearch} />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-12"
          onClick={handleCreate}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <Scrollbar className="flex-1 -mr-4 pr-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-md animate-pulse" />
                  <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse" />
                </div>
                <div className="w-4 h-4 bg-gray-200 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px] w-full">
            <div className="text-sm text-gray-500">
              暂无{active === "folder" ? "文件夹" : "题组"}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {active === "folder"
              ? folders.map((folder) => (
                  <FolderTree
                    key={folder.id}
                    folder={folder}
                    activeId={selectedFolderId}
                    setActiveId={setSelectedFolderId}
                    onClick={() => setSelectedFolderId(folder.id)}
                    onEdit={() =>
                      handleEdit({
                        id: folder.id,
                        name: folder.name,
                        type: "folder",
                        data: folder,
                      })
                    }
                    onDelete={() =>
                      handleDelete({
                        id: folder.id,
                        name: folder.name,
                        type: "folder",
                        data: folder,
                      })
                    }
                  />
                ))
              : groups.map((group) => (
                  <GroupTree
                    key={group.id}
                    group={group}
                    activeId={selectedGroupId}
                    setActiveId={setSelectedGroupId}
                    onClick={() => setSelectedGroupId(group.id)}
                    onEdit={() =>
                      handleEdit({
                        id: group.id,
                        name: group.name,
                        type: "group",
                        data: group,
                      })
                    }
                    onDelete={() =>
                      handleDelete({
                        id: group.id,
                        name: group.name,
                        type: "group",
                        data: group,
                      })
                    }
                  />
                ))}
          </div>
        )}
      </Scrollbar>

      <SidebarDialog
        config={dialogConfig}
        onOpenChange={handleCloseDialog}
        onSubmit={handleSubmit}
        type={active}
      />
    </div>
  )
}
