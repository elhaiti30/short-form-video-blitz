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

    // For now, we'll use Runway ML API for video generation
    // You can also use other APIs like Stability AI, Luma AI, or Pika Labs
    const runwayApiKey = Deno.env.get('RUNWAY_API_KEY');
    
    if (!runwayApiKey) {
      // If no API key, return a contextual demo video based on prompt
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
        message: "Demo video generated based on your prompt. Connect Runway API for real AI video generation.",
        isDemo: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Real AI video generation with Runway ML Gen-3 Alpha
    console.log('Using Runway API for real video generation');
    
    const runwayResponse = await fetch('https://api.runwayml.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${runwayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gen3a_turbo',
        prompt: prompt,
        duration: Math.min(settings.duration || 5, 10), // Runway supports up to 10 seconds
        aspect_ratio: settings.platform === 'tiktok' || settings.platform === 'instagram' ? '9:16' : '16:9',
        seed: Math.floor(Math.random() * 1000000),
        watermark: false
      }),
    });

    console.log('Runway API response status:', runwayResponse.status);

    if (!runwayResponse.ok) {
      const errorText = await runwayResponse.text();
      console.error('Runway API error response:', errorText);
      throw new Error(`Runway API error (${runwayResponse.status}): ${errorText}`);
    }

    const runwayData = await runwayResponse.json();
    console.log('Runway API response data:', runwayData);
    
    const taskId = runwayData.id;
    if (!taskId) {
      throw new Error('No task ID received from Runway API');
    }

    console.log('Video generation started, task ID:', taskId);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes max wait time (5 second intervals)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;
      
      console.log(`Checking status attempt ${attempts}/${maxAttempts}`);
      
      const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${runwayApiKey}`,
        },
      });
      
      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        continue; // Continue trying
      }
      
      const statusData = await statusResponse.json();
      console.log('Status data:', statusData);
      
      if (statusData.status === 'SUCCEEDED' || statusData.status === 'COMPLETED') {
        const videoUrl = statusData.output?.[0] || statusData.artifacts?.[0]?.url;
        if (!videoUrl) {
          throw new Error('No video URL in completed response');
        }
        
        console.log('Video generation completed successfully:', videoUrl);
        
        return new Response(JSON.stringify({
          success: true,
          videoUrl: videoUrl,
          thumbnailUrl: videoUrl.replace('.mp4', '_thumb.jpg'),
          taskId: taskId,
          isDemo: false,
          message: "Real AI video generated successfully with Runway ML!"
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else if (statusData.status === 'FAILED' || statusData.status === 'ERROR') {
        throw new Error(`Video generation failed: ${statusData.failure_reason || 'Unknown error'}`);
      }
      
      // Status is still RUNNING/PENDING, continue polling
      console.log(`Video generation in progress... (${statusData.status})`);
    }
    
    throw new Error('Video generation timed out after 10 minutes');

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