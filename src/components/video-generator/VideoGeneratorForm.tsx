import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Wand2, Save } from "lucide-react";

interface VideoGeneratorFormProps {
  prompt: string;
  projectName: string;
  onPromptChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onGenerate: () => void;
  onSave: () => void;
  isGenerating: boolean;
  isAuthenticated: boolean;
}

export const VideoGeneratorForm = ({
  prompt,
  projectName,
  onPromptChange,
  onProjectNameChange,
  onGenerate,
  onSave,
  isGenerating,
  isAuthenticated
}: VideoGeneratorFormProps) => {
  return (
    <Card className="premium-card lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="h-7 w-7 text-primary" />
          Create Your Video
        </CardTitle>
        <CardDescription className="text-base">
          Describe what you want and let AI bring your vision to life
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Name */}
        {isAuthenticated && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              placeholder="My Awesome Video"
              className="text-base"
            />
          </div>
        )}

        {/* Video Prompt */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Video Description</label>
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe your video idea... Example: 'A cinematic video of a sunset over mountains with dramatic clouds'"
            className="min-h-[180px] text-base resize-none"
          />
          <p className="text-xs text-muted-foreground">
            💡 Tip: Be specific! Include details about setting, mood, actions, and style for best results.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1 premium-button text-white h-12 text-base"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Video
              </>
            )}
          </Button>
          
          {isAuthenticated && (
            <Button
              onClick={onSave}
              disabled={!prompt.trim()}
              variant="outline"
              size="lg"
              className="h-12"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
