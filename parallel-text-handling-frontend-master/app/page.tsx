"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import the router for navigation

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added for better UX
  const router = useRouter(); // 2. Initialize the router

  // 3. Updated Login handler function
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      // Sending request to your Python Flask/FastAPI backend
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        console.log("Login Success:", data);
        
        // Save user info if needed (optional)
        localStorage.setItem("userEmail", email);

        // Redirect to the Dashboard
        // (Next.js automatically handles (dashboard) folder naming)
        router.push("/Dashboard"); 
      } else {
        // Backend returned an error (e.g., 401 Unauthorized)
        alert(data.message || "Invalid email or password.");
      }
    } catch (error) {
      // Backend is likely not running
      console.error("Connection Error:", error);
      alert("Could not connect to the backend server. Is your Python app running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md min-h-[460px] rounded-2xl border border-gray-100 shadow-xl dark:border-zinc-800">
        {/* Header */}
        <CardHeader className="text-center space-y-3 pt-8">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Parallel-Text Handling
          </CardTitle>

          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue
          </CardDescription>
        </CardHeader>

        {/* Inputs */}
        <CardContent className="space-y-5 py-6">
          <Input
            type="email"
            placeholder="Email address"
            className="h-11 text-base rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            type="password"
            placeholder="Password"
            className="h-11 text-base rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-5 pb-8">
          <Button
            className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/Signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}