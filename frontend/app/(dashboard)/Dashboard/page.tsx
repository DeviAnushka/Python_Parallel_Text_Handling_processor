"use client"
import { useState } from "react"
import AnswerGrid from "../Answer/page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Upload, Zap, Search, BarChart3, Database } from "lucide-react"

const operationsList = [
  { id: "Summarization", label: "Summarization", icon: "📄" },
  { id: "Translation", label: "Translation", icon: "🌐" },
  { id: "Keyword Extraction", label: "Keyword Extraction", icon: "🔑" },
  { id: "Sentiment Analysis", label: "Sentiment Analysis", icon: "❤️" },
  { id: "Grammar Correction", label: "Grammar Correction", icon: "✅" },
  { id: "Spell Check", label: "Spell Check", icon: "A" },
  { id: "Remove Stop Words", label: "Remove Stop Words", icon: "⏳" },
  { id: "Convert Case", label: "Convert Case", icon: "T" },
]

export default function DashboardPage() {
  const [inputText, setInputText] = useState("");
  const [selectedOps, setSelectedOps] = useState<string[]>([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleRunAll = async () => {
    if (!inputText || selectedOps.length === 0) return alert("Select operations and upload a file.");
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, operations: selectedOps, email: localStorage.getItem("userEmail") || "Guest", filename: fileName }),
      });
      const data = await res.json();
      setResults(data.results); setStats(data.stats);
      alert("Analysis successful! Detailed report archived in Inbox.");
    } catch (e) { alert("Backend Error"); }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    const res = await fetch(`http://127.0.0.1:5001/api/search?q=${searchQuery}`);
    setSearchResults(await res.json());
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {stats && (
        <div className="grid grid-cols-3 gap-6 animate-in fade-in">
          <Card className="p-4 border-l-4 border-blue-500 bg-white shadow-sm">
            <Zap className="text-blue-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Data Segments</p>
            <p className="text-2xl font-bold">{stats.total_chunks}</p>
          </Card>
          <Card className="p-4 border-l-4 border-green-500 bg-white shadow-sm">
            <BarChart3 className="text-green-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Execution Velocity</p>
            <p className="text-2xl font-bold">{stats.processing_time.toFixed(4)}s</p>
          </Card>
          <Card className="p-4 border-l-4 border-red-500 bg-white shadow-sm">
            <CheckCircle2 className="text-red-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">System Status</p>
            <p className="text-2xl font-bold">{stats.alert ? "🚨 ATTENTION" : "✅ STABLE"}</p>
          </Card>
        </div>
      )}

      <Card className="p-12 border-2 border-dashed text-center bg-gray-50/50 hover:border-blue-400 cursor-pointer rounded-2xl" onClick={() => document.getElementById('fileIn')?.click()}>
        <input type="file" className="hidden" id="fileIn" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) { setFileName(f.name); const r = new FileReader(); r.onload = (ev) => setInputText(ev.target?.result as string); r.readAsText(f); }
        }} />
        <Upload className="mx-auto mb-3 text-blue-500" size={32} />
        <h3 className="font-bold text-gray-700 text-lg">{fileName || "Load External Dataset"}</h3>
        <p className="text-xs text-gray-400 mt-1">Multi-core parallel processing enabled</p>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {operationsList.map((op) => (
          <Card key={op.id} onClick={() => setSelectedOps(prev => prev.includes(op.id) ? prev.filter(i => i !== op.id) : [...prev, op.id])}
            className={`p-6 cursor-pointer border-2 transition-all group ${selectedOps.includes(op.id) ? "border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]" : "border-gray-100 hover:border-blue-200"}`}>
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{op.icon}</div>
            <p className="font-bold text-gray-800 text-sm">{op.label}</p>
          </Card>
        ))}
      </div>

      <Button onClick={handleRunAll} disabled={isLoading} className="w-full py-8 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg">
        {isLoading ? "Synchronizing Parallel Pipeline..." : "Initialize High-Speed Analysis"}
      </Button>

      <div className="animate-in slide-in-from-bottom-4 duration-700">
        <AnswerGrid results={results} />
      </div>

      <div className="pt-10 border-t mt-12 bg-gray-50/30 p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800"><Database className="text-blue-500" /> Global Content Search</h2>
        <div className="flex gap-3 mb-8">
            <Input placeholder="Search through millions of records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 text-lg rounded-2xl border-2 bg-white" onKeyDown={(e) => e.key === 'Enter' && handleSearch()}/>
            <Button size="lg" onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 h-14 font-bold shadow-md transition-all active:scale-95">Search Database</Button>
        </div>
        <div className="space-y-4">
            {searchResults.map((r: any) => (
                <Card key={r.id} className="p-6 border-2 border-gray-100 bg-white hover:border-blue-500 transition-all shadow-sm rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">RECORD ID: {r.id}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.score > 0 ? 'bg-green-100 text-green-700' : r.score < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>Score: {r.score}</span>
                    </div>
                    <p className="text-sm font-mono text-gray-500 leading-relaxed italic">"{r.content.replace(/{|}|'/g, "").substring(0, 300)}..."</p>
                </Card>
            ))}
        </div>
      </div>
    </div>
  )
}