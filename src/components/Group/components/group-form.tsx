"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { CirclePlus, X } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "题组名称不能为空"),
  description: z.string().min(1, "题组描述不能为空"),
  tag: z.array(z.string()).max(5, "最多只能添加5个标签"),
})

interface GroupFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  submitText: string
  onSubmit: (data: { name: string; description: string; tag: string[] }) => void
  isLoading?: boolean
  initialValue?: {
    name: string
    description?: string
    tag: string[]
  } | null
}

export const GroupForm = ({
  open,
  onOpenChange,
  title,
  description,
  submitText,
  onSubmit,
  isLoading,
  initialValue,
}: GroupFormProps) => {
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tag: [],
    },
  })

  useEffect(() => {
    if (initialValue) {
      form.reset({
        name: initialValue.name,
        description: initialValue.description || "",
        tag: initialValue.tag,
      })
    }
  }, [initialValue, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      tag: values.tag.map((tag) => tag.trim()),
    })
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (!trimmedTag) return

    const currentTags = form.getValues("tag")
    if (currentTags.length >= 5) {
      toast({
        title: "无法添加更多标签",
        description: "最多只能添加5个标签",
        variant: "destructive",
      })
      return
    }

    if (currentTags.includes(trimmedTag)) {
      toast({
        title: "标签已存在",
        description: "请勿添加重复的标签",
        variant: "warning",
      })
      return
    }

    form.setValue("tag", [...currentTags, trimmedTag])
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tag")
    form.setValue(
      "tag",
      currentTags.filter((tag) => tag !== tagToRemove)
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>题组名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入题组名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>题组描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入题组描述"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={() => (
                <FormItem>
                  <FormLabel>标签</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="输入标签并按回车添加（最多5个）"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />

                        <CirclePlus
                          className="w-6 h-6 cursor-pointer text-muted-foreground hover:text-primary ml-2"
                          onClick={handleAddTag}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("tag").map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
