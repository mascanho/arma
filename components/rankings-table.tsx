"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react"
import type { LLM } from "@/app/page"

type RankingsTableProps = {
  llms: LLM[]
  onRemoveLLM: (id: string) => void
}

export function RankingsTable({ llms, onRemoveLLM }: RankingsTableProps) {
  const sortedLLMs = [...llms].sort((a, b) => a.rank - b.rank)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">LLM Rankings</CardTitle>
        <p className="text-sm text-muted-foreground">Performance comparison and rankings</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto h-[400px]">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Rank</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">LLM</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Sentiment</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Mentions</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Response Time</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Accuracy</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Change</th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLLMs.map((llm) => (
                <tr key={llm.id} className="border-b border-border last:border-0">
                  <td className="py-4">
                    <Badge variant="outline" className="font-mono">
                      #{llm.rank}
                    </Badge>
                  </td>
                  <td className="py-4 font-medium text-foreground">{llm.name}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-chart-1" style={{ width: `${llm.sentiment}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground">{llm.sentiment}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">{llm.mentions.toLocaleString()}</td>
                  <td className="py-4 text-muted-foreground">{llm.responseTime}ms</td>
                  <td className="py-4 text-muted-foreground">{llm.accuracy}%</td>
                  <td className="py-4">
                    {llm.change > 0 ? (
                      <div className="flex items-center gap-1 text-success">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{llm.change}</span>
                      </div>
                    ) : llm.change < 0 ? (
                      <div className="flex items-center gap-1 text-destructive">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">{llm.change}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Minus className="h-4 w-4" />
                        <span className="text-sm">0</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onRemoveLLM(llm.id)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
