"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Search, 
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

const technicalGuides = [
  {
    title: "Parallel Processing Engine",
    desc: "The system utilizes Python's ThreadPoolExecutor to segment datasets into manageable chunks. These segments are processed across multiple CPU threads simultaneously, significantly reducing execution time for large-scale data sets.",
    icon: <Zap className="text-yellow-500" />
  },
  {
    title: "Weighted Rule-Based Scorer",
    desc: "A custom algorithmic approach that maps textual patterns to numerical weights. The engine identifies industry-specific growth indicators and risk factors to generate a data-backed Sentiment Index instead of subjective opinion scores.",
    icon: <ShieldCheck className="text-green-500" />
  },
  {
    title: "Indexed Search & Retrieval",
    desc: "Utilizes SQL B-Tree Indexing within the persistent storage layer. This ensures that historical queries across analyzed records remain high-performance, providing sub-millisecond retrieval speeds regardless of database volume.",
    icon: <Search className="text-blue-500" />
  }
]

export default function DocumentationPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <Link href="/Content/Help" className="text-blue-600 flex items-center gap-1 hover:underline text-sm font-bold">
        <ArrowLeft size={14}/> Return to User Guide
      </Link>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100">
          <BookOpen className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Developer Documentation</h1>
          <p className="text-gray-500 italic">Exploring the analytics engine architecture and logic layers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-6">
        {technicalGuides.map((item, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-md p-8 bg-white flex gap-8 items-center group hover:shadow-lg transition-all">
            <div className="p-5 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
            <div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-10 text-gray-300 text-xs font-mono">
        SYSTEM DOCUMENTATION V1.0 // ALL MODULES SYNCHRONIZED
      </div>
    </div>
  )
}