"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import type { LLM } from "@/app/page"

type SentimentChartProps = {
  llms: LLM[]
  timeRange: string
}

export function SentimentChart({ llms, timeRange }: SentimentChartProps) {
  // Generate mock historical data
  const data = Array.from({ length: 7 }, (_, i) => {
    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
    const dataPoint: any = { day }
    llms.slice(0, 3).forEach((llm) => {
      dataPoint[llm.name] = llm.sentiment + Math.floor(Math.random() * 10) - 5
    })
    return dataPoint
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Sentiment Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Daily sentiment score by LLM</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
             <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
             <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            {llms.slice(0, 3).map((llm, index) => (
              <Line
                key={llm.id}
                type="monotone"
                dataKey={llm.name}
                stroke="rgb(37, 31, 156)"
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
