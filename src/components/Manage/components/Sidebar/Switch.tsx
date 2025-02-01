"use client"

import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

interface SwitchProps {
  active: "folder" | "group"
  setActive: (active: "folder" | "group") => void
}

export const Switch = ({ active, setActive }: SwitchProps) => {
  return (
    <div className="flex items-center justify-center gap-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="w-1/2"
      >
        <Button
          variant={active === "folder" ? "default" : "outline"}
          onClick={() => setActive("folder")}
          className="w-full"
          aria-label="切换到文件夹视图"
        >
          文件夹
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="w-1/2"
      >
        <Button
          variant={active === "group" ? "default" : "outline"}
          onClick={() => setActive("group")}
          className="w-full"
          aria-label="切换到计划题组视图"
        >
          计划题组
        </Button>
      </motion.div>
    </div>
  )
}
