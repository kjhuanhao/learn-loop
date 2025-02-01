"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const cards = [
  { id: 1, color: "bg-rose-500", content: "Card 1 Content" },
  { id: 2, color: "bg-blue-500", content: "Card 2 Content" },
  { id: 3, color: "bg-emerald-500", content: "Card 3 Content" },
]
const cardVariants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 180 : -180,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    rotateY: direction < 0 ? 180 : -180,
    opacity: 0,
    scale: 0.8,
  }),
}
export const QuestionGroupDataPanel = () => {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0])

  const swipeThreshold = 100
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-96 h-96 perspective-1000">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={cards[activeIndex].id}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -swipeThreshold) {
                setActiveIndex([(activeIndex + 1) % cards.length, 1])
              } else if (swipe > swipeThreshold) {
                setActiveIndex([
                  (activeIndex - 1 + cards.length) % cards.length,
                  -1,
                ])
              }
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`absolute w-full h-full rounded-xl p-8
              ${cards[activeIndex].color} text-white text-2xl
              cursor-grab active:cursor-grabbing`}
            style={{ touchAction: "none" }}
          >
            {cards[activeIndex].content}
          </motion.div>
        </AnimatePresence>

        {/* 动态指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-white/30"
              animate={{ scale: i === activeIndex ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
