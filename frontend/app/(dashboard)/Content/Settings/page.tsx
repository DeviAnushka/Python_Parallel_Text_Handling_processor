"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Settings, Database, ShieldCheck, LogOut, Trash2, 
  RefreshCcw, Bell, AlertTriangle, Info, Copy, Check, Moon, Sun
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("chetanaswamysetty@gmail.com");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("light");

  // Load theme and apply it immediately
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
    setTheme(savedTheme);
    
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-8 transition-colors duration-300 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      
      <div className="flex items-center gap-3">
          <Settings className="text-blue-600" size={32} />
          <h1 className="text-4xl font-black tracking-tighter dark:text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-[2rem] p-8 text-center transition-colors">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4 text-2xl font-bold">
                    {userEmail[0].toUpperCase()}
                </div>
                <h3 className="font-bold text-lg dark:text-white">{userEmail.split('@')[0]}</h3>
                <p className="text-xs text-gray-400 mb-6">{userEmail}</p>
                <Button variant="outline" className="w-full rounded-xl dark:border-zinc-700 dark:text-zinc-300" onClick={() => router.push("/Forgot-Password")}>
                    Reset Password
                </Button>
            </Card>

            {/* THE APPEARANCE BOX */}
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-[2rem] p-8 transition-colors">
                <h4 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase mb-4 tracking-widest">Appearance</h4>
                <div className="flex p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-2xl">
                    <button 
                        onClick={() => toggleTheme("light")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold text-sm ${
                            theme === "light" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <Sun size={16} /> Light
                    </button>
                    <button 
                        onClick={() => toggleTheme("dark")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold text-sm ${
                            theme === "dark" ? "bg-zinc-700 text-white shadow-sm" : "text-gray-400 hover:text-zinc-300"
                        }`}
                    >
                        <Moon size={16} /> Dark
                    </button>
                </div>
            </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-8">
            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-[2rem] p-8 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Configuration</h4>
                    <span className="text-[10px] px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded">DEV MODE</span>
                </div>
                <div className="space-y-4">
                    <p className="text-xs font-medium text-gray-500">Backend Endpoint</p>
                    <div className="flex gap-2">
                        <Input value="http://127.0.0.1:5001" readOnly className="bg-gray-50 dark:bg-zinc-800 border-none dark:text-zinc-300 font-mono text-sm" />
                        <Button variant="outline" size="icon" className="rounded-xl dark:border-zinc-700" onClick={() => {navigator.clipboard.writeText("http://127.0.0.1:5001"); setCopied(true); setTimeout(()=>setCopied(false), 2000)}}>
                            {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="border border-red-100 dark:border-red-900/20 bg-red-50/10 dark:bg-red-950/10 rounded-[2rem] p-8 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                        <h4 className="text-red-600 font-bold flex items-center gap-2">
                            <AlertTriangle size={18}/> Danger Zone
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">Permanently delete all processing history.</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-transform active:scale-95">
                        Purge History
                    </Button>
                </div>
            </Card>
        </div>
      </div>

      <div className="flex justify-center pt-8">
          <Button variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => {localStorage.clear(); router.push("/")}}>
              <LogOut size={18} className="mr-2"/> End Session
          </Button>
      </div>
    </div>
  );
}