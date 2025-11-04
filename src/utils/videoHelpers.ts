import { toast } from "@/hooks/use-toast";

export const analyzePrompt = (userPrompt: string) => {
  const keywords = userPrompt.toLowerCase().split(/\s+/);
  const visualElements: string[] = [];
  const actions: string[] = [];
  const settings: string[] = [];
  const moods: string[] = [];

  const keywordMappings = {
    weather: ['rain', 'sunny', 'snow', 'storm', 'cloudy', 'foggy'],
    people: ['man', 'woman', 'child', 'person', 'people', 'walking', 'running', 'sitting'],
    locations: ['city', 'street', 'park', 'beach', 'forest', 'mountain', 'building', 'house'],
    actions: ['walking', 'running', 'dancing', 'working', 'playing', 'eating', 'drinking'],
    moods: ['old', 'modern', 'vintage', 'futuristic', 'peaceful', 'busy', 'quiet', 'chaotic']
  };

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

export const generateContextualScript = (promptAnalysis: any, videoSettings: any) => {
  const { originalPrompt, visualElements, actions, settings } = promptAnalysis || {};

  let script = `🎬 ${originalPrompt || ''}\n\n`;

  if (visualElements && visualElements.includes('rain')) {
    script += "☔ When the rain starts falling, magic happens...\n\n";
  } else if (actions && actions.includes('walking')) {
    script += "🚶‍♂️ Every step tells a story...\n\n";
  } else if (settings && settings.includes('city')) {
    script += "🏙️ In the heart of the city, life unfolds...\n\n";
  } else {
    script += "✨ Transform your day with this amazing scene!\n\n";
  }

  script += `🎭 Style: ${videoSettings.style.charAt(0).toUpperCase() + videoSettings.style.slice(1)}\n`;
  script += `📍 Setting: ${settings.join(', ').charAt(0).toUpperCase() + settings.join(', ').slice(1)}\n`;
  script += `🎬 Featuring: ${visualElements.join(', ')}\n\n`;

  const platformEndings: Record<string, string> = {
    tiktok: "💫 Perfect for your FYP! #fyp #viral #cinematic",
    instagram: "📸 Story-worthy content! #reels #instagram #aesthetic", 
    youtube: "🎥 Subscribe for more! #shorts #youtube #content"
  };

  script += platformEndings[videoSettings.platform] || "✨ Amazing content awaits!";

  return script;
};

export const showPreviewToast = (promptAnalysis: any) => {
  toast({
    title: "🎬 Video Preview Ready",
    description: "Review the planned video content below. Generate to proceed with this concept.",
    duration: 5000
  });
};

export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
  switch (status) {
    case "scheduled":
    case "completed":
      return "default";
    case "pending":
    case "processing":
      return "secondary";
    case "draft":
    default:
      return "outline";
  }
};
