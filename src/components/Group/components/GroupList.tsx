import { GroupItem } from "./GroupItem"
import { EmptyGroup } from "./EmptyGroup"
import { QuestionGroupStatus } from "@/types/question"
import { questionToGroup } from "@/database/schema"
interface GroupItemProps {
  id: string
  name: string
  description: string | null
  status: QuestionGroupStatus
  tag: string[]
  questions: (typeof questionToGroup.$inferSelect)[]
  onClick?: () => void
}

export const GroupList = ({ groups }: { groups: GroupItemProps[] }) => {
  if (!groups.length) return <EmptyGroup />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupItem key={group.id} {...group} />
      ))}
    </div>
  )
}
