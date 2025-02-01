import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { questionToGroup } from "@/database/schema"
import { cn } from "@/lib/utils"
import type { Group } from "@/types/group"
import { QuestionGroupStatus } from "@/types/question"

type QuestionToGroup = typeof questionToGroup.$inferSelect

interface GroupItemProps {
  group: Group
  onClick?: () => void
}

const statusColorMap: Record<QuestionGroupStatus, string> = {
  not_started: "bg-card-primary-background text-card-primary-foreground",
  in_progress: "bg-card-primary-2-background text-card-primary-2-foreground",
  completed: "bg-card-primary-1-background text-card-primary-1-foreground",
}

const statusTextMap: Record<QuestionGroupStatus, string> = {
  not_started: "未开始",
  in_progress: "进行中",
  completed: "已完成",
}

export const GroupItem = ({ group, onClick }: GroupItemProps) => {
  const { name, description, status, tag, questionCount, questionToGroup } =
    group
  const totalQuestions = questionCount
  const completedQuestions = Array.isArray(questionToGroup)
    ? questionToGroup.filter((item: QuestionToGroup) => item.isCompleted).length
    : 0

  const progress =
    totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0

  return (
    <div
      onClick={onClick}
      className="group flex flex-col gap-2 rounded-lg border p-4 hover:border-primary cursor-pointer transition-all"
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
              <Badge
                className={cn("text-xs font-medium", statusColorMap[status])}
                variant="outline"
              >
                {statusTextMap[status]}
              </Badge>
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
            {completedQuestions}/{totalQuestions}
          </span>
        </div>
      </div>
    </div>
  )
}
