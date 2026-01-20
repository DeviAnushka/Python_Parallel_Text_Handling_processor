"use client"
import { Card } from "@/components/ui/card"
import { Copy, CheckCircle } from "lucide-react"

const AnswerCard = ({ result }: any) => {
  return (
    <Card className="relative p-6 rounded-2xl border shadow-sm flex flex-col h-[350px] bg-white dark:bg-zinc-900 overflow-hidden">
      <button
        onClick={() => navigator.clipboard.writeText(result.output)}
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Copy size={16} />
      </button>

      <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <CheckCircle size={16} className="text-green-500" />
        {result.title}
      </h3>
      
      {/* SCROLLABLE AREA: Handles large text and long lines */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words font-mono">
          {result.output}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Process Verified</span>
      </div>
    </Card>
  )
}

export default AnswerCard