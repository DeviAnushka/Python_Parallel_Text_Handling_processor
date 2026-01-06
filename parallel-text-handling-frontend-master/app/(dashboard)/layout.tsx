"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
<div className="flex h-screen overflow-hidden">
  <AppSidebar />
</div>
      <main className="flex-1 p-15">
        <SidebarTrigger />
        {children}
      </main>
   
    </SidebarProvider>
  )
}
