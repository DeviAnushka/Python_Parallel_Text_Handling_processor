"use client"

import { useState, useRef, useEffect } from "react"
import AnswerGrid from "../Answer/page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  CheckCircle2, Upload, Zap, Search, BarChart3, 
  Database, Files, X, FolderOpen, FileStack, MailCheck 
} from "lucide-react"

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
  // --- STATE MANAGEMENT ---
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedOps, setSelectedOps] = useState<string[]>([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [wantEmail, setWantEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("Loading...");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Sync user session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    setUserEmail(savedEmail || "Registered Account");
  }, []);

  // --- LOGIC: Bulk File & Folder Merging ---
  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter(f => f.name.endsWith('.csv'));
    if (fileArray.length === 0) {
        alert("Selection error: Only .csv files are supported.");
        return;
    }

    setSelectedFiles(fileArray);
    let rowsCount = 0;
    
    const readFile = (file: File, isFirst: boolean) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          let content = (ev.target?.result as string).trim();
          const lines = content.split(/\r?\n/);
          rowsCount += (lines.length > 0 ? lines.length - 1 : 0); 

          if (!isFirst) {
            content = lines.slice(1).join("\n"); 
          }
          resolve(content);
        };
        reader.readAsText(file);
      });
    };

    const contents = await Promise.all(
        fileArray.map((file, index) => readFile(file, index === 0))
    );
    
    setInputText(contents.join("\n"));
    setTotalRows(rowsCount);
  };

  // --- LOGIC: Parallel Pipeline Execution ---
  const handleRunAll = async () => {
    if (!inputText || selectedOps.length === 0) {
      alert("Validation Error: Please upload data and select at least one operation.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            text: inputText, 
            operations: selectedOps, 
            email: userEmail,
            email_summary: wantEmail,
            filename: selectedFiles.length > 1 ? `Bulk_Merge_${selectedFiles.length}_files.csv` : (selectedFiles[0]?.name || "dataset.csv")
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.results); 
        setStats(data.stats);
        alert("Success: Parallel processing complete. Detailed report archived in Inbox.");
      } else {
        alert(data.error || "Backend Error: Parsing failed.");
      }
    } catch (e) {
      alert("Synchronization Error: Ensure the Python server is active on Port 5001.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC: Global Indexed Search ---
  const handleSearch = async () => {
      if(!searchQuery.trim()) return;
      try {
        const res = await fetch(`http://127.0.0.1:5001/api/search?q=${searchQuery}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (e) {
        alert("Search Service Unavailable.");
      }
  };

  const toggleOperation = (id: string) => {
    setSelectedOps((prev) =>
      prev.includes(id) ? prev.filter((op) => op !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto transition-colors duration-300 bg-transparent">
      
      {/* 1. ANALYTICS METRICS (Milestone 2 & 3 Proof) */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="p-4 border-l-4 border-blue-500 bg-white dark:bg-zinc-900 shadow-sm">
            <Zap className="text-blue-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Data Segments</p>
            <p className="text-2xl font-black dark:text-white">{stats.total_chunks}</p>
          </Card>
          <Card className="p-4 border-l-4 border-green-500 bg-white dark:bg-zinc-900 shadow-sm">
            <BarChart3 className="text-green-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Execution Velocity</p>
            <p className="text-2xl font-black dark:text-white">{stats.processing_time.toFixed(4)}s</p>
          </Card>
          <Card className="p-4 border-l-4 border-red-500 bg-white dark:bg-zinc-900 shadow-sm">
            <CheckCircle2 className="text-red-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">System Status</p>
            <p className="text-2xl font-black dark:text-white">{stats.alert ? "🚨 ATTENTION" : "✅ STABLE"}</p>
          </Card>
        </div>
      )}

      {/* 2. DATASET INGESTION HUB (Bulk & Folder Selection) */}
      <Card className="p-10 border-2 border-dashed border-blue-200 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30 rounded-[2.5rem] text-center space-y-6">
        <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileStack className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Dataset Ingestion Hub</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">Upload multiple CSV files individually or select an entire directory for parallel processing.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
            <input type="file" className="hidden" ref={fileInputRef} multiple accept=".csv" onChange={handleFileSelection} />
            <input type="file" className="hidden" ref={folderInputRef} {...({ webkitdirectory: "", directory: "" } as any)} multiple onChange={handleFileSelection} />

            <Button onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-zinc-700 rounded-2xl px-8 h-14 font-bold active:scale-95 shadow-sm">
                <Files className="mr-2" size={18} /> Select Files
            </Button>
            <Button onClick={() => folderInputRef.current?.click()} className="bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-zinc-700 rounded-2xl h-14 px-8 font-bold active:scale-95 shadow-sm">
                <FolderOpen className="mr-2" size={18} /> Select Folder
            </Button>
        </div>

        <div className="flex justify-center border-t border-blue-100 dark:border-zinc-800 pt-6">
            <label className="flex items-center gap-3 cursor-pointer group bg-white dark:bg-zinc-800 px-6 py-3 rounded-2xl border border-blue-50 dark:border-zinc-800 shadow-sm transition-all hover:border-blue-300">
                <input type="checkbox" className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" checked={wantEmail} onChange={(e) => setWantEmail(e.target.checked)}/>
                <div className="text-left">
                    <p className="text-sm font-bold text-gray-700 dark:text-zinc-200 flex items-center gap-1">
                        <MailCheck size={14} className="text-blue-500"/> Email summary report
                    </p>
                    <p className="text-[10px] text-gray-400 italic font-mono" suppressHydrationWarning>
                        Recipient: {userEmail}
                    </p>
                </div>
            </label>
        </div>

        {selectedFiles.length > 0 && (
            <div className="pt-4 animate-in zoom-in duration-300">
                <div className="inline-flex items-center gap-4 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl">
                    <div className="text-left border-r border-white/20 pr-4">
                        <p className="text-[9px] uppercase font-bold opacity-70">Queued Datasets</p>
                        <p className="text-sm font-black">{selectedFiles.length} Files</p>
                    </div>
                    <div className="text-left pr-2">
                        <p className="text-[9px] uppercase font-bold opacity-70">Total Analysis Scope</p>
                        <p className="text-sm font-black">~{totalRows.toLocaleString()} Records</p>
                    </div>
                    <button onClick={() => {setSelectedFiles([]); setInputText(""); setTotalRows(0);}} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
        )}
      </Card>

      {/* 3. OPERATION CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {operationsList.map((op) => (
          <Card 
            key={op.id} 
            onClick={() => toggleOperation(op.id)}
            className={`p-6 cursor-pointer border-2 transition-all group relative ${
                selectedOps.includes(op.id) 
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/40 shadow-md scale-[1.02]" 
                : "border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-300"
            }`}
          >
            {selectedOps.includes(op.id) && (
                <div className="absolute top-3 right-3 bg-blue-600 rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
            )}
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{op.icon}</div>
            <p className="font-bold text-gray-800 dark:text-zinc-100 text-sm">{op.label}</p>
            <p className="text-[9px] text-gray-400 uppercase mt-1 tracking-tighter">Analysis Module</p>
          </Card>
        ))}
      </div>

      {/* 4. EXECUTION ACTION */}
      <Button 
        onClick={handleRunAll} 
        disabled={isLoading || selectedFiles.length === 0} 
        className="w-full py-9 text-2xl font-black bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all active:scale-[0.98] disabled:opacity-30"
      >
        {isLoading ? "Executing Parallel Logic Pipeline..." : "Initialize High-Speed Analysis"}
      </Button>

      {/* 5. LIVE RESULTS DISPLAY */}
      <div className="animate-in slide-in-from-bottom-5 duration-700">
        <AnswerGrid results={results} />
      </div>

      {/* 6. GLOBAL CONTENT SEARCH (Milestone 4 Proof) */}
      <div className="pt-10 border-t mt-12 bg-gray-50/30 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] border dark:border-zinc-800">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
            <Database className="text-blue-500" /> Global Content Search Engine
        </h2>
        <div className="flex flex-col md:flex-row gap-3 mb-10">
            <Input 
                placeholder="Query millions of indexed historical records instantly..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="h-16 text-lg rounded-2xl border-2 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white px-6" 
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
                size="lg" 
                onClick={handleSearch} 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 h-16 font-bold shadow-xl active:scale-95 transition-all"
            >
                Execute Query
            </Button>
        </div>

        <div className="space-y-4">
            {searchResults.length > 0 ? (
                searchResults.map((r: any) => (
                    <Card key={r.id} className="p-6 border-2 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500 transition-all shadow-sm rounded-2xl">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded">FILE: {r.filename}</span>
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded uppercase">FIELD: {r.column_name}</span>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.sentiment_score > 0 ? 'bg-green-100 text-green-700' : r.sentiment_score < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                                Rule Score: {r.sentiment_score}
                            </span>
                        </div>
                        <p className="text-sm font-mono text-gray-500 dark:text-zinc-400 leading-relaxed italic">
                          "{(r.content || "").replace(/{|}|'/g, "").substring(0, 300)}..."
                        </p>
                    </Card>
                ))
            ) : (
                searchQuery && <div className="text-center py-16 border-2 border-dashed rounded-[2rem] text-gray-400 italic">No records found matching "{searchQuery}" in indexed storage.</div>
            )}
        </div>
      </div>
    </div>
  )
}