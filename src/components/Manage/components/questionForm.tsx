"use client"

import { QuestionEditor } from "@/components/QuestionEditor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Folder } from "@/types/folder"
import type { EditRef } from "@/types/question"
import { MultipleEdit } from "./multipleEdit"
import { SingleEdit } from "./singleEdit"
import { useEffect, useState } from "react"

interface QuestionFormProps {
  title: string
  selectedType: string
  isAnswer: boolean
  textContent: string
  textAnswer: string
  editorContentRef: any
  editorAnswerRef: any
  singleEditRef: React.RefObject<EditRef | null>
  multipleEditRef: React.RefObject<EditRef | null>
  onTitleChange: (value: string) => void
  handleEditorSwitch: (value: boolean) => void
  folders: Folder[]
  selectedFolderId: string
  setSelectedFolderId: (value: string) => void
}

const SwitchButton = ({
  isAnswer,
  onChange,
}: {
  isAnswer: boolean
  onChange: (value: boolean) => void
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Switch id="answerOption" checked={isAnswer} onCheckedChange={onChange} />
      <Label htmlFor="answerOption">答案</Label>
    </div>
  )
}

export const QuestionForm = ({
  title,
  selectedType,
  isAnswer,
  textContent,
  textAnswer,
  editorContentRef,
  editorAnswerRef,
  singleEditRef,
  multipleEditRef,
  onTitleChange,
  handleEditorSwitch,
  folders = [],
  selectedFolderId,
  setSelectedFolderId,
}: QuestionFormProps) => {
  return (
    <div className="overflow-hidden flex flex-col">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="请输入题目名称"
          className="flex-1 h-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          value={title}
          onChange={(e) => {
            onTitleChange(e.target.value)
          }}
        />
        {folders.length > 0 && (
          <Select
            value={selectedFolderId}
            onValueChange={(value) => {
              setSelectedFolderId(value)
            }}
          >
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0 focus:outline-none">
              <SelectValue placeholder="选择文件夹" />
            </SelectTrigger>
            <SelectContent>
              {folders
                .filter((folder) => folder.id && folder.id.trim() !== "")
                .map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {selectedType === "SINGLE" && <SingleEdit ref={singleEditRef} />}
      {selectedType === "MULTIPLE" && <MultipleEdit ref={multipleEditRef} />}
      {selectedType === "TEXT" && (
        <div>
          <QuestionEditor
            maxWidth={750}
            ref={editorContentRef}
            content={textContent}
            className={isAnswer ? "hidden" : ""}
            switchComponent={
              <SwitchButton isAnswer={isAnswer} onChange={handleEditorSwitch} />
            }
          />
          <QuestionEditor
            maxWidth={750}
            ref={editorAnswerRef}
            content={textAnswer}
            className={!isAnswer ? "hidden" : ""}
            switchComponent={
              <SwitchButton isAnswer={isAnswer} onChange={handleEditorSwitch} />
            }
          />
        </div>
      )}
    </div>
  )
}
