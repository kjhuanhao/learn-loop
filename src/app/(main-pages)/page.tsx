"use client"

import { DataPanel } from "@/components/DataPanel"
import { useState } from "react"

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <main className="p-5">
        <DataPanel activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </main>
    </>
  )
}
