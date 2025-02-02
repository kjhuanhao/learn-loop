"use server"

import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { HeaderAuth } from "@/components/Header/header-auth"
import { LearnButton } from "./learn-button"

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Learn Loop</h1>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other elements here */}
          </div>
          <nav className="flex items-center space-x-2">
            {/* <ThemeSwitcher /> */}
            <LearnButton />
            <HeaderAuth user={user} />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
