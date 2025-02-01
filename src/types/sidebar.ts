import type { Folder } from "./folder"
import type { Group } from "./group"

export type ItemType = "folder" | "group"

export interface BaseItem {
  id: string
  name: string
}

export interface ItemProps extends BaseItem {
  isActive?: boolean
  onClick?: () => void
  className?: string
  onEdit?: () => void
  onDelete?: () => void
  onHover?: (id: string) => void
}

export interface SidebarItem extends BaseItem {
  type: ItemType
  isActive?: boolean
  icon?: React.ReactNode
  description?: string
  meta?: React.ReactNode
  data: Folder | Group
}

export interface DialogConfig {
  open: boolean
  type: "create" | "edit" | "delete"
  item?: SidebarItem
}
