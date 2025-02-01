import { GroupItem } from "./GroupItem"
import { EmptyGroup } from "./EmptyGroup"
import type { Group } from "@/types/group"

export const GroupList = ({ groups }: { groups: Group[] }) => {
  if (!groups.length) return <EmptyGroup />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupItem key={group.id} group={group} />
      ))}
    </div>
  )
}
