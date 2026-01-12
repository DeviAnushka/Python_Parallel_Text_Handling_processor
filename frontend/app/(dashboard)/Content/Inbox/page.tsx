"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle, Clock, Eye, Download, X, MailCheck } from "lucide-react";
import AnswerGrid from "../../Answer/page";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/inbox")
      .then(res => {
          if(!res.ok) throw new Error("Backend error");
          return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => alert("Inbox connection failed. Is Python running on 5001?"));
  }, []);

  const handleDownload = (reportData: string, id: string) => {
    const results = JSON.parse(reportData);
    let csv = "Operation,Result\n";
    results.forEach((r: any) => { csv += `"${r.title}","${r.output.replace(/"/g, '""')}"\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${id}.csv`;
    a.click();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3 dark:text-white">
        <Bell className="text-blue-600" /> Intelligence Inbox
      </h1>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-6xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl p-10 relative">
            <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
            <h2 className="text-2xl font-bold dark:text-white">Archived Report</h2>
            <AnswerGrid results={JSON.parse(selectedReport.report_data)} />
            <div className="mt-8 flex justify-end">
                <Button onClick={() => handleDownload(selectedReport.report_data, selectedReport.id)} className="bg-green-600 font-bold">Download CSV</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((msg: any) => (
          <Card key={msg.id} className="border-none shadow-sm rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
            <div className="flex">
              <div className={`w-1.5 ${msg.type === 'alert' ? 'bg-red-500' : 'bg-green-500'}`} />
              <CardContent className="p-5 flex gap-4 items-center w-full bg-white dark:bg-zinc-900">
                <div className={`p-3 rounded-xl ${msg.type === 'alert' ? 'bg-red-50' : 'bg-green-50'}`}>
                   {msg.type === 'alert' ? <AlertCircle className="text-red-500" /> : <MailCheck className="text-green-500" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white">{msg.title}</h4>
                  {msg.email_sent === 1 && <p className="text-[9px] text-green-600 font-bold">✔ Email Report Delivered</p>}
                  {msg.email_sent === 2 && <p className="text-[9px] text-red-600 font-bold">✖ Email Failed</p>}
                  <p className="text-xs text-gray-400">{msg.message}</p>
                </div>
                {msg.report_data && (
                  <Button onClick={() => setSelectedReport(msg)} size="sm" variant="outline" className="text-blue-600">View Report</Button>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}