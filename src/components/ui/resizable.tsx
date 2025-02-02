"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-[2px] items-center justify-center  after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:-translate-x-1/2",
      "before:absolute before:inset-y-0 before:-left-1 before:w-[8px] before:cursor-col-resize",
      "hover:bg-primary hover:after:bg-primary",
      "active:bg-primary active:after:bg-primary",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-[2px] data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-[2px] data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
      "data-[panel-group-direction=vertical]:before:inset-x-0 data-[panel-group-direction=vertical]:before:-top-1 data-[panel-group-direction=vertical]:before:h-[8px] data-[panel-group-direction=vertical]:before:cursor-row-resize",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "transition-colors duration-200",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border hover:bg-primary hover:border-primary active:bg-primary active:border-primary transition-colors duration-200">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)
export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
