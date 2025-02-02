"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient, type Session } from "@/lib/auth-client"

export const HeaderAuth = ({ user }: { user: Session["user"] | undefined }) => {
  const router = useRouter()
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/sign-in">登录</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">注册</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          aria-label="用户菜单"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || "用户头像"} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        {/* <DropdownMenuItem asChild>
          <Link href="/profile">个人资料</Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem asChild>
          <Link href="/settings">设置</Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/sign-in")
                },
              },
            })
          }}
        >
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
