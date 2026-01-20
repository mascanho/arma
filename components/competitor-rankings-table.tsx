"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LLM } from "@/app/page"

type CompetitorRankingsTableProps = {
  competitors: LLM[]
}

export function CompetitorRankingsTable({ competitors }: CompetitorRankingsTableProps) {
  const sortedCompetitors = [...competitors].sort((a, b) => a.rank - b.rank)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Competitor Rankings</CardTitle>
        <p className="text-sm text-muted-foreground">Market position comparison with competitors</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto h-[400px]">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Rank</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Competitor</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Sentiment</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Mentions</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Response Time</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Accuracy</th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground bg-card sticky top-0 border-b border-border">Change</th>
              </tr>
            </thead>
            <tbody>
              {sortedCompetitors.map((competitor) => (
                <tr key={competitor.id} className="border-b border-border last:border-0">
                  <td className="py-4">
                    <Badge variant="outline" className="font-mono">
                      #{competitor.rank}
                    </Badge>
                  </td>
                  <td className="py-4 font-medium text-foreground">{competitor.name}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-chart-1" style={{ width: `${competitor.sentiment}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground">{competitor.sentiment}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">{competitor.mentions.toLocaleString()}</td>
                  <td className="py-4 text-muted-foreground">{competitor.responseTime}ms</td>
                  <td className="py-4 text-muted-foreground">{competitor.accuracy}%</td>
                  <td className="py-4">
                    {competitor.change > 0 ? (
                      <div className="flex items-center gap-1 text-success">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{competitor.change}</span>
                      </div>
                    ) : competitor.change < 0 ? (
                      <div className="flex items-center gap-1 text-destructive">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">{competitor.change}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Minus className="h-4 w-4" />
                        <span className="text-sm">0</span>
                      </div>
                    )}
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