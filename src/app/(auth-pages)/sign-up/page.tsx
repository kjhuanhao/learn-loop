"use client"

import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SmtpMessage } from "@/components/smtp-message"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const signUpSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少需要8个字符"),
  // .regex(/[A-Z]/, "密码需要包含至少一个大写字母")
  // .regex(/[a-z]/, "密码需要包含至少一个小写字母")
  // .regex(/[0-9]/, "密码需要包含至少一个数字")
  // .regex(/[^A-Za-z0-9]/, "密码需要包含至少一个特殊字符"),
  name: z
    .string()
    .min(2, "名字至少需要2个字符")
    .max(50, "名字不能超过50个字符"),
})

// 生成默认头像的函数
const generateDefaultAvatar = (name: string) => {
  // 使用 DiceBear API 生成头像
  // 这里使用 avataaars 风格，也可以换成其他风格如 bottts, pixel-art 等
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=random`
}

type SignUpForm = z.infer<typeof signUpSchema>
type SignUpErrors = Partial<Record<keyof SignUpForm | "submit", string>>

export default function Signup() {
  const { toast } = useToast()

  const router = useRouter()
  const [form, setForm] = useState<SignUpForm>({
    email: "",
    password: "",
    name: "",
  })
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (field: keyof SignUpForm, value: string) => {
    try {
      signUpSchema.shape[field].parse(value)
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }))
      }
      return false
    }
  }

  const handleInputChange =
    (field: keyof SignUpForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
      validateField(field, value)
    }

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // 验证所有字段
    let hasErrors = false
    Object.entries(form).forEach(([field, value]) => {
      if (!validateField(field as keyof SignUpForm, value)) {
        hasErrors = true
      }
    })

    if (hasErrors) return

    try {
      setIsLoading(true)
      const { data, error } = await authClient.signUp.email(
        {
          email: form.email,
          password: form.password,
          name: form.name,
          image: generateDefaultAvatar(form.name),
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setIsLoading(false)
            toast({
              title: "注册成功",
              description: "验证邮件已发送到您的邮箱，请查收并点击验证链接。",
            })
            router.push("/sign-in") // 注册成功后跳转到登录页
          },
          onError: (ctx) => {
            setIsLoading(false)
            setErrors((prev) => ({ ...prev, submit: ctx.error.message }))
          },
        }
      )

      if (error) {
        setErrors((prev) => ({ ...prev, submit: error.message }))
        setIsLoading(false)
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "注册过程中发生错误，请稍后重试",
      }))
      setIsLoading(false)
    }
  }

  const hasValidationErrors = Object.values(errors).some(
    (error) => error !== undefined
  )

  return (
    <>
      <div className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">注册账号</h1>
        <p className="text-sm text text-foreground">
          已有账号？{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            登录
          </Link>
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2 mt-8"
        >
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading}
              value={form.email}
              onChange={handleInputChange("email")}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="你的名字"
              required
              disabled={isLoading}
              value={form.name}
              onChange={handleInputChange("name")}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="设置密码"
              required
              disabled={isLoading}
              value={form.password}
              onChange={handleInputChange("password")}
              className={cn(errors.password && "border-destructive")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive mt-2">{errors.submit}</p>
          )}

          <SubmitButton
            type="button"
            className="mt-4"
            disabled={isLoading || hasValidationErrors}
            onClick={handleSignUp}
          >
            {isLoading ? "注册中..." : "注册"}
          </SubmitButton>
        </form>
      </div>
      <SmtpMessage />
    </>
  )
}
