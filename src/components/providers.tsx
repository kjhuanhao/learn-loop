"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useInitApplication } from "@/hooks/use-init"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000, // 5 秒
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <InitWrapper>{children}</InitWrapper>
    </QueryClientProvider>
  )
}

function InitWrapper({ children }: { children: React.ReactNode }) {
  useInitApplication()
  return <>{children}</>
}
