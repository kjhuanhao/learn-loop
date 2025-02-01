"use client"

import { Input } from "@/components/ui/input"

interface SearchProps {
  value: string
  onChange: (value: string) => void
}

export const Search = ({ value, onChange }: SearchProps) => {
  return (
    <Input
      placeholder="搜索"
      className="w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
