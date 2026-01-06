"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Added for navigation

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  // 1. Setup states for all input fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  // 2. Logic to send data to Python backend
  const handleSignup = async () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please log in.");
        router.push("/"); // Redirect back to Login page
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Could not connect to the backend server.");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 dark:from-zinc-900 dark:via-black dark:to-zinc-900">

      {/* Background blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute bottom-10 left-20 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md rounded-2xl border border-gray-100 shadow-xl dark:border-zinc-800">

        {/* Header */}
        <CardHeader className="text-center space-y-2 pt-8">
          <CardTitle className="text-2xl font-semibold">
            Create Account
          </CardTitle>
          <CardDescription className="text-sm">
            Join Parallel-Text Handling
          </CardDescription>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="space-y-4 py-6">

          <Input
            placeholder="Full name"
            className="h-11 rounded-xl"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />

          <Input
            type="email"
            placeholder="Email address"
            className="h-11 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl"
            disabled={isLoading}
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 rounded-xl"
            disabled={isLoading}
          />

        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-5 pb-8">

          <Button 
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>

        </CardFooter>
      </Card>
    </div>
  )
}