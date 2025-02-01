import Header from "@/components/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <Header />
      </nav>
      <div>{children}</div>
    </div>
  )
}
