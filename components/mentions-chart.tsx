"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { LLM } from "@/app/page"

type MentionsChartProps = {
  llms: LLM[]
  timeRange: string
}

export function MentionsChart({ llms, timeRange }: MentionsChartProps) {
  const data = llms.map((llm) => ({
    name: llm.name,
    mentions: llm.mentions,
  }))

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Brand Mentions</CardTitle>
        <p className="text-sm text-muted-foreground">Total mentions across all sources</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
             <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
             <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="mentions" fill="rgb(37, 31, 156)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
