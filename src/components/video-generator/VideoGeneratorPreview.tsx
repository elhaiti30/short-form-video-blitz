import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Copy, Video, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoGeneratorPreviewProps {
  generatedVideo: string | null;
  generatedScript: string;
  isStaticImageResult: boolean;
  platform: string;
  onDownload: () => void;
}

export const VideoGeneratorPreview = ({
  generatedVideo,
  generatedScript,
  isStaticImageResult,
  platform,
  onDownload
}: VideoGeneratorPreviewProps) => {
  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    toast({
      title: "Script copied!",
      description: "Script has been copied to clipboard"
    });
  };

  if (!generatedVideo && !generatedScript) {
    return (
      <Card className="p-12 text-center border-dashed">
        <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No video generated yet</h3>
        <p className="text-muted-foreground">
          Enter your video idea and click "Generate Video" to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video/Image Preview */}
      {generatedVideo && (
        <Card className="overflow-hidden">
          <div className="relative aspect-[9/16] bg-muted flex items-center justify-center">
            {isStaticImageResult ? (
              <img
                src={generatedVideo}
                alt="Generated content"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={generatedVideo}
                controls
                className="w-full h-full object-cover"
              />
            )}
            <Badge className="absolute top-4 right-4">
              {isStaticImageResult ? (
                <>
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Image
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Video
                </>
              )}
            </Badge>
          </div>
          <div className="p-4 flex gap-2">
            <Button onClick={onDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </Card>
      )}

      {/* Generated Script */}
      {generatedScript && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Generated Script</h3>
            <Button variant="outline" size="sm" onClick={handleCopyScript}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
              {generatedScript}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};
