"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Plus, Trash2 } from "lucide-react"
import type { MonitoringPrompt } from "@/app/page"

type ManagePromptsDialogProps = {
  prompts: MonitoringPrompt[]
  onAddPrompt: (label: string, prompt: string) => void
  onRemovePrompt: (id: string) => void
}

export function ManagePromptsDialog({ prompts, onAddPrompt, onRemovePrompt }: ManagePromptsDialogProps) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (label.trim() && prompt.trim()) {
      onAddPrompt(label.trim(), prompt.trim())
      setLabel("")
      setPrompt("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Manage Prompts ({prompts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Monitoring Prompts</DialogTitle>
          <DialogDescription>
            Create and manage prompts used to monitor brand presence across different LLMs
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Existing Prompts</h3>
              {prompts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No prompts yet. Create your first monitoring prompt below.
                </div>
              ) : (
                <div className="space-y-3">
                  {prompts.map((p) => (
                    <div key={p.id} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                      <div className="flex-1 space-y-1">
                        <div className="font-medium text-sm text-foreground">{p.label}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{p.prompt}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemovePrompt(p.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium mb-4">Add New Prompt</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Prompt Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Brand Awareness, Feature Comparison"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt Text</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., What do you know about [Brand Name]? Can you tell me about their products?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use [Brand Name] as a placeholder that you can customize when sending
                  </p>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={!label.trim() || !prompt.trim()}>
                  <Plus className="h-4 w-4" />
                  Add Prompt
                </Button>
              </form>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
