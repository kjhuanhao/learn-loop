import { type LLMOutputComponent } from "@llm-ui/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const MarkdownComponent: LLMOutputComponent = ({ blockMatch }) => {
  const markdown = blockMatch.output
  return (
    <ReactMarkdown className={"markdown"} remarkPlugins={[remarkGfm]}>
      {markdown}
    </ReactMarkdown>
  )
}
