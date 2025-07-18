import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Download, Sparkles, Clock, Smartphone, MonitorPlay } from "lucide-react";
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
    duration: 15,
    style: "cinematic",
    quality: "hd"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

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

      // Generate a more realistic video URL (using a placeholder for demo)
      const videoId = Math.random().toString(36).substring(2, 15);
      setGeneratedVideo(`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`);
      
      toast({
        title: "Video Generated Successfully!",
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gradient">AI Video Generator</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into engaging short-form videos with AI. Perfect for TikTok, Instagram Reels, and YouTube Shorts.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Video Settings
            </CardTitle>
            <CardDescription>
              Configure your video generation parameters
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Description</label>
              <Textarea
                placeholder="Describe your video idea... e.g., 'A cat dancing in a neon-lit city at night with upbeat music'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              variant="ai"
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-accent" />
              Preview
            </CardTitle>
            <CardDescription>
              Your generated video will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="video-container aspect-[9/16] max-h-[600px] mx-auto">
              {generatedVideo ? (
                <div className="relative h-full">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    poster="/placeholder.svg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/80 text-foreground">
                      {currentPlatform?.label}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div className="space-y-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">No video generated yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter a description and click generate to create your AI video
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {generatedVideo && (
              <div className="mt-6 flex gap-3">
                <Button 
                  variant="ai-outline" 
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
                  <Play className="h-4 w-4" />
                  Play/Pause
                </Button>
                <Button 
                  variant="ai" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Download Started",
                      description: "Your video download will begin shortly."
                    });
                    // Create download link
                    const link = document.createElement('a');
                    link.href = generatedVideo;
                    link.download = `ai-video-${Date.now()}.mp4`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoGenerator;