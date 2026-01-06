"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InboxItem {
  id: number
  title: string
  content: string
  date: string
}

const InboxPage = () => {
  // ✅ Temp data: shown initially
  const tempMessages: InboxItem[] = [
    {
      id: 1,
      title: "Text Summarization Complete",
      content: "Your text 'Hello World' was summarized successfully.",
      date: "2026-01-02",
    },
    {
      id: 2,
      title: "Translation Complete",
      content: "Your text was translated to French: 'Bonjour le monde'.",
      date: "2026-01-02",
    },
    {
      id: 3,
      title: "Spell Check Result",
      content: "Your text 'Helo Wrld' was corrected to 'Hello World'.",
      date: "2026-01-01",
    },
  ]

  const [messages, setMessages] = useState<InboxItem[]>(tempMessages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ✅ Fetch real data from backend
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await fetch("/api/inbox")
        if (!res.ok) throw new Error("Failed to fetch messages")
        const data: InboxItem[] = await res.json()

        // Replace messages only if backend returns data
        if (data && data.length > 0) setMessages(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  return (
    <div className="p-6 bg-gray-50 dark:bg-zinc-900 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Inbox
      </h1>

      {loading && <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>}
      {/* {error && <p className="text-red-600 dark:text-red-400">{error}</p>} */}

      {messages.length === 0 && !loading && !error ? (
        <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className="border-gray-200 dark:border-zinc-800 shadow-md rounded-2xl"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {msg.title}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">{msg.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{msg.content}</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  onClick={() => alert(`Opening message: ${msg.title}`)}
                >
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default InboxPage
