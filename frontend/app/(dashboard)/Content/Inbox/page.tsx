"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle, Clock, Eye, Download, X, Inbox } from "lucide-react";
import AnswerGrid from "../../Answer/page";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/inbox").then(res => res.json()).then(data => setMessages(data));
  }, []);

  const handleDownload = (reportData: string, id: string) => {
    const results = JSON.parse(reportData);
    let csv = "Operation,Result\n";
    results.forEach((r: any) => { csv += `"${r.title}","${r.output.replace(/"/g, '""')}"\n`; });
    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `Report_${id}.csv`; a.click();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800"><Bell className="text-blue-600" /> Intelligence Inbox</h1>
        <Button variant="outline" className="text-red-500 rounded-xl" onClick={() => fetch("http://127.0.0.1:5001/api/inbox/clear", {method: 'POST'}).then(() => setMessages([]))}>Clear All</Button>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-6xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl relative p-10 animate-in zoom-in duration-300">
            <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-1">Archived Analysis</h2>
            <p className="text-xs text-gray-400 mb-8 font-mono">{selectedReport.timestamp}</p>
            <AnswerGrid results={JSON.parse(selectedReport.report_data)} />
            <div className="mt-10 flex justify-end">
              <Button onClick={() => handleDownload(selectedReport.report_data, selectedReport.id)} className="bg-green-600 hover:bg-green-700 gap-2 px-8 h-12 rounded-xl font-bold">
                <Download size={18} /> Export as CSV
              </Button>
            </div>
          </Card>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed"><Inbox className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-400">Vault is currently empty.</p></div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <Card key={msg.id} className="border-none shadow-sm rounded-2xl overflow-hidden border border-gray-100">
              <div className="flex">
                <div className={`w-1.5 ${msg.type === 'alert' ? 'bg-red-500' : 'bg-green-500'}`} />
                <CardContent className="p-5 flex gap-4 items-center w-full bg-white">
                  <div className={`p-3 rounded-xl ${msg.type === 'alert' ? 'bg-red-50' : 'bg-green-50'}`}>
                    {msg.type === 'alert' ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{msg.title}</h4>
                    <p className="text-[10px] text-gray-400">{msg.message}</p>
                  </div>
                  {msg.report_data && (
                      <div className="flex gap-2">
                        <Button onClick={() => setSelectedReport(msg)} size="sm" variant="outline" className="gap-2 border-blue-100 text-blue-600 rounded-lg"><Eye size={14}/> View</Button>
                        <Button onClick={() => handleDownload(msg.report_data, msg.id)} size="sm" variant="ghost" className="text-gray-300 hover:text-green-600"><Download size={18}/></Button>
                      </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}