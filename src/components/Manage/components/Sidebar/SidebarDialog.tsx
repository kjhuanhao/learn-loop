"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import type { DialogConfig, ItemType } from "@/types/sidebar"

interface SidebarDialogProps {
  config: DialogConfig
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  isLoading?: boolean
  type: ItemType
}

export const SidebarDialog = ({
  config,
  onOpenChange,
  onSubmit,
  isLoading,
  type,
}: SidebarDialogProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (config.item) {
      setName(config.item.name)
      if ("description" in config.item.data) {
        setDescription(config.item.data.description || "")
      }
      if ("tag" in config.item.data) {
        setTags(config.item.data.tag)
      }
    } else {
      setName("")
      setDescription("")
      setTags([])
    }
  }, [config.item])

  const handleSubmit = () => {
    if (type === "folder") {
      onSubmit({ name })
    } else {
      onSubmit({ name, description, tag: tags })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  if (config.type === "delete") {
    return (
      <AlertDialog open={config.open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除{type === "folder" ? "文件夹" : "题组"} "
              {config.item?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onSubmit(config.item?.id)}
              disabled={isLoading}
            >
              {isLoading ? "删除中..." : "删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Dialog open={config.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {config.type === "create"
              ? `新建${type === "folder" ? "文件夹" : "题组"}`
              : `编辑${type === "folder" ? "文件夹" : "题组"}`}
          </DialogTitle>
          <DialogDescription>
            {config.type === "create"
              ? `创建一个新的${type === "folder" ? "文件夹" : "题组"}来组织你的问题`
              : `修改${type === "folder" ? "文件夹" : "题组"}信息`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`请输入${type === "folder" ? "文件夹" : "题组"}名称`}
            />
          </div>

          {type === "group" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入题组描述"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">标签</label>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入标签后按回车添加"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pr-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? "提交中..."
              : config.type === "create"
                ? "创建"
                : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
