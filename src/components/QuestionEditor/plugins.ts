import { Extension } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Blockquote from "@tiptap/extension-blockquote"
import BulletList from "@tiptap/extension-bullet-list"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { Plugin } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { all, createLowlight } from "lowlight"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { InputRule } from "@tiptap/core"
import Placeholder from "@tiptap/extension-placeholder"
import Heading from "@tiptap/extension-heading"

// 配置代码高亮
const lowlight = createLowlight(all)
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

// 表格粘贴插件
const pasteTablePlugin = new Plugin({
  props: {
    handlePaste: (view: EditorView, event: ClipboardEvent) => {
      if (!event.clipboardData) return false

      const text = event.clipboardData.getData("text/plain")
      const lines = text
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line)

      const isMarkdownTable = lines.some((line: string) => line.includes("|"))
      if (!isMarkdownTable) return false

      // 过滤掉分隔行（包含 ----- 的行）
      const tableData = lines
        .filter((line: string) => !line.match(/^\|[\s-|]+\|$/))
        .map((line: string) => {
          return line
            .split("|")
            .map((cell: string) => cell.trim())
            .filter((cell: string) => cell)
        })

      if (tableData.length === 0) return false

      const schema = view.state.schema
      const rows = []

      for (let i = 0; i < tableData.length; i++) {
        const cells = []
        const isHeader = i === 0

        for (let j = 0; j < tableData[i].length; j++) {
          const cellType = isHeader
            ? schema.nodes.tableHeader
            : schema.nodes.tableCell
          const cell = cellType.createAndFill(
            {},
            schema.nodes.paragraph.create({}, schema.text(tableData[i][j]))
          )
          if (cell) cells.push(cell)
        }

        if (cells.length > 0) {
          rows.push(schema.nodes.tableRow.create({}, cells))
        }
      }

      if (rows.length === 0) return false

      const table = schema.nodes.table.create({}, rows)
      const tr = view.state.tr.replaceSelectionWith(table)
      view.dispatch(tr)

      return true
    },
  },
})

const PasteTableExtension = Extension.create({
  name: "pasteTable",
  addProseMirrorPlugins() {
    return [pasteTablePlugin]
  },
})

const imageInputRule = new InputRule({
  find: /!\[(.+|.*?)]\((.+|.*?)\)/,
  handler: ({ state, match, chain }) => {
    const [, alt, src] = match
    console.log(match)

    if (src) {
      chain()
        .insertContent({
          type: "image",
          attrs: {
            src: src.trim(),
            alt: (alt || "").trim(),
          },
        })
        .run()
    }
  },
})

const ImageExtension = Image.extend({
  addInputRules() {
    return [imageInputRule]
  },
})

// 导出编辑器插件配置
export const editorExtensions = [
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4, 5],
  }),
  StarterKit.configure({
    document: false,
    paragraph: false,
    text: false,
    blockquote: false,
    bulletList: false,
    codeBlock: false,
    horizontalRule: false,
    orderedList: false,
    listItem: false,
    heading: false,
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: "border-l-4 border-gray-300 pl-4",
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc list-outside",
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class: "rounded-md bg-gray-200 p-4",
    },
  }),
  HorizontalRule,
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal list-outside ml-2",
    },
  }),
  ListItem,
  Table.configure({
    resizable: false,
    HTMLAttributes: {
      class: "border-collapse table-auto w-full my-4",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border-b border-gray-200",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class:
        "border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-300 px-4 py-2 text-left",
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2",
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: "flex gap-2 items-start",
    },
  }),
  ImageExtension.configure({
    HTMLAttributes: {
      class: "rounded-lg max-w-full h-auto my-4",
      loading: "lazy",
    },
    allowBase64: true,
  }),
  PasteTableExtension,
  Placeholder.configure({
    placeholder: "请输入内容...",
    emptyEditorClass:
      "before:content-[attr(data-placeholder)] before:float-left before:text-slate-400 before:pointer-events-none before:h-0",
  }),
]
