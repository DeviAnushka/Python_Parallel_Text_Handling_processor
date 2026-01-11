"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Send, User, MessageSquare } from "lucide-react"

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!form.message) return alert("Please type a message");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Success! Our support team will contact you via email.");
        setForm({ name: "", email: "", message: "" });
      }
    } catch (e) { alert("Backend error"); }
    setLoading(false);
  };

  return (
    <div className="p-12 max-w-2xl mx-auto animate-in fade-in">
      <Card className="rounded-3xl shadow-xl border-none p-6">
        <CardHeader className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-600" size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Contact Support</CardTitle>
          <p className="text-gray-400 mt-2">Expect a response within 24 hours.</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Input placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <textarea 
            placeholder="Describe your issue..." 
            className="w-full h-32 p-4 border rounded-xl bg-gray-50 focus:bg-white transition-all outline-none text-sm"
            value={form.message} 
            onChange={e => setForm({...form, message: e.target.value})}
          />
          <Button onClick={handleSend} disabled={loading} className="w-full py-6 bg-blue-600 rounded-xl gap-2 text-lg">
            {loading ? "Sending..." : <>Submit Ticket <Send size={18}/></>}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}