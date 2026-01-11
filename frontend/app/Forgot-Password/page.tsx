"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email || !newPassword) return alert("Fill all fields");
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      if (res.ok) {
        alert("Password updated! Please login.");
        router.push("/");
      } else { alert("User not found"); }
    } catch (e) { alert("Backend Error"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border-none">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto text-blue-500 mb-2" size={32} />
          <CardTitle className="text-xl">Recover Account</CardTitle>
          <CardDescription>Enter your email to set a new password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Registered Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleReset} disabled={isLoading} className="w-full h-11 bg-blue-600 rounded-xl">Update</Button>
          <Link href="/" className="text-sm text-gray-500 flex items-center gap-1 hover:text-blue-600">
            <ArrowLeft size={14}/> Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}