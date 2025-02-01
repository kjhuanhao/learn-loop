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
import { MoreVertical, Pencil, Trash2, BookOpen, Book } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface GroupProps {
  name: string
  id: string
  isActive?: boolean
  onClick?: () => void
  className?: string
  onEdit?: () => void
  onDelete?: () => void
  description?: string
  tag: string[]
  status: "not_started" | "in_progress" | "completed"
  onHover?: (id: string) => void
}

export const statusColorMap = {
  not_started:
    "bg-card-primary-background text-card-primary-foreground border-0",
  in_progress:
    "bg-card-primary-2-background text-card-primary-2-foreground border-0",
  completed:
    "bg-card-primary-1-background text-card-primary-1-foreground border-0",
}

const statusTextMap = {
  not_started: "未开始",
  in_progress: "进行中",
  completed: "已完成",
}

export const Group = ({
  name,
  id,
  isActive,
  onClick,
  className,
  onEdit,
  onDelete,
  description,
  tag,
  status,
  onHover,
}: GroupProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented) return
    onClick?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.defaultPrevented) return
      onClick?.()
    }
  }

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-1 rounded-lg hover:bg-gray-100 group",
        isActive && "bg-gray-100",
        className
      )}
      onMouseEnter={() => onHover?.(id)}
    >
      <div
        className="flex items-center gap-2 flex-1 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {isActive ? (
          <BookOpen className="w-5 h-5 text-primary" />
        ) : (
          <Book className="w-5 h-5 text-primary" />
        )}
        <div className="flex flex-col">
          <div className="text-sm font-medium truncate max-w-[120px]">
            {name}
          </div>
          {description && (
            <div className="text-xs text-gray-500 truncate max-w-[120px]">
              {description}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {tag.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                      {tag.length}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="flex flex-wrap gap-1 max-w-[200px] p-2">
                  {tag.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Badge
            className={cn("text-xs font-medium", statusColorMap[status])}
            variant="outline"
          >
            {statusTextMap[status]}
          </Badge>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus-visible:!outline-transparent focus-visible:ring-offset-0 focus:border-none"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
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
