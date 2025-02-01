import type { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

type Session = typeof auth.$Infer.Session

export default async function authMiddleware(
  request: NextRequest,
  authPaths: string[]
) {
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    )

    const pathname = request.nextUrl.pathname
    const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

    if (response.ok) {
      const session: Session = await response.json()

      if (session && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      return NextResponse.next()
    }

    if (!response.ok) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
}
