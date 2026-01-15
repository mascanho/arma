"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"
import type { LLM } from "@/app/page"

type LLMResponsesProps = {
  llms: LLM[]
}

export function LLMResponses({ llms }: LLMResponsesProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">LLM Response Metrics</CardTitle>
        <p className="text-sm text-muted-foreground">Performance and accuracy comparison</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {llms.map((llm) => (
            <Card key={llm.id} className="border-border bg-secondary/50">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{llm.name}</h3>
                  <Badge variant="outline" className="font-mono">
                    #{llm.rank}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Response Time</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-foreground">{llm.responseTime}ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Accuracy</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-foreground">{llm.accuracy}%</span>
                  </div>

                  <div className="pt-2">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Sentiment Score</span>
                      <span>{llm.sentiment}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-chart-1 transition-all" style={{ width: `${llm.sentiment}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
