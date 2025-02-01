import { NextResponse, type NextRequest } from "next/server"
import authMiddleware from "./utils/authMiddleware"

const publicPaths = ["/auth/signin", "/api/auth"]
const authPaths = ["/sign-in", "/sign-up", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  return authMiddleware(request, authPaths)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
