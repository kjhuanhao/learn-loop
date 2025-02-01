import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (url: string, email: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Learn Loop <onboarding@resend.dev>",
      to: email,
      subject: "验证您的邮箱地址",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">验证您的邮箱地址</h1>
          <p>感谢您的注册！请点击下面的链接验证您的邮箱地址：</p>
          <a
            href="${url}"
            style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;"
          >
            验证邮箱
          </a>
          <p>如果您没有注册账号，请忽略此邮件。</p>
          <p>此链接将在24小时后失效。</p>
        </div>
      `,
    })

    if (error) {
      console.error("发送邮件失败:", error)
      return { success: false, error }
    }
    console.log("发送邮件成功:", data)

    return { success: true, data }
  } catch (error) {
    console.error("发送邮件失败:", error)
    return { success: false, error }
  }
}
