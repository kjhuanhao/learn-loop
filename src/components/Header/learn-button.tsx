"use client"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import Link from "next/link"
import { useStudyTimer } from "@/hooks/use-study-timer"
import { Play, Pause, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export const LearnButton = () => {
  const pathname = usePathname()
  const isStudyPage = pathname.includes("/study")

  const { hours, minutes, seconds, readableTime, isPlaying, toggle, reset } =
    useStudyTimer({
      autoStart: isStudyPage,
    })

  if (isStudyPage) {
    return (
      <div className="flex items-center gap-2 ml-auto">
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg font-mono text-sm">
              <Clock className="w-4 h-4" />
              {`${hours}:${minutes}:${seconds}`}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>已学习 {readableTime}</p>
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm" onClick={toggle}>
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <Link href="/study">
      <Button className="rounded-full px-6 bg-primary">开始今日学习</Button>
    </Link>
  )
}
