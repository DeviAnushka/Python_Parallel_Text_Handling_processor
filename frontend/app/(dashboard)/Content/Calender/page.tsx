"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Clock, CheckCircle2, 
  ChevronRight, Calendar as CalendarIcon, Download, X
} from "lucide-react";
import AnswerGrid from "../../Answer/page";

export default function CalendarPage() {
  const [history, setHistory] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filter, setFilter] = useState("Month"); 

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/history")
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  // --- NEW LOGIC: Filter data based on timestamp ---
  const filteredHistory = history.filter((item: any) => {
    const itemDate = new Date(item.timestamp);
    const now = new Date();
    
    if (filter === "Today") {
      return itemDate.toDateString() === now.toDateString();
    } else if (filter === "Week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return itemDate >= weekAgo;
    } else if (filter === "Month") {
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);
      return itemDate >= monthAgo;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    if (status === "Completed") return "text-green-500 bg-green-50 border-green-100";
    return "text-gray-400 bg-gray-50 border-gray-100";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* 1. HEADER & DATE CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <CalendarIcon className="text-blue-600" /> Execution History
          </h1>
          <p className="text-gray-500 mt-1">View analysis executions by date and time.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          {["Today", "Week", "Month"].map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === period 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TIMELINE VIEW */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        
        {/* Change mapping from 'history' to 'filteredHistory' */}
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item: any) => (
            <div key={item.id} className="relative pl-12 group">
              <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center shadow-sm z-10">
                 <FileText className="text-white" size={16} />
              </div>
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden border border-gray-100 bg-white">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                            <Clock size={12}/> {item.timestamp}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusColor(item.status)}`}>
                            {item.status}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.filename}</h3>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-blue-600">Operations:</span> {item.operations}
                    </p>
                  </div>
                  <Button onClick={() => setSelectedEvent(item)} className="bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white rounded-xl gap-2 border shadow-none">
                      View Report <ChevronRight size={16}/>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          /* 3. EMPTY STATE / EXAMPLE ROW */
          <div className="relative pl-12 opacity-40 grayscale pointer-events-none">
            <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center z-10">
               <FileText className="text-white" size={16} />
            </div>
            <Card className="border-none shadow-none rounded-2xl border-2 border-dashed border-gray-200 bg-transparent">
              <CardContent className="p-6">
                <p className="text-sm text-gray-400">No reports found for the selected period "{filter}". Run an analysis to see data here.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-8 relative animate-in zoom-in duration-300">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition">
              <X size={24} />
            </button>
            <div className="mb-8 border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-800">Historical Report</h2>
                <p className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-widest">ID: {selectedEvent.id} // TS: {selectedEvent.timestamp}</p>
            </div>
            <AnswerGrid results={JSON.parse(selectedEvent.report_data)} />
          </Card>
        </div>
      )}
    </div>
  );
}