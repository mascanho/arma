"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
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
  )
}
