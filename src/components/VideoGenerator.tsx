import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useVideoData } from "@/hooks/useVideoData";
import { LogIn, Sparkles, Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS } from "@/constants/videoOptions";
import { analyzePrompt, generateContextualScript, showPreviewToast } from "@/utils/videoHelpers";
import { VideoGeneratorForm } from "@/components/video-generator/VideoGeneratorForm";
import { VideoGeneratorSettings } from "@/components/video-generator/VideoGeneratorSettings";
import { VideoGeneratorPreview } from "@/components/video-generator/VideoGeneratorPreview";
import { Button } from "@/components/ui/button";

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

const VideoGenerator = () => {
  const { user, subscription } = useAuth();
  const { createProject, updateProject } = useVideoData();
  const navigate = useNavigate();
  const isSubscribed = subscription?.subscribed;
  
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [isStaticImageResult, setIsStaticImageResult] = useState(false);

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
        media_assets: []
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a video description",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate videos",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!isSubscribed) {
      toast({
        title: "Premium required",
        description: "Upgrade to premium to generate unlimited videos",
        variant: "destructive"
      });
      navigate('/pricing');
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
      
      // Phase 2: Show preview
      toast({
        title: "🎬 Planning Video",
        description: `Scene: ${promptAnalysis.sceneDescription.substring(0, 50)}...`
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showPreviewToast(promptAnalysis);
      
      // Phase 3: Generate script
      toast({
        title: "📝 Creating Script",
        description: "Writing engaging content based on your video idea..."
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const contextualScript = generateContextualScript(promptAnalysis, settings);
      setGeneratedScript(contextualScript);
      
      // Phase 4: Generate video
      toast({
        title: "🎥 Generating AI Video",
        description: `Creating ${settings.style} style video... This may take a few minutes.`
      });

      const { data: videoData, error: videoError } = await supabase.functions.invoke('generate-video', {
        body: {
          prompt: prompt,
          settings: settings
        }
      });

      if (videoError) {
        console.error('Supabase function error:', videoError);
        throw new Error(`Video generation failed: ${videoError.message}`);
      }

      if (videoData?.success) {
        setGeneratedVideo(videoData.videoUrl);
        setIsStaticImageResult(!!videoData.isStaticImage);
        
        if (videoData.isDemo) {
          toast({
            title: "⚠️ Demo Video Generated",
            description: videoData.message || "This is a demo video. Add API keys in Supabase settings to generate real AI videos.",
            duration: 8000,
            variant: "destructive"
          });
        } else {
          const platformName = videoData.platform || "AI";
          const isStaticImage = videoData.isStaticImage;
          
          toast({
            title: `🎉 ${isStaticImage ? 'Image' : 'Video'} Generated!`,
            description: `Successfully created with ${platformName}! ${isStaticImage ? 'Static image as fallback.' : `Video captures: ${promptAnalysis.visualElements.slice(0, 3).join(', ')}`}`,
            duration: 8000
          });
        }
        
        if (videoData.errors && videoData.errors.length > 0) {
          console.log('API errors encountered:', videoData.errors);
          setTimeout(() => {
            toast({
              title: "ℹ️ API Status",
              description: `Some APIs failed: ${videoData.errors.slice(0, 2).join(', ')}. ${videoData.platform ? `Successfully used ${videoData.platform}.` : ''}`,
              duration: 6000
            });
          }, 2000);
        }
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

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `video-${Date.now()}.${isStaticImageResult ? 'png' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started!",
        description: isStaticImageResult ? "Your image is downloading" : "Your video is downloading"
      });
    }
  };

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

      {/* Header */}
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

      {/* Main Content */}
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
          <CardContent>
            <VideoGeneratorSettings 
              settings={settings}
              onSettingsChange={setSettings}
            />
          </CardContent>
        </Card>

        {/* Form and Preview */}
        <div className="lg:col-span-2 space-y-8">
          <VideoGeneratorForm
            prompt={prompt}
            projectName={projectName}
            onPromptChange={setPrompt}
            onProjectNameChange={setProjectName}
            onGenerate={handleGenerate}
            onSave={handleSaveProject}
            isGenerating={isGenerating}
            isAuthenticated={!!user}
          />

          <VideoGeneratorPreview
            generatedVideo={generatedVideo}
            generatedScript={generatedScript}
            isStaticImageResult={isStaticImageResult}
            platform={settings.platform}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
