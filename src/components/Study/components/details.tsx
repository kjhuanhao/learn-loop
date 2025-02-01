import { useState } from "react"
import type { QuestionWithQuestionToGroup } from "@/actions/question"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuestionStore } from "@/stores/questionSlice"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@radix-ui/react-scroll-area"

type DetailsProps = {
  activeQuestionIndex: number
  setActiveQuestionIndex: (index: number) => void
  isLoading: boolean
}

type QuestionProps = {
  question: QuestionWithQuestionToGroup
  setAnswer: (answer: string[] | string) => void
}

export const SingleQuestion = ({ question, setAnswer }: QuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={(value) => {
        setSelectedAnswer(value)
        setAnswer([value])
      }}
      className="space-y-4"
    >
      {question.content?.options.map((option) => (
        <div
          key={option.value}
          onClick={() => {
            setSelectedAnswer(option.value)
            setAnswer([option.value])
          }}
          className="flex  items-center space-x-3 rounded-lg p-4 border hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <RadioGroupItem
            value={option.value}
            id={`${question.id}-${option.value}`}
            className="mt-0.5"
          />
          <Label
            htmlFor={`${question.id}-${option.value}`}
            className="flex-1 cursor-pointer leading-normal"
          >
            {`${option.value}. ${option.label}`}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

const MultipleQuestion = ({ question, setAnswer }: QuestionProps) => {
  // const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  return (
    <div>
      {question.content?.options.map((option, index) => (
        <div className="flex items-center space-x-3 rounded-lg p-4 border hover:bg-muted/50 transition-colors cursor-pointer">
          <Checkbox
            key={index}
            value={option.value}
            onCheckedChange={(checked) => {
              setAnswer(checked ? [option.value] : [])
            }}
          />
          <Label>{`${option.value}. ${option.label}`}</Label>
        </div>
      ))}
    </div>
  )
}

const TextQuestion = ({ question, setAnswer }: QuestionProps) => {
  return <div></div>
}

export const Details = ({
  activeQuestionIndex,
  setActiveQuestionIndex,
  isLoading,
}: DetailsProps) => {
  const [activeTab, setActiveTab] = useState("content")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { questions } = useQuestionStore()
  const [answer, setAnswer] = useState<string[] | string>()
  const handleShowAnswer = () => {
    setActiveTab("correct")
    setIsDialogOpen(false)
  }
  const question = questions[activeQuestionIndex]
  if (!question) return null
  return (
    <div className="w-2/3 border h-[calc(100vh-5rem)] rounded-lg bg-white">
      <Tabs
        className="p-2"
        value={activeTab}
        onValueChange={(value) => {
          if (value === "correct") {
            setIsDialogOpen(true)
            return
          }
          setActiveTab(value)
        }}
      >
        <TabsList>
          <TabsTrigger value="content">题目描述</TabsTrigger>
          <TabsTrigger value="correct">答案</TabsTrigger>
        </TabsList>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>你确定要查看答案吗？</AlertDialogTitle>
              <AlertDialogDescription>
                该行为暂时不会被记录在案
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>我再想想</AlertDialogCancel>
              <AlertDialogAction onClick={handleShowAnswer}>
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <TabsContent className="w-full px-3" value="content">
          <ScrollArea className="h-auto">
            <h2 className="text-2xl font-bold">{question.title}</h2>
            <div className="text-sm text-muted-foreground">
              {question.description}
            </div>
            <div className="py-5">
              {question.type === "single" && (
                <SingleQuestion question={question} setAnswer={setAnswer} />
              )}
              {question.type === "multiple" && (
                <MultipleQuestion question={question} setAnswer={setAnswer} />
              )}
              {question.type === "text" && (
                <TextQuestion question={question} setAnswer={setAnswer} />
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent className="w-full px-3" value="correct">
          {question.type === "single" && <div>{question.content?.correct}</div>}
          {question.type === "multiple" && (
            <div>{question.content?.correct}</div>
          )}
          {question.type === "text" && <div>{question.content?.correct}</div>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
