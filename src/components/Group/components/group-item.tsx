import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Group, QuestionToGroupWithNextReview } from "@/types/group"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

// const statusColorMap: Record<QuestionGroupStatus, string> = {
//   not_started: "bg-card-primary-background text-card-primary-foreground",
//   in_progress: "bg-card-primary-2-background text-card-primary-2-foreground",
//   completed: "bg-card-primary-1-background text-card-primary-1-foreground",
// }

// const statusTextMap: Record<QuestionGroupStatus, string> = {
//   not_started: "未开始",
//   in_progress: "进行中",
//   completed: "已完成",
// }

interface GroupItemProps {
  group: Group
  onClick?: () => void
  active?: boolean
}

export const GroupItem = ({ group, onClick, active }: GroupItemProps) => {
  const { name, description, tag, questionCount, questionToGroup } = group

  const { completedCount, progress } = useMemo(() => {
    const now = new Date()
    const completed = Array.isArray(questionToGroup)
      ? questionToGroup.filter((item: QuestionToGroupWithNextReview) => {
          const nextReviewAt = new Date(item.nextReviewAt)
          return nextReviewAt > now
        }).length
      : 0

    return {
      completedCount: completed,
      progress: questionCount > 0 ? (completed / questionCount) * 100 : 0,
    }
  }, [questionToGroup, questionCount])

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-2 justify-between rounded-lg border p-4 hover:border-primary cursor-pointer transition-all",
        active && "bg-primary/10"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium group-hover:text-primary transition-colors">
          {name}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      <div className="flex flex-col gap-2">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {/* <Badge
                className={cn("text-xs font-medium", statusColorMap[status])}
                variant="outline"
              >
                {statusTextMap[status]}
              </Badge> */}
            </div>
            <div className="flex items-center gap-1">
              {tag.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{questionCount}
          </span>
        </div>
      </div>
    </div>
  )
}
