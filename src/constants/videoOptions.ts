import { Smartphone, MonitorPlay } from "lucide-react";

export const PLATFORMS = [
  { value: "tiktok", label: "TikTok", ratio: "9:16", icon: Smartphone },
  { value: "instagram", label: "Instagram Reels", ratio: "9:16", icon: Smartphone },
  { value: "youtube", label: "YouTube Shorts", ratio: "9:16", icon: MonitorPlay },
] as const;

export const STYLES = [
  "Cinematic",
  "Animated",
  "Realistic",
  "Artistic",
  "Documentary",
  "Fast-paced",
] as const;

export const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "arabic", label: "Arabic" },
] as const;

export const VOICES = [
  { value: "alloy", label: "Alloy (Neutral)" },
  { value: "echo", label: "Echo (Male)" },
  { value: "fable", label: "Fable (British)" },
  { value: "onyx", label: "Onyx (Deep)" },
  { value: "nova", label: "Nova (Female)" },
  { value: "shimmer", label: "Shimmer (Soft)" },
] as const;

export const POV_STYLES = [
  { value: "first-person", label: "First Person" },
  { value: "third-person", label: "Third Person" },
  { value: "narrator", label: "Narrator" },
] as const;

export const INDUSTRIES = [
  { value: "general", label: "General" },
  { value: "tech", label: "Technology" },
  { value: "fitness", label: "Fitness" },
  { value: "food", label: "Food & Cooking" },
  { value: "fashion", label: "Fashion" },
  { value: "education", label: "Education" },
] as const;

export const TONES = [
  { value: "engaging", label: "Engaging" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "humorous", label: "Humorous" },
  { value: "dramatic", label: "Dramatic" },
] as const;

export const QUALITY_OPTIONS = [
  { value: "hd", label: "HD (1080p)" },
  { value: "4k", label: "4K Ultra HD" },
  { value: "standard", label: "Standard (720p)" },
] as const;

export const DEFAULT_SETTINGS = {
  platform: "tiktok",
  duration: 30,
  style: "cinematic",
  quality: "hd",
  language: "english",
  voice: "alloy",
  povStyle: "first-person",
  industry: "general",
  tone: "engaging",
} as const;
