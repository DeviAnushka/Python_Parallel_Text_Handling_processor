"use client"
import { useState, useRef, useEffect } from "react"
import AnswerGrid from "../Answer/page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Zap, Search, BarChart3, Database, Files, X, FolderOpen, FileStack, MailCheck } from "lucide-react"

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

  // Load user email from storage on mount (Fixes Hydration Error)
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    setUserEmail(savedEmail || "Guest User");
  }, []);

  // --- LOGIC: Select/Deselect Cards (FIXES YOUR ERROR) ---
  const toggleOperation = (id: string) => {
    setSelectedOps((prev) =>
      prev.includes(id) ? prev.filter((op) => op !== id) : [...prev, id]
    );
  };

  // --- LOGIC: Process Multiple Files / Folders ---
  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter(f => f.name.endsWith('.csv'));
    if (fileArray.length === 0) {
        alert("No valid CSV files found.");
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

  const handleRunAll = async () => {
    if (!inputText || selectedOps.length === 0) return alert("Please upload data and select operations.");
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
            filename: selectedFiles.length > 1 ? `Bulk_Package_${selectedFiles.length}_items.csv` : (selectedFiles[0]?.name || "dataset.csv")
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results); 
        setStats(data.stats);
        alert("Analysis complete! Details archived in Inbox.");
      }
    } catch (e) { alert("Backend Error"); }
    setIsLoading(false);
  };

  const handleSearch = async () => {
      if(!searchQuery.trim()) return;
      try {
        const res = await fetch(`http://127.0.0.1:5001/api/search?q=${searchQuery}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (e) { alert("Search failed."); }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* 1. PERFORMANCE METRICS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          <Card className="p-4 border-l-4 border-blue-500 bg-white dark:bg-zinc-900 shadow-sm transition-colors">
            <Zap className="text-blue-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Data Segments</p>
            <p className="text-2xl font-bold dark:text-white">{stats.total_chunks}</p>
          </Card>
          <Card className="p-4 border-l-4 border-green-500 bg-white dark:bg-zinc-900 shadow-sm transition-colors">
            <BarChart3 className="text-green-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Execution Velocity</p>
            <p className="text-2xl font-bold dark:text-white">{stats.processing_time.toFixed(4)}s</p>
          </Card>
          <Card className="p-4 border-l-4 border-red-500 bg-white dark:bg-zinc-900 shadow-sm transition-colors">
            <CheckCircle2 className="text-red-500 mb-1" size={18} />
            <p className="text-[10px] text-gray-400 uppercase font-bold">System Status</p>
            <p className="text-2xl font-bold dark:text-white">{stats.alert ? "🚨 ATTENTION" : "✅ STABLE"}</p>
          </Card>
        </div>
      )}

      {/* 2. UPLOAD HUB */}
      <Card className="p-10 border-2 border-dashed border-blue-200 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30 rounded-[2.5rem] text-center space-y-6">
        <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileStack className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">Dataset Ingestion Hub</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">Upload multiple CSV files or an entire folder.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
            <input type="file" className="hidden" ref={fileInputRef} multiple accept=".csv" onChange={handleFileSelection} />
            <input type="file" className="hidden" ref={folderInputRef} {...({ webkitdirectory: "", directory: "" } as any)} multiple onChange={handleFileSelection} />

            <Button onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-zinc-800 text-blue-600 border-blue-200 dark:border-zinc-700 rounded-2xl h-14 px-8 font-bold active:scale-95 shadow-sm">
                <Files className="mr-2" size={18} /> Select Files
            </Button>
            <Button onClick={() => folderInputRef.current?.click()} className="bg-white dark:bg-zinc-800 text-purple-600 border-purple-200 dark:border-zinc-700 rounded-2xl h-14 px-8 font-bold active:scale-95 shadow-sm">
                <FolderOpen className="mr-2" size={18} /> Select Folder
            </Button>
        </div>

        <div className="flex justify-center border-t border-blue-100 dark:border-zinc-800 pt-6">
            <label className="flex items-center gap-3 cursor-pointer group bg-white dark:bg-zinc-800 px-6 py-3 rounded-2xl border border-blue-50 shadow-sm transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-blue-300 text-blue-600" checked={wantEmail} onChange={(e) => setWantEmail(e.target.checked)}/>
                <div className="text-left">
                    <p className="text-sm font-bold text-gray-700 dark:text-white flex items-center gap-1">
                        <MailCheck size={14} className="text-blue-500"/> Email summary after completion
                    </p>
                    <p className="text-[10px] text-gray-400 italic font-mono" suppressHydrationWarning>
                        Recipient: {userEmail}
                    </p>
                </div>
            </label>
        </div>

        {selectedFiles.length > 0 && (
            <div className="pt-2 animate-in zoom-in"><div className="inline-flex items-center gap-4 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg"><div className="text-left border-r border-white/20 pr-4"><p className="text-[9px] uppercase font-bold opacity-70">Queued</p><p className="text-sm font-black">{selectedFiles.length} CSVs</p></div><div className="text-left pr-2"><p className="text-[9px] uppercase font-bold opacity-70">Total Rows</p><p className="text-sm font-black">~{totalRows.toLocaleString()}</p></div><button onClick={() => {setSelectedFiles([]); setInputText(""); setTotalRows(0);}}><X size={18} /></button></div></div>
        )}
      </Card>

      {/* 3. OPERATION CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {operationsList.map((op) => (
          <Card key={op.id} onClick={() => toggleOperation(op.id)}
            className={`p-6 cursor-pointer border-2 transition-all group ${selectedOps.includes(op.id) ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/40 shadow-md scale-[1.02]" : "border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-200"}`}>
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{op.icon}</div>
            <p className="font-bold text-gray-800 dark:text-zinc-100 text-sm">{op.label}</p>
          </Card>
        ))}
      </div>

      <Button onClick={handleRunAll} disabled={isLoading || selectedFiles.length === 0} className="w-full py-8 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all active:scale-[0.98]">
        {isLoading ? "Executing Parallel Logic..." : "Initialize High-Speed Analysis"}
      </Button>

      <AnswerGrid results={results} />

      {/* 4. SEARCH SECTION */}
      <div className="pt-10 border-t mt-12 bg-gray-50/30 dark:bg-zinc-900/30 p-6 rounded-[2rem]">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-white"><Database className="text-blue-500" /> Global Content Search</h2>
        <div className="flex flex-col md:flex-row gap-3 mb-8">
            <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 text-lg rounded-2xl border-2 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" onKeyDown={(e) => e.key === 'Enter' && handleSearch()}/>
            <Button size="lg" onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 h-14 font-bold shadow-md transition-all active:scale-95">Search Database</Button>
        </div>
        <div className="space-y-4">
            {searchResults.map((r: any) => (
                <Card key={r.id} className="p-6 border-2 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500 transition-all shadow-sm rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">RECORD ID: {r.id}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.score > 0 ? 'bg-green-100 text-green-700' : r.score < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>Score: {r.score}</span>
                    </div>
                    <p className="text-sm font-mono text-gray-500 dark:text-zinc-400 leading-relaxed italic">"{(r.content || "").replace(/{|}|'/g, "").substring(0, 300)}..."</p>
                </Card>
            ))}
        </div>
      </div>
    </div>
  )
}