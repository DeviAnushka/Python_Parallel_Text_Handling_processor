"use client"

import { Card } from "@/components/ui/card"
import { Copy, CheckCircle } from "lucide-react"

const AnswerCard = ({ result }: any) => {
  return (
    <Card className="relative p-6 rounded-2xl">
      <button
        onClick={() => navigator.clipboard.writeText(result.output)}
        className="absolute top-3 right-3 text-gray-500 hover:text-blue-600"
      >
        <Copy className="w-4 h-4" />
      </button>

      <h3 className="font-semibold mb-2">{result.title}</h3>
      // Find the  tag and update the className
      <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap break-words overflow-y-auto max-h-60 custom-scrollbar">{result.output}
</p>
      {result.success && (
        <CheckCircle className="absolute bottom-3 right-3 text-green-500 w-5 h-5" />
      )}
    </Card>
  )
}

export default AnswerCard
