"use client"

import { Bot, BarChart3, MessageSquare, Eye, BookOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavigationSidebarProps = {
  activeTab: string
  onTabChange: (value: string) => void
}

export function NavigationSidebar({ activeTab, onTabChange }: NavigationSidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      id: "realtime",
      label: "Realtime",
      icon: MessageSquare,
    },
    {
      id: "prompts",
      label: "Prompts",
      icon: Eye,
    },
    {
      id: "citations",
      label: "Citations",
      icon: BookOpen,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="bg-background border-r border-border">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">LLM Brand Monitor</span>
            <span className="text-xs text-muted-foreground">Real-time tracking</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">
          v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}