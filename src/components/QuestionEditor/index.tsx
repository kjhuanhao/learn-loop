"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { editorExtensions } from "./plugins"
import { useImperativeHandle, useEffect } from "react"
import TurndownService from "turndown"

const turndownService = new TurndownService()

interface ToolbarButtonProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  children: React.ReactNode
  label: string
}

const ToolbarButton = ({
  onClick,
  disabled,
  active,
  children,
  label,
}: ToolbarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 p-1 hover:bg-slate-100 ${
        active ? "bg-slate-100 text-slate-900" : "text-slate-600"
      }`}
      aria-label={label}
    >
      {children}
    </Button>
  )
}

interface QuestionEditorProps {
  content: string
  className?: string
  maxHeight?: number
  switchComponent?: React.ReactNode
  maxWidth?: number
  ref?: React.RefObject<QuestionEditorRef | null>
}

export type QuestionEditorRef = {
  getMarkdown: () => string | undefined
  getHTML: () => string | undefined
}

export function QuestionEditor({
  className,
  maxHeight = 350,
  maxWidth,
  switchComponent,
  ref,
  content,
}: QuestionEditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: content,
    autofocus: "start",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base focus:outline-none h-full max-w-none break-words",
      },
    },
  })

  useEffect(() => {
    console.log(content, "切换content")

    if (editor) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useImperativeHandle(ref, () => {
    return {
      getMarkdown: () => {
        if (!editor) return undefined
        const html = editor.getHTML()
        return turndownService.turndown(html)
      },
      getHTML: () => {
        if (!editor) return undefined
        console.log(editor.getHTML(), "editor.getHTML()")

        return editor.getHTML()
      },
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div
      className={cn("w-full rounded-lg border border-slate-200", className)}
      style={{ maxWidth: maxWidth || "100%" }}
    >
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2 bg-white sticky top-0 z-10">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="加粗"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="斜体"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="无序列表"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="引用"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="ml-auto flex gap-1">
          {switchComponent}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            label="撤销"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            label="重做"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <div
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300"
        style={{ height: maxHeight }}
      >
        <div className="p-4 h-full">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  )
}
