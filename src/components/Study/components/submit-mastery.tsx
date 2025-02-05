import { QuestionMasteryLevelEnum } from "@/enum/question.enum"
import { cn } from "@/lib/utils"

type MasteryLevel =
  (typeof QuestionMasteryLevelEnum)[keyof typeof QuestionMasteryLevelEnum]

interface MasterySubmitProps {
  value?: MasteryLevel | null
  onChange?: (mastery: MasteryLevel) => void
  isLoading?: boolean
}

export const MasterySubmit = ({
  value,
  onChange,
  isLoading,
}: MasterySubmitProps) => {
  const handleSelect = (selectedValue: MasteryLevel) => {
    if (isLoading) return
    onChange?.(selectedValue)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-medium">请选择你对这道题的掌握程度：</div>
      <div className="flex gap-3">
        <button
          disabled={isLoading}
          onClick={() => handleSelect(QuestionMasteryLevelEnum.BEGINNER)}
          className={cn(
            "flex-1 rounded-lg border p-4 transition-all",
            "hover:border-primary hover:bg-card-primary-background hover:text-card-primary-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-foreground",
            value === QuestionMasteryLevelEnum.BEGINNER &&
              "border-primary bg-card-primary-background text-card-primary-foreground"
          )}
        >
          <div className="text-lg font-medium">不熟悉</div>
          <div className="mt-1 text-sm text-muted-foreground">需要每天复习</div>
        </button>

        <button
          disabled={isLoading}
          onClick={() => handleSelect(QuestionMasteryLevelEnum.INTERMEDIATE)}
          className={cn(
            "flex-1 rounded-lg border p-4 transition-all",
            "hover:border-primary-2 hover:bg-card-primary-1-background hover:text-card-primary-1-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-foreground",
            value === QuestionMasteryLevelEnum.INTERMEDIATE &&
              "border-primary-2 bg-card-primary-1-background text-card-primary-1-foreground"
          )}
        >
          <div className="text-lg font-medium">有印象</div>
          <div className="mt-1 text-sm text-muted-foreground">隔天复习</div>
        </button>

        <button
          disabled={isLoading}
          onClick={() => handleSelect(QuestionMasteryLevelEnum.PROFICIENCY)}
          className={cn(
            "flex-1 rounded-lg border p-4 transition-all",
            "hover:border-primary-3 hover:bg-card-primary-2-background hover:text-card-primary-2-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-foreground",
            value === QuestionMasteryLevelEnum.PROFICIENCY &&
              "border-primary-3 bg-card-primary-2-background text-card-primary-2-foreground"
          )}
        >
          <div className="text-lg font-medium">较熟悉</div>
          <div className="mt-1 text-sm text-muted-foreground">间隔几天复习</div>
        </button>

        <button
          disabled={isLoading}
          onClick={() => handleSelect(QuestionMasteryLevelEnum.EXPERTISE)}
          className={cn(
            "flex-1 rounded-lg border p-4 transition-all",
            "hover:border-primary-4 hover:bg-card-primary-3-background hover:text-card-primary-3-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-foreground",
            value === QuestionMasteryLevelEnum.EXPERTISE &&
              "border-primary-4 bg-card-primary-3-background text-card-primary-3-foreground"
          )}
        >
          <div className="text-lg font-medium">已掌握</div>
          <div className="mt-1 text-sm text-muted-foreground">无需再复习</div>
        </button>
      </div>
    </div>
  )
}
