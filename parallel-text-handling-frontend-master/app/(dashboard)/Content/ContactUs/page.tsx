"use client"

import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactUsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Handles sending form via fetch
  const handleSend = async () => {
    if (!name || !email || !message) {
      alert("Please fill out all fields")
      return
    }

    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setSuccess("Message sent successfully!")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 p-6">
      <Card className="w-full max-w-lg rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Contact Us
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Have a question or feedback? Send us a message.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 py-6">
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base rounded-xl"
          />

          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base rounded-xl"
          />

          <Textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32 text-base rounded-xl resize-none"
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button
            onClick={handleSend}
            className="w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>

          {success && (
            <p className="text-center text-green-600 dark:text-green-400 font-medium">
              {success}
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
