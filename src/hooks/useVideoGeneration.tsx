import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzePrompt, generateContextualScript, showPreviewToast } from "@/utils/videoHelpers";

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

export const useVideoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [isStaticImageResult, setIsStaticImageResult] = useState(false);

  const generateVideo = async (prompt: string, settings: VideoSettings) => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video description",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsGenerating(true);

    try {
      // Phase 1: Analyze prompt
      toast({
        title: "🧠 Analyzing Prompt",
        description: "Breaking down your video idea into visual elements...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const promptAnalysis = analyzePrompt(prompt);

      // Phase 2: Show preview
      toast({
        title: "🎬 Planning Video",
        description: `Scene: ${promptAnalysis.sceneDescription.substring(0, 50)}...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      showPreviewToast(promptAnalysis);

      // Phase 3: Generate script
      toast({
        title: "📝 Creating Script",
        description: "Writing engaging content based on your video idea...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const contextualScript = generateContextualScript(promptAnalysis, settings);
      setGeneratedScript(contextualScript);

      // Phase 4: Generate video
      toast({
        title: "🎥 Generating AI Video",
        description: `Creating ${settings.style} style video... This may take a few minutes.`,
      });

      const { data: videoData, error: videoError } = await supabase.functions.invoke(
        "generate-video",
        {
          body: {
            prompt: prompt,
            settings: settings,
          },
        }
      );

      if (videoError) {
        console.error("Supabase function error:", videoError);
        throw new Error(`Video generation failed: ${videoError.message}`);
      }

      if (videoData?.success) {
        setGeneratedVideo(videoData.videoUrl);
        setIsStaticImageResult(!!videoData.isStaticImage);

        if (videoData.isDemo) {
          toast({
            title: "⚠️ Demo Video Generated",
            description:
              videoData.message ||
              "This is a demo video. Add API keys in Supabase settings to generate real AI videos.",
            duration: 8000,
            variant: "destructive",
          });
        } else {
          const platformName = videoData.platform || "AI";
          const isStaticImage = videoData.isStaticImage;

          toast({
            title: `🎉 ${isStaticImage ? "Image" : "Video"} Generated!`,
            description: `Successfully created with ${platformName}! ${
              isStaticImage
                ? "Static image as fallback."
                : `Video captures: ${promptAnalysis.visualElements.slice(0, 3).join(", ")}`
            }`,
            duration: 8000,
          });
        }

        if (videoData.errors && videoData.errors.length > 0) {
          console.log("API errors encountered:", videoData.errors);
          setTimeout(() => {
            toast({
              title: "ℹ️ API Status",
              description: `Some APIs failed: ${videoData.errors.slice(0, 2).join(", ")}. ${
                videoData.platform ? `Successfully used ${videoData.platform}.` : ""
              }`,
              duration: 6000,
            });
          }, 2000);
        }

        return { success: true, videoUrl: videoData.videoUrl, script: contextualScript };
      } else {
        throw new Error("Video generation returned no result");
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Video generation error:", error);
      return { success: false };
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGeneration = () => {
    setGeneratedVideo(null);
    setGeneratedScript("");
    setIsStaticImageResult(false);
  };

  return {
    isGenerating,
    generatedVideo,
    generatedScript,
    isStaticImageResult,
    generateVideo,
    resetGeneration,
  };
};
