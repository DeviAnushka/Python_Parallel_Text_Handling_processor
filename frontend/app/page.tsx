"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return alert("Fill all fields");
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        localStorage.setItem("userEmail", email);
        router.push("/Dashboard"); 
      } else { alert("Invalid credentials"); }
    } catch (error) { alert("Backend not running on Port 5001"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">TextFlow Intelligence</CardTitle>
          <CardDescription>Sign in to access analytics engine</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="space-y-1">
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="text-right">
              <Link href="/Forgot-Password" size="sm" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full h-11 bg-blue-600 rounded-xl">
            {isLoading ? "Authenticating..." : "Login"}
          </Button>
          <p className="text-sm text-gray-500">New here? <Link href="/Signup" className="text-blue-600 font-bold">Create account</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}