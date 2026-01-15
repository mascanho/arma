import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, MessageSquare, Star, Zap } from "lucide-react"
import type { LLM } from "@/app/page"

type MetricsGridProps = {
  llms: LLM[]
}

export function MetricsGrid({ llms }: MetricsGridProps) {
  const totalMentions = llms.reduce((sum, llm) => sum + llm.mentions, 0)
  const avgSentiment = Math.round(llms.reduce((sum, llm) => sum + llm.sentiment, 0) / llms.length)
  const avgResponseTime = Math.round(llms.reduce((sum, llm) => sum + llm.responseTime, 0) / llms.length)
  const avgAccuracy = Math.round(llms.reduce((sum, llm) => sum + llm.accuracy, 0) / llms.length)

  const metrics = [
    {
      title: "Total Mentions",
      value: totalMentions.toLocaleString(),
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-chart-2",
    },
    {
      title: "Avg Sentiment",
      value: `${avgSentiment}%`,
      change: "+3.2%",
      icon: TrendingUp,
      color: "text-chart-1",
    },
    {
      title: "Avg Response Time",
      value: `${avgResponseTime}ms`,
      change: "-5.1%",
      icon: Zap,
      color: "text-chart-3",
    },
    {
      title: "Avg Accuracy",
      value: `${avgAccuracy}%`,
      change: "+1.8%",
      icon: Star,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className="text-xs font-medium text-success">{metric.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{metric.title}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{metric.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
