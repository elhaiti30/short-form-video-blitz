import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Wand2, Copy, RotateCcw, Sparkles, Target, Users, Clock, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScriptSettings {
  platform: string;
  duration: number;
  tone: string;
  audience: string;
  industry: string;
  cta: string;
  hook_style: string;
  language: string;
}

interface AIScriptGeneratorProps {
  onScriptGenerated?: (script: string, settings: ScriptSettings) => void;
  initialPrompt?: string;
}

export const AIScriptGenerator = ({ onScriptGenerated, initialPrompt = "" }: AIScriptGeneratorProps) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<ScriptSettings>({
    platform: "tiktok",
    duration: 30,
    tone: "engaging",
    audience: "general",
    industry: "lifestyle",
    cta: "engagement",
    hook_style: "question",
    language: "english"
  });

  const platforms = [
    { value: "tiktok", label: "TikTok", maxDuration: 60 },
    { value: "instagram", label: "Instagram Reels", maxDuration: 60 },
    { value: "youtube", label: "YouTube Shorts", maxDuration: 60 },
    { value: "linkedin", label: "LinkedIn", maxDuration: 120 },
    { value: "twitter", label: "Twitter/X", maxDuration: 140 }
  ];

  const tones = [
    { value: "engaging", label: "Engaging & Energetic", description: "High energy, exciting" },
    { value: "professional", label: "Professional", description: "Business-focused, authoritative" },
    { value: "conversational", label: "Conversational", description: "Friendly, casual" },
    { value: "educational", label: "Educational", description: "Informative, clear" },
    { value: "humorous", label: "Humorous", description: "Funny, entertaining" },
    { value: "inspirational", label: "Inspirational", description: "Motivating, uplifting" }
  ];

  const audiences = [
    { value: "general", label: "General Audience", description: "Broad appeal" },
    { value: "gen-z", label: "Gen Z (16-24)", description: "Young adults" },
    { value: "millennials", label: "Millennials (25-40)", description: "Young professionals" },
    { value: "professionals", label: "Business Professionals", description: "Corporate audience" },
    { value: "creators", label: "Content Creators", description: "Fellow creators" },
    { value: "entrepreneurs", label: "Entrepreneurs", description: "Business owners" }
  ];

  const industries = [
    "lifestyle", "technology", "business", "education", "entertainment", 
    "fitness", "food", "travel", "fashion", "finance", "health", "gaming"
  ];

  const ctaTypes = [
    { value: "engagement", label: "Engagement", description: "Like, comment, share" },
    { value: "follow", label: "Follow", description: "Follow for more content" },
    { value: "website", label: "Visit Website", description: "Drive traffic" },
    { value: "product", label: "Check Product", description: "Promote product/service" },
    { value: "subscribe", label: "Subscribe", description: "YouTube subscription" },
    { value: "download", label: "Download", description: "App or resource download" }
  ];

  const hookStyles = [
    { value: "question", label: "Question Hook", description: "Start with intriguing question" },
    { value: "statistic", label: "Shocking Statistic", description: "Surprising numbers" },
    { value: "story", label: "Story Opening", description: "Personal narrative" },
    { value: "problem", label: "Problem Statement", description: "Address pain point" },
    { value: "controversy", label: "Controversial Take", description: "Bold statement" },
    { value: "how-to", label: "How-To Promise", description: "Educational promise" }
  ];

  const generateScript = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a video idea or topic",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      toast({
        title: "🤖 AI Script Generator",
        description: "Creating your personalized script..."
      });

      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: {
          prompt: prompt.trim(),
          settings
        }
      });

      if (error) {
        throw new Error(`Script generation failed: ${error.message}`);
      }

      if (data?.success && data?.script) {
        setGeneratedScript(data.script);
        onScriptGenerated?.(data.script, settings);
        
        toast({
          title: "✨ Script Generated!",
          description: `Created ${settings.tone} script for ${settings.platform}`,
          duration: 4000
        });
      } else {
        throw new Error(data?.error || "Failed to generate script");
      }

    } catch (error) {
      console.error("Script generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyScript = async () => {
    if (generatedScript) {
      await navigator.clipboard.writeText(generatedScript);
      toast({
        title: "Copied!",
        description: "Script copied to clipboard"
      });
    }
  };

  const regenerateScript = () => {
    if (generatedScript) {
      generateScript();
    }
  };

  const currentPlatform = platforms.find(p => p.value === settings.platform);
  const currentTone = tones.find(t => t.value === settings.tone);
  const currentAudience = audiences.find(a => a.value === settings.audience);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <FileText className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">AI Script Generator</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Viral Scripts Made Easy
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate engaging, platform-optimized scripts that capture attention and drive results
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Script Settings
            </CardTitle>
            <CardDescription>
              Customize your script parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="platform" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="platform">Platform</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="platform" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={settings.platform} onValueChange={(value) => setSettings(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration (seconds)</Label>
                  <Select value={settings.duration.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, duration: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      {currentPlatform && currentPlatform.maxDuration > 60 && (
                        <SelectItem value="120">2 minutes</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={settings.industry} onValueChange={(value) => setSettings(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry.charAt(0).toUpperCase() + industry.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={settings.audience} onValueChange={(value) => setSettings(prev => ({ ...prev, audience: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map(audience => (
                        <SelectItem key={audience.value} value={audience.value}>
                          <div className="flex flex-col">
                            <span>{audience.label}</span>
                            <span className="text-xs text-muted-foreground">{audience.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={settings.tone} onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(tone => (
                        <SelectItem key={tone.value} value={tone.value}>
                          <div className="flex flex-col">
                            <span>{tone.label}</span>
                            <span className="text-xs text-muted-foreground">{tone.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Hook Style</Label>
                  <Select value={settings.hook_style} onValueChange={(value) => setSettings(prev => ({ ...prev, hook_style: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hookStyles.map(hook => (
                        <SelectItem key={hook.value} value={hook.value}>
                          <div className="flex flex-col">
                            <span>{hook.label}</span>
                            <span className="text-xs text-muted-foreground">{hook.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Call to Action</Label>
                  <Select value={settings.cta} onValueChange={(value) => setSettings(prev => ({ ...prev, cta: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ctaTypes.map(cta => (
                        <SelectItem key={cta.value} value={cta.value}>
                          <div className="flex flex-col">
                            <span>{cta.label}</span>
                            <span className="text-xs text-muted-foreground">{cta.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            {/* Settings Summary */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">CURRENT SETTINGS</Label>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {currentPlatform?.label}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {settings.duration}s
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentTone?.label}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentAudience?.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Generate Script
              </CardTitle>
              <CardDescription>
                Describe your video idea and let AI create the perfect script
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Video Idea / Topic</Label>
                <Textarea
                  placeholder="Example: 'A quick morning routine that boosts productivity' or 'Top 3 mistakes new entrepreneurs make'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={generateScript} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate AI Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Script */}
          {generatedScript && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Your Generated Script
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyScript}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={regenerateScript}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Optimized for {currentPlatform?.label} • {currentTone?.label} tone • {settings.duration}s duration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                    {generatedScript}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};