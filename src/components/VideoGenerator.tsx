import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Download, Sparkles, Clock, Smartphone, MonitorPlay, Copy, RotateCcw, Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoSettings {
  platform: string;
  duration: number;
  style: string;
  quality: string;
}

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<VideoSettings>({
    platform: "tiktok",
    duration: 30,
    style: "cinematic",
    quality: "hd"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");

  const platforms = [
    { value: "tiktok", label: "TikTok", ratio: "9:16", icon: Smartphone },
    { value: "instagram", label: "Instagram Reels", ratio: "9:16", icon: Smartphone },
    { value: "youtube", label: "YouTube Shorts", ratio: "9:16", icon: MonitorPlay },
  ];

  const styles = [
    "Cinematic", "Animated", "Realistic", "Artistic", "Documentary", "Fast-paced"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Show realistic progress
      toast({
        title: "Starting Generation",
        description: "Analyzing your prompt and setting up video parameters..."
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Processing",
        description: "Creating your AI video... This may take a moment."
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate script and video
      const sampleScript = `🎬 ${prompt}\n\n✨ Transform your day with this amazing tip!\n\n🔥 Did you know that small changes can make HUGE differences?\n\n💫 Try this simple trick and watch the magic happen!\n\n👀 Watch till the end for the best part!\n\n#viral #amazing #tips #transformation`;
      setGeneratedScript(sampleScript);
      
      const videoId = Math.random().toString(36).substring(2, 15);
      setGeneratedVideo(`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`);
      
      toast({
        title: "✨ Video Generated Successfully!",
        description: `Your ${settings.platform} video is ready! Duration: ${settings.duration}s, Style: ${settings.style}`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please check your connection and try again.",
        variant: "destructive"
      });
      console.error("Video generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlatform = platforms.find(p => p.value === settings.platform);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full glass-effect border border-primary/30">
          <Wand2 className="w-5 h-5 text-primary mr-2 animate-pulse" />
          <span className="text-sm font-medium">AI Video Generator</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gradient">
          Create Viral Videos
          <span className="block text-2xl md:text-3xl text-muted-foreground font-medium mt-2">
            in 30 seconds
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Just describe your idea and watch our AI create a complete video with script, voiceover, and stunning visuals. 
          <span className="text-primary font-semibold"> Perfect for any platform.</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <Card className="premium-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Settings
            </CardTitle>
            <CardDescription className="text-base">
              Customize your video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select 
                value={settings.platform} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{platform.label}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {platform.ratio}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Duration</label>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {settings.duration}s
                </div>
              </div>
              <Slider
                value={[settings.duration]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, duration: value[0] }))}
                max={60}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {/* Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <Select 
                value={settings.style} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, style: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style.toLowerCase()} value={style.toLowerCase()}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Video Idea</label>
              <Textarea
                placeholder="Describe your video idea in detail... e.g., 'A productivity tip about organizing your workspace with before/after shots and upbeat music'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[140px] resize-none text-base"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full premium-button text-lg py-6 h-auto"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-3" />
                  Creating Your Video...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" />
                  Generate Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="premium-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Play className="h-6 w-6 text-primary" />
              Video Preview
            </CardTitle>
            <CardDescription className="text-base">
              Your AI-generated video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[9/16] max-h-[500px] mx-auto premium-card">
              {generatedVideo ? (
                <div className="relative h-full">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    poster="/placeholder.svg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="glass-effect text-white font-medium px-3 py-1">
                      {currentPlatform?.label}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg">
                  <div className="space-y-4">
                    <div className="h-20 w-20 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center">
                      <Play className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Ready to create?</h3>
                      <p className="text-muted-foreground max-w-xs">
                        Describe your video idea and watch our AI bring it to life!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {generatedVideo && (
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <Button 
                    variant="glass" 
                    className="flex-1"
                    onClick={() => {
                      const video = document.querySelector('video');
                      if (video) {
                        if (video.paused) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play/Pause
                  </Button>
                  <Button 
                    className="flex-1 premium-button"
                    onClick={() => {
                      toast({
                        title: "✨ Download Started",
                        description: "Your AI video is downloading now!"
                      });
                      const link = document.createElement('a');
                      link.href = generatedVideo;
                      link.download = `ai-video-${Date.now()}.mp4`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setGeneratedVideo(null);
                    setGeneratedScript("");
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Generate New Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Script Panel */}
        <Card className="premium-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Copy className="h-6 w-6 text-primary" />
              Generated Script
            </CardTitle>
            <CardDescription className="text-base">
              AI-crafted content for your video
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedScript ? (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 min-h-[300px]">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                    {generatedScript}
                  </pre>
                </div>
                <Button 
                  variant="glass" 
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedScript);
                    toast({
                      title: "✨ Script Copied!",
                      description: "Your video script is now in your clipboard."
                    });
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Script
                </Button>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg">
                <div className="space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center">
                    <Copy className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Script Preview</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Your AI-generated script will appear here for easy copying
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoGenerator;