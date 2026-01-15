"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Send, User, Loader2, MessageSquare } from "lucide-react"
import type { LLM, MonitoringPrompt } from "@/app/page"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  llm?: string
  timestamp: Date
}

type RealtimeChatProps = {
  llms: LLM[]
  prompts: MonitoringPrompt[]
}

export function RealtimeChat({ llms, prompts }: RealtimeChatProps) {
  const [selectedLLM, setSelectedLLM] = useState<string>(llms[0]?.id || "")
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedPrompt) {
      const prompt = prompts.find((p) => p.id === selectedPrompt)
      if (prompt) {
        setInput(prompt.prompt)
      }
    }
  }, [selectedPrompt, prompts])

  const simulateStreaming = async (prompt: string, llmName: string) => {
    const responses = {
      ChatGPT: `Based on my analysis, ${prompt.toLowerCase().includes("best") ? "the best approach would be to leverage a combination of techniques" : "I can help you with that"}. Here's what I recommend:\n\n1. Start by understanding the core requirements\n2. Break down the problem into manageable pieces\n3. Implement incrementally with testing at each stage\n\nWould you like me to elaborate on any of these points?`,
      Claude: `I appreciate your question about ${prompt.slice(0, 30)}... Let me provide a thoughtful response:\n\nFrom my perspective, ${prompt.toLowerCase().includes("how") ? "the methodology involves several key considerations" : "this is an interesting topic that requires careful analysis"}. I'd suggest:\n\n• Examining the foundational concepts first\n• Building upon established best practices\n• Adapting the approach based on specific context\n\nHappy to dive deeper into any aspect!`,
      Gemini: `Great question! Regarding ${prompt.slice(0, 30)}...\n\n${prompt.toLowerCase().includes("what") ? "The answer lies in understanding" : "Let me break this down for you"}:\n\n→ First, consider the broader context\n→ Next, identify the key variables\n→ Finally, synthesize a comprehensive solution\n\nI can provide more specific examples if you'd like.`,
      Grok: `Yo! So you're asking about ${prompt.slice(0, 30)}... \n\nHere's the deal: ${prompt.toLowerCase().includes("why") ? "there are multiple factors at play" : "this is actually pretty straightforward"}.\n\n✓ Think of it from a practical angle\n✓ Don't overcomplicate things\n✓ Focus on what actually works\n\nLet me know if you want the unfiltered version 😎`,
      Perplexity: `[Analyzing query: "${prompt.slice(0, 40)}..."]\n\nBased on current information:\n\n${prompt.toLowerCase().includes("compare") ? "Comparison analysis shows" : "Research indicates that"} the optimal approach involves:\n\n• Evidence-based methodology\n• Cross-referencing multiple sources\n• Practical implementation strategies\n\nSources: [1] [2] [3]\nWould you like citations for any specific point?`,
    }

    const response =
      responses[llmName as keyof typeof responses] ||
      `As ${llmName}, I can help with that. ${prompt.slice(0, 20)}... This is an interesting question that requires careful consideration. Let me provide you with a comprehensive response based on my training and capabilities.`

    const words = response.split(" ")
    let streamedContent = ""

    const messageId = Date.now().toString()
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: "assistant",
        content: "",
        llm: llmName,
        timestamp: new Date(),
      },
    ])

    for (let i = 0; i < words.length; i++) {
      streamedContent += (i > 0 ? " " : "") + words[i]

      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, content: streamedContent } : msg)))

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 30))
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isStreaming || !selectedLLM) return

    const llm = llms.find((l) => l.id === selectedLLM)
    if (!llm) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSelectedPrompt("")
    setIsStreaming(true)

    await simulateStreaming(userMessage.content, llm.name)
    setIsStreaming(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectedLLMData = llms.find((l) => l.id === selectedLLM)

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="p-6 h-fit space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Select LLM</h2>
          <Select value={selectedLLM} onValueChange={setSelectedLLM}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an LLM" />
            </SelectTrigger>
            <SelectContent>
              {llms.map((llm) => (
                <SelectItem key={llm.id} value={llm.id}>
                  {llm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Monitoring Prompt</h2>
          <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
            <SelectTrigger>
              <SelectValue placeholder="Select a prompt" />
            </SelectTrigger>
            <SelectContent>
              {prompts.map((prompt, index) => (
                <SelectItem key={prompt.id} value={prompt.id}>
                  Prompt #{index + 1}: {prompt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {prompts.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              No prompts available. Create prompts in the header menu.
            </p>
          )}
        </div>

        {selectedLLMData && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Active Model:</span>
            </div>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="font-medium text-foreground">{selectedLLMData.name}</div>
              <div className="text-sm text-muted-foreground">Rank #{selectedLLMData.rank}</div>
              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                <div>
                  <div className="font-medium text-foreground">{selectedLLMData.sentiment}%</div>
                  <div>Sentiment</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">{selectedLLMData.accuracy}%</div>
                  <div>Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">💡 Pro Tip</p>
          <p>Select a monitoring prompt to quickly test brand presence, or type your own custom query.</p>
        </div>
      </Card>

      <Card className="flex flex-col h-[calc(100vh-240px)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Select an LLM and monitoring prompt, or type your own message to see real-time responses. Compare
                different models by switching between them.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {message.role === "assistant" && message.llm && (
                    <div className="text-xs font-medium mb-2 opacity-70">{message.llm}</div>
                  )}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  <div className="text-xs mt-2 opacity-50">{message.timestamp.toLocaleTimeString()}</div>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedLLM
                  ? "Type your message or select a monitoring prompt... (Press Enter to send)"
                  : "Select an LLM first..."
              }
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isStreaming || !selectedLLM}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming || !selectedLLM}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
