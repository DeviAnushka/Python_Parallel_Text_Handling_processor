"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  FileText,
  Languages,
  Key,
  Heart,
  CheckCircle,
  SpellCheck,
  Filter,
  Type,
  Check
} from "lucide-react"

const operations = [
  { title: "Summarization", icon: FileText },
  { title: "Translation", icon: Languages },
  { title: "Keyword Extraction", icon: Key },
  { title: "Sentiment Analysis", icon: Heart },
  { title: "Grammar Correction", icon: CheckCircle },
  { title: "Spell Check", icon: SpellCheck },
  { title: "Remove Stop Words", icon: Filter },
  { title: "Convert Case", icon: Type },
]

const QuestionAskingButtons = () => {
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelect = (title: string) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {operations.map((op) => {
        const Icon = op.icon
        const isSelected = selected.includes(op.title)

        return (
          <Card
            key={op.title}
            onClick={() => toggleSelect(op.title)}
            className={`
              relative p-6 cursor-pointer rounded-2xl
              transition-all duration-300
              hover:shadow-lg hover:-translate-y-1
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            {/* Tick Button */}
            <div
              className={`
                absolute top-3 right-3 w-7 h-7 rounded-full
                flex items-center justify-center
                transition-all
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-transparent"
                }
              `}
            >
              <Check className="w-4 h-4" />
            </div>

            {/* Icon */}
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-800">
              {op.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Click to select
            </p>
          </Card>
        )
      })}
    </div>
  )
}

export default QuestionAskingButtons
