"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  BookIcon,
  BookOpen,
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
        "flex items-center justify-between p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group min-h-[36px]",
        {
          "bg-muted": isActive,
        },
        className
      )}
    >
      <div
        className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        aria-label={`选择${name}`}
      >
        {isActive ? (
          <ActiveIcon className="w-5 h-5 text-primary flex-shrink-0" />
        ) : (
          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm font-medium truncate">{name}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {count !== undefined && (
          <div className="text-xs text-gray-500 ml-auto flex-shrink-0">
            {count}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 w-8">
        {id !== unClassifiedFolderId && id !== "" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:!outline-transparent focus-visible:ring-offset-0 focus:border-none"
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
        )}
      </div>
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
      icon={BookIcon}
      activeIcon={BookIcon}
      count={group.questionCount}
      className={className}
    />
  )
}
