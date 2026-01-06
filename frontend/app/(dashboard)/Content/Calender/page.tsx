"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar as LucideCalendar } from "lucide-react"

interface CalendarEvent {
  id: number
  title: string
  date: string
  description: string
}

const CalenderPage = () => {
  // Example events
  const [events] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Text Summarization",
      date: "2026-01-02",
      description: "Parallel text summarization task completed.",
    },
    {
      id: 2,
      title: "Translation",
      date: "2026-01-03",
      description: "Text translation to French completed.",
    },
    {
      id: 3,
      title: "Spell Check",
      date: "2026-01-04",
      description: "Spell check operation finished successfully.",
    },
  ])


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
    <div className="p-6 bg-gray-50 dark:bg-zinc-900 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <LucideCalendar className="w-6 h-6 text-blue-500" />
        Calendar
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No events scheduled.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="border-gray-200 dark:border-zinc-800 shadow-md rounded-2xl"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CalenderPage
