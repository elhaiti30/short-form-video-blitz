import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { PLATFORMS, STYLES, LANGUAGES, VOICES, POV_STYLES, INDUSTRIES, TONES, QUALITY_OPTIONS } from "@/constants/videoOptions";

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

interface VideoGeneratorSettingsProps {
  settings: VideoSettings;
  onSettingsChange: (settings: VideoSettings) => void;
}


export const VideoGeneratorSettings = ({ settings, onSettingsChange }: VideoGeneratorSettingsProps) => {
  const updateSetting = (key: keyof VideoSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
        <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
        <TabsTrigger value="voice" className="text-xs">Voice</TabsTrigger>
        <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <Select value={settings.platform} onValueChange={(value) => updateSetting('platform', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => {
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
            onValueChange={(value) => updateSetting('duration', value[0])}
            max={60}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quality</label>
          <Select value={settings.quality} onValueChange={(value) => updateSetting('quality', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_OPTIONS.map((quality) => (
                <SelectItem key={quality.value} value={quality.value}>
                  {quality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        {/* Style */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Video Style</label>
          <Select value={settings.style} onValueChange={(value) => updateSetting('style', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((style) => (
                <SelectItem key={style.toLowerCase()} value={style.toLowerCase()}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Industry</label>
          <Select value={settings.industry} onValueChange={(value) => updateSetting('industry', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tone</label>
          <Select value={settings.tone} onValueChange={(value) => updateSetting('tone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="voice" className="space-y-4">
        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <Select value={settings.voice} onValueChange={(value) => updateSetting('voice', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        {/* POV Style */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Point of View</label>
          <Select value={settings.povStyle} onValueChange={(value) => updateSetting('povStyle', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POV_STYLES.map((pov) => (
                <SelectItem key={pov.value} value={pov.value}>
                  {pov.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  );
};
