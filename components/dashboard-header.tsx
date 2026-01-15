"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Calendar } from "lucide-react"
import { SettingsDialog } from "@/components/settings-dialog"
import type { MonitoringPrompt, LLM } from "@/app/page"

type DashboardHeaderProps = {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  prompts: MonitoringPrompt[];
  onAddPrompt: (label: string, prompt: string) => void;
  onRemovePrompt: (id: string) => void;
  llms: LLM[];
  onRemoveLLM: (id: string) => void;
}

export function DashboardHeader({
  timeRange,
  onTimeRangeChange,
  prompts,
  onAddPrompt,
  onRemovePrompt,
  llms,
  onRemoveLLM,
}: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 w-full border-b border-border bg-card z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">LLM Brand Monitor</h1>
              <p className="text-sm text-muted-foreground">Real-time sentiment & performance tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SettingsDialog prompts={prompts} onAddPrompt={onAddPrompt} onRemovePrompt={onRemovePrompt} llms={llms} onRemoveLLM={onRemoveLLM} />
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  )
}
