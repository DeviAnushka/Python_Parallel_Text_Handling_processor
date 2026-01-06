"use client"

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Parallel-Text Handling - Help Center
      </h1>

      <div className="grid gap-6 max-w-3xl w-full">
        {/* Feature 1 */}
        <Card className="rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle>Uploading Parallel Texts</CardTitle>
            <CardDescription>
              Learn how to upload your source and target texts for parallel processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p>
              Click the "Upload" button on the main dashboard to select your text files. 
              Ensure your files are aligned sentence by sentence for best results. Supported formats include .txt and .csv.
            </p>
          </CardContent>
        </Card>

        {/* Feature 2 */}
        <Card className="rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle>Viewing Side-by-Side Texts</CardTitle>
            <CardDescription>
              Understand how to read and compare your parallel texts.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p>
              Once uploaded, your texts will appear side-by-side for easy comparison. 
              You can highlight sentences, add notes, or jump to specific sections using the navigation panel.
            </p>
          </CardContent>
        </Card>

        {/* Feature 3 */}
        <Card className="rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle>Exporting Aligned Texts</CardTitle>
            <CardDescription>
              Save your processed parallel texts for future use.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p>
              After editing or reviewing, you can export your texts in multiple formats including .txt, .csv, or .json. 
              This allows easy integration with translation memory systems or other linguistic tools.
            </p>
          </CardContent>
        </Card>

        {/* Feature 4 */}
        <Card className="rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle>Getting Support</CardTitle>
            <CardDescription>
              Contact our support team for any issues or questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p>
              For troubleshooting or feature requests, please email us at{" "}
              <a
                href="mailto:support@paralleltexthandler.com"
                className="text-blue-600 hover:underline"
              >
                support@paralleltexthandler.com
              </a>{" "}
              or visit our FAQ section on the website.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
