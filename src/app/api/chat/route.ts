import { streamText } from "ai"
import { createDeepSeek } from "@ai-sdk/deepseek"

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.siliconflow.cn/v1",
})

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: deepseek("deepseek-ai/DeepSeek-V3", {}),
    messages,
  })

  return result.toDataStreamResponse()
}
