"use client"
import { useRouter } from "next/navigation"
import { GroupItem } from "./group-item"
import { EmptyGroup } from "./empty-group"
import type { Group } from "@/types/group"

export const GroupList = ({ groups }: { groups: Group[] }) => {
  if (!groups.length) return <EmptyGroup />
  const router = useRouter()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          onClick={() => router.push(`/study/${group.id}`)}
        />
      ))}
    </div>
  )
}
