"use client"

import { motion } from "motion/react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ForwardRefExoticComponent, RefAttributes } from "react"
import type { LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwitchPanelButtonProps {
  panels: {
    title: string
    onClick: () => void
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >
  }[]
  activeIndex: number
}

export const SwitchPanelButton = ({
  panels,
  activeIndex,
}: SwitchPanelButtonProps) => {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    onClick: () => void
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative flex gap-4 border border-border rounded-full px-6 py-2 bg-background/80 backdrop-blur-md">
        {panels.map((panel, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <motion.button
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={panel.title}
                tabIndex={0}
                className="relative w-5 h-5 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary bg-white p-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: i === activeIndex ? 1 : 0.85,
                  backgroundColor:
                    i === activeIndex ? "var(--primary)" : "var(--border)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                onClick={panel.onClick}
                onKeyDown={(e) => handleKeyDown(e, panel.onClick)}
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1.1,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <panel.icon
                    className={cn(
                      "w-5 h-5 text-muted-foreground",
                      i === activeIndex && "text-card-primary-1-foreground"
                    )}
                  />
                </motion.div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{panel.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
