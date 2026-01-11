"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  HelpCircle, 
  Upload, 
  MousePointer2, 
  Play, 
  Download, 
  FileWarning, 
  Info,
  ChevronRight,
  Code,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

const allFeatures = [
  { name: "Summarization", desc: "Generates statistical and categorical distribution reports." },
  { name: "Translation", desc: "Auto-detects and converts non-English content to English." },
  { name: "Keyword Extraction", desc: "Identifies primary themes based on word frequency." },
  { name: "Sentiment Analysis", desc: "Determines emotional polarity in opinion-based text." },
  { name: "Grammar Correction", desc: "Optimizes sentence structure and syntax flow." },
  { name: "Spell Check", desc: "Verifies vocabulary against standard English lexicons." },
  { name: "Remove Stop Words", desc: "Filters out high-frequency noise words for cleaner data." },
  { name: "Convert Case", desc: "Transforms text into Uppercase, Lowercase, or Title case." },
]

export default function HelpPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <HelpCircle className="text-blue-600" size={36} /> Help Center
        </h1>
        <p className="text-gray-500 text-lg">Comprehensive guide to the TextFlow Analytics platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* HOW TO USE */}
        <Card className="rounded-3xl border-none shadow-md bg-white p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
                <MousePointer2 size={20}/> Usage Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <div className="flex gap-3"><Upload size={16} className="mt-1"/> <p><b>1. Upload:</b> Select a standard CSV file via the dashboard zone.</p></div>
            <div className="flex gap-3"><Info size={16} className="mt-1"/> <p><b>2. Configure:</b> Select the analysis modules you wish to run.</p></div>
            <div className="flex gap-3"><Play size={16} className="mt-1"/> <p><b>3. Execute:</b> Initialize the high-speed parallel processing engine.</p></div>
            <div className="flex gap-3"><Download size={16} className="mt-1"/> <p><b>4. Export:</b> Review insights or download the full CSV report.</p></div>
          </CardContent>
        </Card>

        {/* SUPPORTED FILES */}
        <Card className="rounded-3xl border-none shadow-md bg-white p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
                <FileWarning size={20}/> Data Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-2">
              <li><b>CSV Format:</b> Standard comma-separated values only.</li>
              <li><b>Encoding:</b> Files must be UTF-8 encoded for accuracy.</li>
              <li><b>Headers:</b> First row must contain valid column names.</li>
              <li><b>Scale:</b> Optimized for files with up to 50,000 records.</li>
            </ul>
          </CardContent>
        </Card>

        {/* ALL FEATURES LOGIC */}
        <Card className="md:col-span-2 rounded-3xl border-none shadow-md bg-white p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle2 size={20}/> Core Analytical Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                {allFeatures.map((f, i) => (
                    <div key={i} className="border-b border-gray-50 pb-2">
                        <p className="text-sm font-bold text-gray-700">{f.name}</p>
                        <p className="text-xs text-gray-500">{f.desc}</p>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* COMMON ISSUES */}
        <Card className="md:col-span-2 rounded-3xl border-none shadow-md bg-white p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
                <Info size={20}/> Troubleshooting & System Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <p><b>"Not Applicable":</b> This status appears if the module determines the data type is not compatible (e.g., trying to run Grammar checks on ID numbers).</p>
            <p><b>Analysis Mismatch:</b> Ensure columns are clearly named. Factual data is automatically filtered out of emotional sentiment tasks to maintain accuracy.</p>
            <p><b>Connection Errors:</b> Ensure the analytical backend is active. Processing large files requires a stable connection to the parallel engine.</p>
          </CardContent>
        </Card>
      </div>

      {/* UPDATED BUTTON COLOR */}
      <div className="flex justify-center pt-6">
        <Link href="/Content/Help/Documentation">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl gap-2 px-10 h-14 shadow-lg transition-all active:scale-95 font-bold">
                <Code size={20}/> Open Developer Documentation <ChevronRight size={18}/>
            </Button>
        </Link>
      </div>
    </div>
  )
}