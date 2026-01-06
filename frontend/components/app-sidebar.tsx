"use client"

import { useState } from "react";
import { Calendar, Home, Inbox, Settings, Menu, Contact, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/Dashboard", icon: Home },
  { title: "Inbox", url: "/Content/Inbox", icon: Inbox },
  { title: "Calendar", url: "/Content/Calender", icon: Calendar },
  { title: "Settings", url: "/Content/Settings", icon: Settings },
];

const helps = [
  { title: "Contact Us", url: "/Content/ContactUs", icon: Contact },
  { title: "Help", url: "/Content/Help", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <Sidebar
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 shadow-lg z-40
          transition-transform
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        <SidebarContent className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 m-3">TextFlow</span>
          </div>

          {/* Main Menu */}
          <SidebarGroup className="flex-1 overflow-y-auto mt-4 px-4">
            <SidebarGroupLabel className="px-2 m-3 text-gray-500 uppercase text-xs tracking-wider">
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-4">
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            flex items-center gap-4 px-6 h-14 rounded-full text-xl font-semibold transition-all duration-300
                            hover:bg-blue-50 hover:text-blue-600 hover:shadow-lg hover:scale-105
                            ${isActive ? "bg-blue-500 text-white shadow-inner" : "text-gray-700"}
                          `}
                        >
                          <item.icon className="w-7 h-7" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Help Section */}
          <div className="px-4 mt-auto mb-6">
            <SidebarGroupLabel className="px-2 text-gray-500 uppercase text-xs tracking-wider mb-2">
              Help
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-3">
              {helps.map((help) => {
                const isActive = pathname === help.url;
                return (
                  <SidebarMenuItem key={help.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={help.url}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          flex items-center gap-4 px-6 h-14 rounded-full text-xl font-semibold transition-all duration-300
                          hover:bg-blue-50 hover:text-blue-600 hover:shadow-lg hover:scale-105
                          ${isActive ? "bg-blue-500 text-white shadow-inner" : "text-gray-700"}
                        `}
                      >
                        <help.icon className="w-7 h-7" />
                        <span>{help.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </SidebarContent>

        {/* Overlay for mobile */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/20 lg:hidden z-30"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </Sidebar>
    </>
  );
}
