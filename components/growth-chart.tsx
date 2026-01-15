"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import type { LLM } from "@/app/page"

type GrowthChartProps = {
  llms: LLM[]
  competitors: LLM[]
}

export function GrowthChart({ llms, competitors }: GrowthChartProps) {
  // Generate mock growth data over 12 weeks
  const generateGrowthData = () => {
    const weeks = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`)

    return weeks.map((week, index) => {
      const dataPoint: any = { week }

      // Your brand growth (combining all LLMs)
      const yourBrandBase = llms.reduce((sum, llm) => sum + llm.mentions, 0) / 100
      const yourBrandGrowth = yourBrandBase * (1 + (index * 0.08) + (Math.random() * 0.1 - 0.05))
      dataPoint["Your Brand"] = Math.round(yourBrandGrowth)

      // Competitors growth (combining all competitors)
      const competitorBase = competitors.reduce((sum, comp) => sum + comp.mentions, 0) / 100
      const competitorGrowth = competitorBase * (1 + (index * 0.06) + (Math.random() * 0.15 - 0.075))
      dataPoint["Competitors"] = Math.round(competitorGrowth)

      return dataPoint
    })
  }

  const data = generateGrowthData()

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Brand Growth Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Compare your brand growth vs competitors over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="yourBrandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(37, 31, 156)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(37, 31, 156)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="competitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              stroke="#94a3b8"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="Your Brand"
              stackId="1"
              stroke="rgb(37, 31, 156)"
              fill="url(#yourBrandGradient)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="Competitors"
              stackId="2"
              stroke="#ef4444"
              fill="url(#competitorGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}