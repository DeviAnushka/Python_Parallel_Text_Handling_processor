"use client"
import { Card } from "@/components/ui/card"
import { Copy, CheckCircle } from "lucide-react"

const AnswerCard = ({ result }: any) => {
  return (
    <Card className="relative p-6 rounded-2xl border shadow-sm h-full">
      <button
        onClick={() => navigator.clipboard.writeText(result.output)}
        className="absolute top-3 right-3 text-gray-400 hover:text-blue-600"
      >
        <Copy className="w-4 h-4" />
      </button>

      <h3 className="font-bold text-gray-900 mb-3">{result.title}</h3>
      
      {/* Ensure ONLY result.output is here. REMOVE ANY EXTRA <p> TAGS */}
      <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
        {result.output}
      </div>

      <div className="absolute bottom-3 right-3">
        <CheckCircle className="text-green-500 w-5 h-5" />
      </div>
    </Card>
  )
}

export default AnswerCard