"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsGrid } from "@/components/metrics-grid"
import { SentimentChart } from "@/components/sentiment-chart"
import { MentionsChart } from "@/components/mentions-chart"
import { RankingsTable } from "@/components/rankings-table"
import { CompetitorRankingsTable } from "@/components/competitor-rankings-table"
import { LLMResponses } from "@/components/llm-responses"
import { AddLLMDialog } from "@/components/add-llm-dialog"
import { RealtimeChat } from "@/components/realtime-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, MessageSquare } from "lucide-react"

export type LLM = {
  id: string
  name: string
  sentiment: number
  mentions: number
  rank: number
  change: number
  responseTime: number
  accuracy: number
}

export type MonitoringPrompt = {
  id: string
  label: string
  prompt: string
}

const initialLLMs: LLM[] = [
  { id: "1", name: "ChatGPT", sentiment: 85, mentions: 12458, rank: 1, change: 0, responseTime: 850, accuracy: 94 },
  { id: "2", name: "Claude", sentiment: 82, mentions: 9234, rank: 2, change: 1, responseTime: 720, accuracy: 92 },
  { id: "3", name: "Gemini", sentiment: 78, mentions: 8567, rank: 3, change: -1, responseTime: 920, accuracy: 89 },
  { id: "4", name: "Grok", sentiment: 75, mentions: 6234, rank: 4, change: 0, responseTime: 880, accuracy: 87 },
  { id: "5", name: "Perplexity", sentiment: 73, mentions: 5123, rank: 5, change: 2, responseTime: 650, accuracy: 90 },
]

const initialCompetitors: LLM[] = [
  { id: "comp1", name: "Cohere", sentiment: 79, mentions: 7234, rank: 1, change: 1, responseTime: 680, accuracy: 91 },
  { id: "comp2", name: "Anthropic Claude 2", sentiment: 81, mentions: 8921, rank: 2, change: -1, responseTime: 750, accuracy: 93 },
  { id: "comp3", name: "Mistral AI", sentiment: 76, mentions: 5432, rank: 3, change: 0, responseTime: 820, accuracy: 88 },
  { id: "comp4", name: "Stability AI", sentiment: 72, mentions: 4123, rank: 4, change: 2, responseTime: 950, accuracy: 85 },
  { id: "comp5", name: "Hugging Face", sentiment: 70, mentions: 3876, rank: 5, change: -1, responseTime: 780, accuracy: 86 },
]

const initialPrompts: MonitoringPrompt[] = [
  {
    id: "1",
    label: "Brand Awareness",
    prompt: "What do you know about [Brand Name]? Can you tell me about their products and reputation?",
  },
  {
    id: "2",
    label: "Feature Comparison",
    prompt: "Compare the key features and capabilities of [Brand Name] with its main competitors.",
  },
  {
    id: "3",
    label: "User Sentiment",
    prompt: "What do users typically say about [Brand Name]? What are the main pros and cons?",
  },
  {
    id: "4",
    label: "Market Position",
    prompt: "Where does [Brand Name] stand in the market compared to other similar products?",
  },
]

export default function Page() {
  const [llms, setLLMs] = useState<LLM[]>(initialLLMs)
  const [competitors, setCompetitors] = useState<LLM[]>(initialCompetitors)
  const [timeRange, setTimeRange] = useState("7d")
  const [prompts, setPrompts] = useState<MonitoringPrompt[]>(initialPrompts)

  const handleAddLLM = (name: string) => {
    const newLLM: LLM = {
      id: Date.now().toString(),
      name,
      sentiment: Math.floor(Math.random() * 30) + 60,
      mentions: Math.floor(Math.random() * 5000) + 1000,
      rank: llms.length + 1,
      change: 0,
      responseTime: Math.floor(Math.random() * 500) + 500,
      accuracy: Math.floor(Math.random() * 15) + 80,
    }
    setLLMs([...llms, newLLM])
  }

  const handleRemoveLLM = (id: string) => {
    setLLMs(llms.filter((llm) => llm.id !== id))
  }

  const handleAddPrompt = (label: string, prompt: string) => {
    const newPrompt: MonitoringPrompt = {
      id: Date.now().toString(),
      label,
      prompt,
    }
    setPrompts([...prompts, newPrompt])
  }

  const handleRemovePrompt = (id: string) => {
    setPrompts(prompts.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        prompts={prompts}
        onAddPrompt={handleAddPrompt}
        onRemovePrompt={handleRemovePrompt}
      />

      <main className="container mx-auto px-4 py-6 pt-20">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Realtime Responses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MetricsGrid llms={llms} />

            <div className="grid gap-6 lg:grid-cols-2">
              <SentimentChart llms={llms} timeRange={timeRange} />
              <MentionsChart llms={llms} timeRange={timeRange} />
            </div>

            <RankingsTable llms={llms} onRemoveLLM={handleRemoveLLM} />

            <CompetitorRankingsTable competitors={competitors} />

            <LLMResponses llms={llms} />
          </TabsContent>

          <TabsContent value="realtime">
            <RealtimeChat llms={llms} prompts={prompts} />
          </TabsContent>
        </Tabs>
      </main>

      <AddLLMDialog onAddLLM={handleAddLLM} />
    </div>
  )
}
