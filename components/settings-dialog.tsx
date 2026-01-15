"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Plus, Trash2, Eye, EyeOff, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { MonitoringPrompt, LLM } from "@/app/page";

type LLMProvider = {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  showKey: boolean;
  models: string[];
  selectedModel: string;
};

type SettingsDialogProps = {
  prompts: MonitoringPrompt[];
  onAddPrompt: (label: string, prompt: string) => void;
  onRemovePrompt: (id: string) => void;
  llms: LLM[];
  onRemoveLLM: (id: string) => void;
};

export function SettingsDialog({
  prompts,
  onAddPrompt,
  onRemovePrompt,
  llms,
  onRemoveLLM,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [newPromptLabel, setNewPromptLabel] = useState("");
  const [newPromptText, setNewPromptText] = useState("");
  const [automationInterval, setAutomationInterval] = useState("30");
  const [brandName, setBrandName] = useState("");
  const [activeTab, setActiveTab] = useState<"llm" | "general">("llm");

  // Initialize providers from LLMs, with default settings for known providers
  const getDefaultProviderSettings = (llm: LLM): LLMProvider => {
    const defaultSettings: Record<string, Partial<LLMProvider>> = {
      "OpenAI": {
        models: ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
        selectedModel: "gpt-4o",
      },
      "Claude": {
        models: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
        selectedModel: "claude-3-5-sonnet",
      },
      "Google": {
        models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
        selectedModel: "gemini-2.0-flash",
      },
      "xAI": {
        models: ["grok-2", "grok-2-mini"],
        selectedModel: "grok-2",
      },
      "Perplexity": {
        models: ["sonar-pro", "sonar", "sonar-reasoning"],
        selectedModel: "sonar-pro",
      },
    };

    const settings = defaultSettings[llm.name] || {
      models: ["default-model"],
      selectedModel: "default-model",
    };

    return {
      id: llm.id,
      name: llm.name,
      enabled: true, // New LLMs are enabled by default
      apiKey: "",
      showKey: false,
      models: settings.models || ["default-model"],
      selectedModel: settings.selectedModel || "default-model",
    };
  };

  const [providers, setProviders] = useState<LLMProvider[]>([]);

  // Initialize and sync providers with LLMs
  useEffect(() => {
    const llmIds = new Set(llms.map(llm => llm.id));
    const currentIds = new Set(providers.map(p => p.id));

    // Remove providers that no longer have corresponding LLMs
    const filteredProviders = providers.filter(p => llmIds.has(p.id));

    // Add new providers for LLMs that don't have them
    const newProviders = llms
      .filter(llm => !currentIds.has(llm.id))
      .map(getDefaultProviderSettings);

    if (filteredProviders.length !== providers.length || newProviders.length > 0) {
      setProviders([...filteredProviders, ...newProviders]);
    }
  }, [llms]);;

  const handleAddPrompt = () => {
    if (newPromptLabel.trim() && newPromptText.trim()) {
      onAddPrompt(newPromptLabel.trim(), newPromptText.trim());
      setNewPromptLabel("");
      setNewPromptText("");
    }
  };

  const toggleProvider = (id: string) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const updateApiKey = (id: string, apiKey: string) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, apiKey } : p)));
  };

  const toggleShowKey = (id: string) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, showKey: !p.showKey } : p)),
    );
  };

  const updateSelectedModel = (id: string, model: string) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, selectedModel: model } : p)),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full max-h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full bg-background">
          {/* Sidebar */}
          <div className="w-80 border-r border-border/50 bg-muted/10 backdrop-blur-sm">
            <div className="p-6 border-b border-border/50">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Settings
              </DialogTitle>
              <DialogDescription className="text-xs mt-1 text-muted-foreground">
                Configure your monitoring system
              </DialogDescription>
            </div>

            <nav className="p-3 space-y-1">
              <button
                onClick={() => setActiveTab("llm")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "llm"
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.01]"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                  LLM Providers
                </div>
              </button>
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "general"
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.01]"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                  General
                </div>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
            {activeTab === "llm" && (
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 6rem)' }}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1 tracking-tight">
                    LLM Providers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select providers, choose models, and enter API keys
                  </p>
                </div>

                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div
                      key={provider.id}
                      className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`provider-${provider.id}`}
                            checked={provider.enabled}
                            onCheckedChange={() => toggleProvider(provider.id)}
                            className="w-5 h-5"
                          />
                          <Label
                            htmlFor={`provider-${provider.id}`}
                            className="text-lg font-medium cursor-pointer"
                          >
                            {provider.name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                              provider.enabled
                                ? "bg-green-500/10 text-green-600 border border-green-200/20"
                                : "bg-muted/50 text-muted-foreground border border-border/30"
                            }`}
                          >
                            {provider.enabled ? "Enabled" : "Disabled"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemoveLLM(provider.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {provider.enabled && (
                        <div className="space-y-3 pl-7 border-l-2 border-border/30 ml-2">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`model-${provider.id}`}
                              className="text-sm font-medium"
                            >
                              Model
                            </Label>
                            <Select
                              value={provider.selectedModel}
                              onValueChange={(value) =>
                                updateSelectedModel(provider.id, value)
                              }
                            >
                              <SelectTrigger
                                id={`model-${provider.id}`}
                                className="h-11"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {provider.models.map((model) => (
                                  <SelectItem key={model} value={model}>
                                    {model}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                           <div className="space-y-1.5">
                             <Label
                               htmlFor={`api-key-${provider.id}`}
                               className="text-sm font-medium"
                             >
                               API Key
                             </Label>
                            <div className="relative">
                              <Input
                                id={`api-key-${provider.id}`}
                                type={provider.showKey ? "text" : "password"}
                                placeholder="sk-..."
                                value={provider.apiKey}
                                onChange={(e) =>
                                  updateApiKey(provider.id, e.target.value)
                                }
                                className="pr-12 h-11"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-9 w-9"
                                onClick={() => toggleShowKey(provider.id)}
                              >
                                {provider.showKey ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                 <div className="flex gap-3 mt-6">
                   <Button className="flex-1 h-11 text-sm font-medium">
                     Save Provider Settings
                   </Button>
                 </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 6rem)' }}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1 tracking-tight">
                    General Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure brand information and automation
                  </p>
                </div>

                <div className="space-y-6 mb-6">
                  <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="brand-name"
                          className="text-base font-medium"
                        >
                          Brand Name
                        </Label>
                        <Input
                          id="brand-name"
                          placeholder="Your brand or product name"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="h-11"
                        />
                        <p className="text-sm text-muted-foreground">
                          This will replace [Brand Name] in your monitoring
                          prompts
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="automation-interval"
                          className="text-base font-medium"
                        >
                          Automation Interval
                        </Label>
                        <Select
                          value={automationInterval}
                          onValueChange={setAutomationInterval}
                        >
                          <SelectTrigger
                            id="automation-interval"
                            className="h-11"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">Every 15 minutes</SelectItem>
                            <SelectItem value="30">Every 30 minutes</SelectItem>
                            <SelectItem value="60">Every hour</SelectItem>
                            <SelectItem value="180">Every 3 hours</SelectItem>
                            <SelectItem value="360">Every 6 hours</SelectItem>
                            <SelectItem value="720">Every 12 hours</SelectItem>
                            <SelectItem value="1440">Every 24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          How often to automatically query LLMs with your
                          prompts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Monitoring Prompts
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Define prompts to track your brand presence across LLMs
                      </p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                      {prompts.length} prompts
                    </span>
                  </div>

                  <div className="space-y-4">
                    {prompts.map((prompt, index) => (
                      <div
                        key={prompt.id}
                        className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                              <span className="text-base font-medium">
                                {prompt.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {prompt.prompt}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onRemovePrompt(prompt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border-2 border-dashed border-border/50 bg-muted/20 p-4 space-y-3">
                    <Label
                      htmlFor="new-prompt-label"
                      className="text-sm font-medium"
                    >
                      Add New Prompt
                    </Label>
                    <Input
                      id="new-prompt-label"
                      placeholder="Prompt label (e.g., Brand Awareness)"
                      value={newPromptLabel}
                      onChange={(e) => setNewPromptLabel(e.target.value)}
                      className="h-11"
                    />
                    <Textarea
                      id="new-prompt-text"
                      placeholder="Enter your monitoring prompt... Use [Brand Name] as a placeholder"
                      value={newPromptText}
                      onChange={(e) => setNewPromptText(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleAddPrompt}
                      className="w-full h-12 text-base font-medium"
                      disabled={!newPromptLabel || !newPromptText}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Add Prompt
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 h-11 text-sm font-medium">
                    Save General Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
