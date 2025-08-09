import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, settings } = await req.json();
    
    console.log('Generating video with prompt:', prompt);
    console.log('Video settings:', settings);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get API keys for different video generation platforms
    const runwayApiKey = Deno.env.get('RUNWAY_API_KEY');
    const lumaApiKey = Deno.env.get('LUMA_API_KEY');
    const pikaApiKey = Deno.env.get('PIKA_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('Available APIs:', {
      runway: !!runwayApiKey,
      luma: !!lumaApiKey,
      pika: !!pikaApiKey,
      openai: !!openaiApiKey
    });

    // Try different video generation APIs in order of preference
    const videoGenerationResults = await tryVideoGeneration(prompt, settings, {
      runwayApiKey,
      lumaApiKey,
      pikaApiKey,
      openaiApiKey
    });

    if (videoGenerationResults.success) {
      return new Response(JSON.stringify(videoGenerationResults), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If all APIs fail, return contextual demo video
    const getContextualDemoVideo = (prompt: string) => {
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('rain') || lowerPrompt.includes('city') || lowerPrompt.includes('street')) {
        return {
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          thumbnailUrl: "https://i.ytimg.com/vi/MNn9qKG2UFI/maxresdefault.jpg",
          description: "City scene with atmospheric lighting"
        };
      } else if (lowerPrompt.includes('nature') || lowerPrompt.includes('forest') || lowerPrompt.includes('landscape')) {
        return {
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
          thumbnailUrl: "https://i.ytimg.com/vi/eRsGyueVLvQ/maxresdefault.jpg",
          description: "Natural landscape scene"
        };
      } else if (lowerPrompt.includes('walking') || lowerPrompt.includes('person') || lowerPrompt.includes('man') || lowerPrompt.includes('woman')) {
        return {
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnailUrl: "https://i.ytimg.com/vi/YE7VzlLtp-4/maxresdefault.jpg", 
          description: "Character-focused scene"
        };
      } else {
        return {
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          thumbnailUrl: "https://i.ytimg.com/vi/pWvoFBZKHdw/maxresdefault.jpg",
          description: "Dynamic motion scene"
        };
      }
    };

    const demoVideo = getContextualDemoVideo(prompt);
    
    return new Response(JSON.stringify({
      success: true,
      videoUrl: demoVideo.videoUrl,
      thumbnailUrl: demoVideo.thumbnailUrl,
      message: `All video generation APIs failed. Showing demo video. Please check your API keys and try again. Error: ${videoGenerationResults.error}`,
      isDemo: true,
      errors: videoGenerationResults.errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-video function:', error);
    
    // Return demo video as fallback
    return new Response(JSON.stringify({
      success: true,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://i.ytimg.com/vi/YE7VzlLtp-4/maxresdefault.jpg",
      message: `Demo video provided due to error: ${error.message}`,
      isDemo: true,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Return 200 with demo video rather than error
    });
  }
});

// Main video generation function that tries multiple APIs
async function tryVideoGeneration(prompt: string, settings: any, apiKeys: any) {
  const errors: string[] = [];
  
  // Try Runway ML first
  if (apiKeys.runwayApiKey) {
    try {
      console.log('Trying Runway ML API...');
      const result = await generateWithRunway(prompt, settings, apiKeys.runwayApiKey);
      if (result.success) return result;
      errors.push(`Runway: ${result.error}`);
    } catch (error) {
      console.error('Runway error:', error);
      errors.push(`Runway: ${error.message}`);
    }
  }

  // Try Luma AI (Dream Machine)
  if (apiKeys.lumaApiKey) {
    try {
      console.log('Trying Luma AI API...');
      const result = await generateWithLuma(prompt, settings, apiKeys.lumaApiKey);
      if (result.success) return result;
      errors.push(`Luma: ${result.error}`);
    } catch (error) {
      console.error('Luma error:', error);
      errors.push(`Luma: ${error.message}`);
    }
  }

  // Try Pika Labs
  if (apiKeys.pikaApiKey) {
    try {
      console.log('Trying Pika Labs API...');
      const result = await generateWithPika(prompt, settings, apiKeys.pikaApiKey);
      if (result.success) return result;
      errors.push(`Pika: ${result.error}`);
    } catch (error) {
      console.error('Pika error:', error);
      errors.push(`Pika: ${error.message}`);
    }
  }

  // Try OpenAI as fallback (generate image and convert to video)
  if (apiKeys.openaiApiKey) {
    try {
      console.log('Trying OpenAI image generation as fallback...');
      const result = await generateWithOpenAI(prompt, settings, apiKeys.openaiApiKey);
      if (result.success) return result;
      errors.push(`OpenAI: ${result.error}`);
    } catch (error) {
      console.error('OpenAI error:', error);
      errors.push(`OpenAI: ${error.message}`);
    }
  }

  return {
    success: false,
    error: 'All video generation APIs failed',
    errors: errors
  };
}

// Runway ML video generation
async function generateWithRunway(prompt: string, settings: any, apiKey: string) {
  const response = await fetch('https://api.runwayml.com/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gen3a_turbo',
      prompt: prompt,
      duration: Math.min(settings.duration || 5, 10),
      aspect_ratio: settings.platform === 'tiktok' || settings.platform === 'instagram' ? '9:16' : '16:9',
      seed: Math.floor(Math.random() * 1000000),
      watermark: false
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `API error (${response.status}): ${errorText}` };
  }

  const data = await response.json();
  const taskId = data.id;
  
  if (!taskId) {
    return { success: false, error: 'No task ID received' };
  }

  // Poll for completion
  for (let attempts = 0; attempts < 120; attempts++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      
      if (statusData.status === 'SUCCEEDED' || statusData.status === 'COMPLETED') {
        const videoUrl = statusData.output?.[0] || statusData.artifacts?.[0]?.url;
        if (videoUrl) {
          return {
            success: true,
            videoUrl: videoUrl,
            thumbnailUrl: videoUrl.replace('.mp4', '_thumb.jpg'),
            taskId: taskId,
            isDemo: false,
            message: "Real AI video generated successfully with Runway ML!",
            platform: "Runway ML"
          };
        }
      } else if (statusData.status === 'FAILED' || statusData.status === 'ERROR') {
        return { success: false, error: `Generation failed: ${statusData.failure_reason || 'Unknown error'}` };
      }
    }
  }
  
  return { success: false, error: 'Generation timed out' };
}

// Luma AI video generation
async function generateWithLuma(prompt: string, settings: any, apiKey: string) {
  const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      aspect_ratio: settings.platform === 'tiktok' || settings.platform === 'instagram' ? '9:16' : '16:9',
      loop: false
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `API error (${response.status}): ${errorText}` };
  }

  const data = await response.json();
  const generationId = data.id;
  
  if (!generationId) {
    return { success: false, error: 'No generation ID received' };
  }

  // Poll for completion
  for (let attempts = 0; attempts < 120; attempts++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      
      if (statusData.state === 'completed') {
        const videoUrl = statusData.assets?.video;
        if (videoUrl) {
          return {
            success: true,
            videoUrl: videoUrl,
            thumbnailUrl: statusData.assets?.thumbnail || videoUrl.replace('.mp4', '_thumb.jpg'),
            generationId: generationId,
            isDemo: false,
            message: "Real AI video generated successfully with Luma AI!",
            platform: "Luma AI"
          };
        }
      } else if (statusData.state === 'failed') {
        return { success: false, error: `Generation failed: ${statusData.failure_reason || 'Unknown error'}` };
      }
    }
  }
  
  return { success: false, error: 'Generation timed out' };
}

// Pika Labs video generation
async function generateWithPika(prompt: string, settings: any, apiKey: string) {
  const response = await fetch('https://api.pika.art/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      aspectRatio: settings.platform === 'tiktok' || settings.platform === 'instagram' ? '9:16' : '16:9',
      options: {
        frameRate: 24,
        motion: 1,
        guidance: 16,
        negativePrompt: "blurry, low quality, distorted"
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `API error (${response.status}): ${errorText}` };
  }

  const data = await response.json();
  const jobId = data.job?.id;
  
  if (!jobId) {
    return { success: false, error: 'No job ID received' };
  }

  // Poll for completion
  for (let attempts = 0; attempts < 120; attempts++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await fetch(`https://api.pika.art/jobs/${jobId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      
      if (statusData.status === 'finished') {
        const videoUrl = statusData.result?.videos?.[0]?.url;
        if (videoUrl) {
          return {
            success: true,
            videoUrl: videoUrl,
            thumbnailUrl: statusData.result?.videos?.[0]?.thumbnail || videoUrl.replace('.mp4', '_thumb.jpg'),
            jobId: jobId,
            isDemo: false,
            message: "Real AI video generated successfully with Pika Labs!",
            platform: "Pika Labs"
          };
        }
      } else if (statusData.status === 'failed') {
        return { success: false, error: `Generation failed: ${statusData.error || 'Unknown error'}` };
      }
    }
  }
  
  return { success: false, error: 'Generation timed out' };
}

// OpenAI image generation as fallback
async function generateWithOpenAI(prompt: string, settings: any, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: `${prompt}. High quality, cinematic, detailed, professional photography`,
      n: 1,
      size: '1024x1024',
      quality: 'high',
      output_format: 'png'
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `API error (${response.status}): ${errorText}` };
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;
  
  if (!imageUrl) {
    return { success: false, error: 'No image URL received' };
  }

  // For now, return the image as a "static video" - you could convert to video with other services
  return {
    success: true,
    videoUrl: imageUrl,
    thumbnailUrl: imageUrl,
    isDemo: false,
    message: "High-quality image generated with OpenAI! (Static image as video fallback)",
    platform: "OpenAI",
    isStaticImage: true
  };
}