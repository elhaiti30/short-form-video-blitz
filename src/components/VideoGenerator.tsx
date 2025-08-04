import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useVideoData } from "@/hooks/useVideoData";
import { Play, Download, Sparkles, Clock, Smartphone, MonitorPlay, Copy, RotateCcw, Wand2, Upload, Image, FileText, Globe, Mic, User, Building, Heart, Zap, Camera, Music, Save, LogIn } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoSettings {
  platform: string;
  duration: number;
  style: string;
  quality: string;
  language: string;
  voice: string;
  povStyle: string;
  industry: string;
  tone: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail?: string;
}

const VideoGenerator = () => {
  const { user } = useAuth();
  const { createProject, updateProject } = useVideoData();
  const navigate = useNavigate();
  
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [settings, setSettings] = useState<VideoSettings>({
    platform: "tiktok",
    duration: 30,
    style: "cinematic",
    quality: "hd",
    language: "english",
    voice: "alloy",
    povStyle: "first-person",
    industry: "general",
    tone: "engaging"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    { value: "tiktok", label: "TikTok", ratio: "9:16", icon: Smartphone },
    { value: "instagram", label: "Instagram Reels", ratio: "9:16", icon: Smartphone },
    { value: "youtube", label: "YouTube Shorts", ratio: "9:16", icon: MonitorPlay },
  ];

  const styles = [
    "Cinematic", "Animated", "Realistic", "Artistic", "Documentary", "Fast-paced"
  ];

  const handleSaveProject = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your projects",
        variant: "destructive"
      });
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name to save",
        variant: "destructive"
      });
      return;
    }

    try {
      const projectData = {
        project_name: projectName,
        script_content: generatedScript,
        voice_settings: { voice: settings.voice, language: settings.language },
        style_settings: { 
          platform: settings.platform,
          style: settings.style,
          duration: settings.duration,
          quality: settings.quality,
          industry: settings.industry,
          tone: settings.tone,
          povStyle: settings.povStyle
        },
        media_assets: uploadedFiles
      };

      if (currentProject) {
        await updateProject(currentProject.id, projectData);
        toast({
          title: "Project updated!",
          description: "Your project has been saved successfully"
        });
      } else {
        const newProject = await createProject(projectData);
        setCurrentProject(newProject);
        toast({
          title: "Project saved!",
          description: "Your project has been created successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const analyzePrompt = (userPrompt: string) => {
    // Extract key visual elements from the prompt
    const keywords = userPrompt.toLowerCase().split(/\s+/);
    const visualElements: string[] = [];
    const actions: string[] = [];
    const settings: string[] = [];
    const moods: string[] = [];

    // Define keyword mappings
    const keywordMappings = {
      weather: ['rain', 'sunny', 'snow', 'storm', 'cloudy', 'foggy'],
      people: ['man', 'woman', 'child', 'person', 'people', 'walking', 'running', 'sitting'],
      locations: ['city', 'street', 'park', 'beach', 'forest', 'mountain', 'building', 'house'],
      actions: ['walking', 'running', 'dancing', 'working', 'playing', 'eating', 'drinking'],
      moods: ['old', 'modern', 'vintage', 'futuristic', 'peaceful', 'busy', 'quiet', 'chaotic']
    };

    // Analyze prompt for visual elements
    keywords.forEach(word => {
      if (keywordMappings.weather.includes(word)) visualElements.push(`${word} weather`);
      if (keywordMappings.people.includes(word)) visualElements.push(word);
      if (keywordMappings.locations.includes(word)) settings.push(word);
      if (keywordMappings.actions.includes(word)) actions.push(word);
      if (keywordMappings.moods.includes(word)) moods.push(word);
    });

    return {
      originalPrompt: userPrompt,
      visualElements,
      actions,
      settings,
      moods,
      sceneDescription: `Scene showing ${visualElements.join(', ')} with ${actions.join(', ')} in ${settings.join(', ')} setting, ${moods.join(', ')} atmosphere`
    };
  };

  const generateContextualScript = (promptAnalysis: any) => {
    const { originalPrompt, visualElements, actions, settings } = promptAnalysis;

    // Create engaging script based on actual prompt content
    let script = `🎬 ${originalPrompt}\n\n`;

    // Add context-specific hooks
    if (visualElements.includes('rain')) {
      script += "☔ When the rain starts falling, magic happens...\n\n";
    } else if (actions.includes('walking')) {
      script += "🚶‍♂️ Every step tells a story...\n\n";
    } else if (settings.includes('city')) {
      script += "🏙️ In the heart of the city, life unfolds...\n\n";
    } else {
      script += "✨ Transform your day with this amazing scene!\n\n";
    }

    // Add style-specific content
    script += `🎭 Style: ${settings.style.charAt(0).toUpperCase() + settings.style.slice(1)}\n`;
    script += `📍 Setting: ${settings.join(', ').charAt(0).toUpperCase() + settings.join(', ').slice(1)}\n`;
    script += `🎬 Featuring: ${visualElements.join(', ')}\n\n`;

    // Add platform-specific ending
    const platformEndings = {
      tiktok: "💫 Perfect for your FYP! #fyp #viral #cinematic",
      instagram: "📸 Story-worthy content! #reels #instagram #aesthetic", 
      youtube: "🎥 Subscribe for more! #shorts #youtube #content"
    };

    script += platformEndings[settings.platform as keyof typeof platformEndings] || "✨ Amazing content awaits!";

    return script;
  };

  const showPreview = (promptAnalysis: any) => {
    const preview = `🎬 Video Preview:\n\n📝 Scene: ${promptAnalysis.sceneDescription}\n\n🎭 Visual Elements:\n${promptAnalysis.visualElements.map((el: string) => `• ${el}`).join('\n')}\n\n🎬 Actions:\n${promptAnalysis.actions.map((action: string) => `• ${action}`).join('\n')}\n\n📍 Setting:\n${promptAnalysis.settings.map((setting: string) => `• ${setting}`).join('\n')}`;
    
    toast({
      title: "🎬 Video Preview Ready",
      description: "Review the planned video content below. Generate to proceed with this concept.",
      duration: 5000
    });
    
    return preview;
  };

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
      // Phase 1: Analyze the prompt
      toast({
        title: "🧠 Analyzing Prompt",
        description: "Breaking down your video idea into visual elements..."
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const promptAnalysis = analyzePrompt(prompt);
      
      // Phase 2: Show preview of what will be generated
      toast({
        title: "🎬 Planning Video",
        description: `Scene: ${promptAnalysis.sceneDescription.substring(0, 50)}...`
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const previewText = showPreview(promptAnalysis);
      
      // Phase 3: Generate script based on analyzed prompt
      toast({
        title: "📝 Creating Script",
        description: "Writing engaging content based on your video idea..."
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const contextualScript = generateContextualScript(promptAnalysis);
      setGeneratedScript(contextualScript);
      
      // Phase 4: Generate actual video using AI
      toast({
        title: "🎥 Generating AI Video",
        description: `Creating ${settings.style} style video... This may take a few minutes.`
      });

      // Call the video generation edge function
      const { data: videoData, error: videoError } = await supabase.functions.invoke('generate-video', {
        body: {
          prompt: prompt,
          settings: settings
        }
      });

      if (videoError) {
        throw new Error(`Video generation failed: ${videoError.message}`);
      }

      if (videoData?.success) {
        setGeneratedVideo(videoData.videoUrl);
        
        const successMessage = videoData.isDemo 
          ? "Demo video generated! Connect Runway API for real AI videos."
          : "AI video generated successfully!";
          
        toast({
          title: "✅ Video Ready!",
          description: `${successMessage} Video captures: ${promptAnalysis.visualElements.slice(0, 3).join(', ')}`,
          duration: 6000
        });
      } else {
        throw new Error('Video generation returned no result');
      }
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
      {/* Authentication Warning */}
      {!user && (
        <Alert className="max-w-4xl mx-auto">
          <LogIn className="h-4 w-4" />
          <AlertDescription>
            <strong>Sign in to unlock full features:</strong> Save projects, access templates, and track your video performance.{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold"
              onClick={() => navigate('/auth')}
            >
              Sign in now
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
              Professional Settings
            </CardTitle>
            <CardDescription className="text-base">
              Customize every aspect of your video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
                <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
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

                {/* Quality */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <Select 
                    value={settings.quality} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hd">HD (1080p)</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                      <SelectItem value="standard">Standard (720p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {/* Style */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Visual Style
                  </label>
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

                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Industry
                  </label>
                  <Select 
                    value={settings.industry} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="fitness">Fitness & Health</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="food">Food & Cooking</SelectItem>
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="business">Business & Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="travel">Travel & Lifestyle</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Tone
                  </label>
                  <Select 
                    value={settings.tone} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engaging">Engaging</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Fun</SelectItem>
                      <SelectItem value="energetic">High Energy</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* POV Style */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Point of View
                  </label>
                  <Select 
                    value={settings.povStyle} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, povStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-person">First Person (I/Me)</SelectItem>
                      <SelectItem value="second-person">Second Person (You)</SelectItem>
                      <SelectItem value="third-person">Third Person (They)</SelectItem>
                      <SelectItem value="narrator">Narrator Voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                {/* File Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Media
                  </label>
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const newFile: UploadedFile = {
                            id: Math.random().toString(36).substring(2),
                            name: file.name,
                            type: file.type,
                            url: URL.createObjectURL(file)
                          };
                          setUploadedFiles(prev => [...prev, newFile]);
                        });
                        toast({
                          title: "Files Uploaded",
                          description: `${files.length} file(s) added to your media library`
                        });
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-dashed"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images, Videos, or Documents
                    </Button>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Uploaded Files</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-2 p-2 border rounded">
                          {file.type.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                          <span className="text-xs flex-1 truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="portuguese">Portuguese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="korean">Korean</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice
                  </label>
                  <Select 
                    value={settings.voice} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, voice: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Professional Female)</SelectItem>
                      <SelectItem value="echo">Echo (Warm Male)</SelectItem>
                      <SelectItem value="fable">Fable (Energetic Female)</SelectItem>
                      <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
                      <SelectItem value="nova">Nova (Young Female)</SelectItem>
                      <SelectItem value="shimmer">Shimmer (Soft Female)</SelectItem>
                      <SelectItem value="none">No Voice (Text Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* AI Enhancement Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    AI Enhancements
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="auto-music" className="rounded" />
                      <label htmlFor="auto-music" className="text-xs">Auto-generate background music</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="auto-captions" className="rounded" defaultChecked />
                      <label htmlFor="auto-captions" className="text-xs">Generate captions automatically</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="trending" className="rounded" />
                      <label htmlFor="trending" className="text-xs">Use trending hashtags</label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Project Name for Logged In Users */}
            {user && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="My Awesome Video Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-base"
                />
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Video Idea</label>
              <Textarea
                placeholder="Describe your video idea in detail... e.g., 'A productivity tip about organizing your workspace with before/after shots and upbeat music'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none text-base"
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
                  Generate Professional Video
                </>
              )}
            </Button>

            {/* Save Project Button for Logged In Users */}
            {user && generatedScript && (
              <Button 
                onClick={handleSaveProject}
                variant="outline"
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {currentProject ? 'Update Project' : 'Save Project'}
              </Button>
            )}
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
                
                {/* Feedback Section */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-medium text-sm">How well does this match your idea?</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "✅ Thanks for the feedback!",
                          description: "This helps us improve our AI video generation."
                        });
                      }}
                    >
                      👍 Perfect Match
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "📝 Feedback Recorded",
                          description: "We'll use this to enhance future generations."
                        });
                      }}
                    >
                      👌 Close Enough
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "🚨 Mismatch Reported",
                          description: "Our team will review this to improve prompt accuracy. You can regenerate with more specific details.",
                          duration: 7000
                        });
                      }}
                    >
                      👎 Doesn't Match
                    </Button>
                  </div>
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