import { questionGroup } from "@/database/schema"
import { db } from "@/utils/db"
import { NextResponse, type NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const res = await db.insert(questionGroup).values(body)
  return NextResponse.json({ message: "Hello World", data: res })
}

export const GET = async (req: NextRequest) => {
  const res = await db.select().from(questionGroup)
  return NextResponse.json({ message: "Hello World", data: res })
}
