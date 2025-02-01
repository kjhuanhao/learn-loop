"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export const Manage = () => {
  const router = useRouter()
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="flex items-center justify-center cursor-pointer bg-primary rounded-md p-2 hover:bg-primary/90"
          onClick={() => {
            router.push("/manage")
          }}
        >
          <PencilIcon className="w-5 h-5 text-white" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>管理题目</p>
      </TooltipContent>
    </Tooltip>
  )
}
