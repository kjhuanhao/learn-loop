"use client"

import { z } from "zod"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const signInSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
})

type SignInForm = z.infer<typeof signInSchema>
type SignInErrors = Partial<Record<keyof SignInForm | "submit", string>>

export default function Login() {
  const { toast } = useToast()
  const router = useRouter()
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<SignInErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (field: keyof SignInForm, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      return false
    }
    try {
      signInSchema.shape[field].parse(value)
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
    (field: keyof SignInForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
      if (value) {
        validateField(field, value)
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSignIn = async () => {
    // 验证所有字段
    let hasErrors = false
    Object.entries(form).forEach(([field, value]) => {
      if (!validateField(field as keyof SignInForm, value)) {
        hasErrors = true
      }
    })

    if (hasErrors) return

    try {
      const { data, error } = await authClient.signIn.email(
        {
          email: form.email,
          password: form.password,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setIsLoading(false)
            router.push("/") // 登录成功后跳转到首页
          },
          onError: (ctx) => {
            setIsLoading(false)

            if (ctx.error.status === 403) {
              toast({
                title: "请先验证您的邮箱地址",
                description: "请先验证您的邮箱地址",
              })
            } else {
              setErrors((prev) => ({ ...prev, submit: ctx.error.message }))
            }
          },
        }
      )

      if (error) {
        setErrors((prev) => ({ ...prev, submit: error.message }))
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "登录过程中发生错误，请稍后重试",
      }))
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">登录</h1>
      <p className="text-sm text-foreground">
        还没有账号？{" "}
        <Link className="text-primary font-medium underline" href="/sign-up">
          注册
        </Link>
      </p>
      <div className="flex flex-col gap-2 mt-8">
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
          <div className="flex justify-between items-center">
            <Label htmlFor="password">密码</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              忘记密码？
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="输入密码"
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
          className="mt-4"
          disabled={isLoading}
          onClick={handleSignIn}
        >
          {isLoading ? "登录中..." : "登录"}
        </SubmitButton>
      </div>
    </div>
  )
}
