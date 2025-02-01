import { getQuestionGroupListAction } from "@/actions/group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { CreateNewGroup } from "./components/CreateNewGroup"
import { GroupList } from "./components/GroupList"
import { GroupSkeleton } from "./components/GroupSkeleton"
import { Manage } from "./components/Manage"

export const QuestionGroup = () => {
  const { data, isPending } = useQuery({
    queryKey: ["group"],
    queryFn: getQuestionGroupListAction,
  })
  console.log(data, "data")

  return (
    <Card className="w-full rounded-2xl">
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="flex w-full items-center justify-between text-lg font-medium text-card-foreground">
            <span>我的计划题组</span>
            <div className="flex items-center gap-2">
              <CreateNewGroup />
              <Manage />
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <GroupSkeleton />
        ) : (
          <GroupList groups={data?.data || []} />
        )}
      </CardContent>
    </Card>
  )
}
