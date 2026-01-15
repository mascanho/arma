"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Zap } from "lucide-react"
import type { LLM, MonitoringPrompt } from "@/app/page"

type PromptVisualizationProps = {
  prompts: MonitoringPrompt[]
  llms: LLM[]
  competitors: LLM[]
}

type Entity = {
  id: string
  name: string
  type: 'llm' | 'competitor' | 'prompt'
  x: number
  y: number
  connections: string[]
}

export function PromptVisualization({ prompts, llms, competitors }: PromptVisualizationProps) {
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null)
  const [showLLMs, setShowLLMs] = useState(true)
  const [showCompetitors, setShowCompetitors] = useState(true)
  const [showPrompts, setShowPrompts] = useState(true)

  // Create relationship data - which prompts are relevant to which LLMs/competitors
  const getRelationships = (entity: LLM, type: 'llm' | 'competitor') => {
    const relationships: string[] = []

    prompts.forEach(prompt => {
      let relevance = 0

      switch (prompt.label) {
        case "Brand Awareness":
          relevance = type === 'llm' ? 0.9 : 0.3 // Your LLMs know your brand better
          break
        case "Feature Comparison":
          relevance = 0.8 // Both LLMs and competitors can compare features
          break
        case "User Sentiment":
          relevance = 0.7 // Sentiment data is available for all
          break
        case "Market Position":
          relevance = type === 'competitor' ? 0.9 : 0.4 // Competitors define market position
          break
      }

      if (Math.random() < relevance) {
        relationships.push(prompt.id)
      }
    })

    return relationships
  }

  // Create entities with positions
  const entities: Entity[] = []

  // Add LLMs (left side)
  llms.forEach((llm, index) => {
    if (showLLMs) {
      entities.push({
        id: llm.id,
        name: llm.name,
        type: 'llm',
        x: 15,
        y: 20 + (index * 15),
        connections: getRelationships(llm, 'llm')
      })
    }
  })

  // Add competitors (right side)
  competitors.forEach((competitor, index) => {
    if (showCompetitors) {
      entities.push({
        id: competitor.id,
        name: competitor.name,
        type: 'competitor',
        x: 85,
        y: 20 + (index * 15),
        connections: getRelationships(competitor, 'competitor')
      })
    }
  })

  // Add prompts (center)
  prompts.forEach((prompt, index) => {
    if (showPrompts) {
      entities.push({
        id: prompt.id,
        name: prompt.label,
        type: 'prompt',
        x: 50,
        y: 25 + (index * 20),
        connections: [] // Prompts connect to LLMs/competitors, not vice versa
      })
    }
  })

  const getEntityColor = (type: Entity['type']) => {
    switch (type) {
      case 'llm': return 'rgb(37, 31, 156)' // Your brand blue
      case 'competitor': return '#ef4444' // Red for competitors
      case 'prompt': return '#8b5cf6' // Purple for prompts
    }
  }

  const getEntitySize = (type: Entity['type'], connections: number) => {
    const baseSize = type === 'prompt' ? 60 : 50
    return baseSize + (connections * 2)
  }

  const getConnectedEntities = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId)
    if (!entity) return []

    if (entity.type === 'prompt') {
      // For prompts, find all LLMs/competitors connected to this prompt
      return entities.filter(e =>
        (e.type === 'llm' || e.type === 'competitor') &&
        e.connections.includes(entityId)
      )
    } else {
      // For LLMs/competitors, find all prompts connected to this entity
      return entities.filter(e =>
        e.type === 'prompt' &&
        entity.connections.includes(e.id)
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Prompt Relationship Visualization
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            See how your monitoring prompts connect to different LLMs and competitors
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant={showLLMs ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLLMs(!showLLMs)}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              Your LLMs ({llms.length})
            </Button>
            <Button
              variant={showCompetitors ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompetitors(!showCompetitors)}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Competitors ({competitors.length})
            </Button>
            <Button
              variant={showPrompts ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPrompts(!showPrompts)}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              Prompts ({prompts.length})
            </Button>
          </div>

          <Tabs defaultValue="network" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="matrix">Matrix View</TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="mt-6">
              <div className="relative bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-8 min-h-[600px] border border-border/50">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {entities.map(entity =>
                    getConnectedEntities(entity.id).map(connectedEntity => {
                      const start = entities.find(e => e.id === entity.id)
                      const end = entities.find(e => e.id === connectedEntity.id)
                      if (!start || !end) return null

                      return (
                        <line
                          key={`${entity.id}-${connectedEntity.id}`}
                          x1={`${start.x}%`}
                          y1={`${start.y}%`}
                          x2={`${end.x}%`}
                          y2={`${end.y}%`}
                          stroke={getEntityColor(entity.type)}
                          strokeWidth="2"
                          strokeOpacity="0.3"
                          className="transition-all duration-300"
                        />
                      )
                    })
                  )}
                </svg>

                {/* Entity Nodes */}
                {entities.map(entity => {
                  const connectedCount = getConnectedEntities(entity.id).length
                  const isHovered = hoveredEntity === entity.id
                  const hasConnections = connectedCount > 0

                  return (
                    <div
                      key={entity.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${
                        isHovered ? 'scale-110 z-10' : 'hover:scale-105'
                      }`}
                      style={{
                        left: `${entity.x}%`,
                        top: `${entity.y}%`,
                      }}
                      onMouseEnter={() => setHoveredEntity(entity.id)}
                      onMouseLeave={() => setHoveredEntity(null)}
                    >
                      <div
                        className={`relative rounded-full border-2 shadow-lg transition-all duration-300 ${
                          hasConnections ? 'shadow-xl' : 'shadow-md'
                        } ${isHovered ? 'border-white/50' : 'border-white/20'}`}
                        style={{
                          backgroundColor: getEntityColor(entity.type),
                          width: getEntitySize(entity.type, connectedCount),
                          height: getEntitySize(entity.type, connectedCount),
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-1 leading-tight">
                            {entity.name.length > 8 ? entity.name.substring(0, 6) + '...' : entity.name}
                          </span>
                        </div>

                        {hasConnections && (
                          <div className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                            <span className="text-xs font-bold text-gray-800">{connectedCount}</span>
                          </div>
                        )}
                      </div>

                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg max-w-xs">
                            <div className="font-medium text-sm">{entity.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {entity.type === 'prompt' ? 'Monitoring Prompt' :
                               entity.type === 'llm' ? 'Your LLM' : 'Competitor LLM'}
                            </div>
                            {connectedCount > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Connected to {connectedCount} {entity.type === 'prompt' ? 'LLMs' : 'prompts'}
                              </div>
                            )}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="matrix" className="mt-6">
              <div className="space-y-4">
                {prompts.map(prompt => (
                  <Card key={prompt.id} className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-2">{prompt.label}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{prompt.prompt}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {llms
                            .filter(llm => getRelationships(llm, 'llm').includes(prompt.id))
                            .slice(0, 3)
                            .map(llm => (
                              <Badge key={llm.id} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                {llm.name}
                              </Badge>
                            ))}
                          {competitors
                            .filter(comp => getRelationships(comp, 'competitor').includes(prompt.id))
                            .slice(0, 3)
                            .map(comp => (
                              <Badge key={comp.id} variant="secondary" className="text-xs bg-red-100 text-red-800">
                                {comp.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}