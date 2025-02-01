"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  FolderOpen,
  FolderIcon,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  UserSquare,
  type LucideProps,
} from "lucide-react"
import type { ForwardRefExoticComponent, RefAttributes } from "react"
import type { Folder } from "@/types/folder"
import type { Group } from "@/types/group"
import { useSettingsStore } from "@/stores/settingsSlice"

interface BaseFileTreeProps {
  id: string
  name: string
  activeId: string
  setActiveId: (id: string) => void
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  activeIcon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  count?: number
  className?: string
}

const BaseFileTree = ({
  name,
  id,
  activeId,
  onEdit,
  onDelete,
  onClick,
  icon: Icon,
  activeIcon: ActiveIcon,
  count,
  className,
}: BaseFileTreeProps) => {
  const isActive = activeId === id
  const { unClassifiedFolderId } = useSettingsStore()
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-1 rounded-lg hover:bg-gray-100 group",
        {
          "bg-muted": isActive,
        },
        className
      )}
    >
      <div
        className="flex items-center gap-2 flex-1 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        aria-label={`选择${name}`}
      >
        {isActive ? (
          <ActiveIcon className="w-5 h-5 text-primary" />
        ) : (
          <Icon className="w-5 h-5 text-primary" />
        )}
        <div className="text-sm font-medium truncate max-w-[120px]">{name}</div>
        {count !== undefined && (
          <div className="text-xs text-gray-500 ml-auto">{count}</div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0 opacity-0  focus-visible:!outline-transparent focus-visible:ring-offset-0 focus:border-none",
              {
                "group-hover:opacity-100":
                  id !== unClassifiedFolderId && id !== "",
              }
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface FolderTreeProps {
  folder: Folder
  activeId: string
  setActiveId: (id: string) => void
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export const FolderTree = ({
  folder,
  activeId,
  setActiveId,
  onClick,
  onEdit,
  onDelete,
  className,
}: FolderTreeProps) => {
  return (
    <BaseFileTree
      id={folder.id}
      name={folder.name}
      activeId={activeId}
      setActiveId={setActiveId}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      icon={FolderIcon}
      activeIcon={FolderOpen}
      count={folder.questionCount}
      className={className}
    />
  )
}

interface GroupTreeProps {
  group: Group
  activeId: string
  setActiveId: (id: string) => void
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export const GroupTree = ({
  group,
  activeId,
  setActiveId,
  onClick,
  onEdit,
  onDelete,
  className,
}: GroupTreeProps) => {
  return (
    <BaseFileTree
      id={group.id}
      name={group.name}
      activeId={activeId}
      setActiveId={setActiveId}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      icon={UserSquare}
      activeIcon={Users}
      count={group.questionCount}
      className={className}
    />
  )
}
