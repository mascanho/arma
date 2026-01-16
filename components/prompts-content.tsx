"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptsTable } from "@/components/prompts-table"
import { PromptVisualization } from "@/components/prompt-visualization"

interface PromptsContentProps {
  prompts: any[]
  llms: any[]
  competitors: any[]
}

export function PromptsContent({ prompts, llms, competitors }: PromptsContentProps) {
  return (
    <div className="h-full">
      <Tabs defaultValue="table" className="h-full flex flex-col">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="visualisation">Visualisation</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="flex-1 mt-4">
          <PromptsTable />
        </TabsContent>
        <TabsContent value="visualisation" className="flex-1 mt-4">
          <PromptVisualization prompts={prompts} llms={llms} competitors={competitors} />
        </TabsContent>
      </Tabs>
    </div>
  )
}