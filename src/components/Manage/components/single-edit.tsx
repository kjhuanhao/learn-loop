import { forwardRef, useImperativeHandle, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LimitedOption, type QuestionContent } from "@/types/question"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SingleEditModeProps {}

export const SingleEdit = forwardRef<{
  getContent: () => QuestionContent
  setContent: (content: QuestionContent) => void
}>((props, ref) => {
  console.log("SingleEdit rendered, ref:", ref)
  const [options, setOptions] = useState<LimitedOption[]>([
    { value: "A", label: "" },
    { value: "B", label: "" },
    { value: "C", label: "" },
  ])
  const [correctAnswer, setCorrectAnswer] =
    useState<LimitedOption["value"]>("A")
  const { toast } = useToast()

  useImperativeHandle(ref, () => {
    console.log("SingleEdit useImperativeHandle called")
    return {
      getContent: () => {
        return {
          options: options,
          correct: [correctAnswer],
        }
      },
      setContent: (content: QuestionContent) => {
        console.log("SingleEdit setContent called:", content)
        if (content.options) {
          setOptions(content.options)
        }
        if (
          content.correct &&
          Array.isArray(content.correct) &&
          content.correct.length > 0
        ) {
          const answer = content.correct[0] as LimitedOption["value"]
          setCorrectAnswer(answer)
        }
      },
    }
  }, [options, correctAnswer])

  const handleAddOption = () => {
    if (options.length >= 8) {
      toast({
        title: "最多只能添加8个选项（A-H）",
        variant: "destructive",
      })
      return
    }
    const newValue = String.fromCharCode(
      65 + options.length
    ) as LimitedOption["value"]
    setOptions([...options, { value: newValue, label: "" }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    if (correctAnswer === options[index].value) {
      setCorrectAnswer(newOptions[0].value)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index].label = value
    setOptions(newOptions)
  }

  return (
    <div className="w-[750px] h-[350px] space-y-4 p-1">
      <div className="space-y-4">
        <Label>选项</Label>
        <ScrollArea className="h-[250px]">
          <div className="space-y-4 pr-4 mt-1">
            {options.map((option, index) => (
              <div key={option.value} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Label className="w-6">{option.value}.</Label>
                  <Input
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`请输入选项${option.value}`}
                  />
                </div>
                <RadioGroup
                  value={correctAnswer}
                  onValueChange={(value: LimitedOption["value"]) =>
                    setCorrectAnswer(value)
                  }
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`correct-${option.value}`}
                  />
                  <Label htmlFor={`correct-${option.value}`} className="w-16">
                    正确答案
                  </Label>
                </RadioGroup>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 2}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Button
        variant="outline"
        onClick={handleAddOption}
        disabled={options.length >= 8}
        className="w-full"
      >
        {options.length >= 8 ? "已达到最大选项数量" : "添加选项"}
      </Button>
    </div>
  )
})
