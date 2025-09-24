import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, settings } = await req.json()
    
    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get OpenAI API key from secrets
    const { data: secretData, error: secretError } = await supabase
      .from('vault.decrypted_secrets')
      .select('secret')
      .eq('name', 'OPENAI_API_KEY')
      .single()

    const openaiApiKey = secretData?.secret || Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      console.log('No OpenAI API key found, using fallback script generation')
      
      // Fallback script generation
      const fallbackScript = generateFallbackScript(prompt, settings)
      
      return new Response(
        JSON.stringify({
          success: true,
          script: fallbackScript,
          message: 'Generated using fallback method. Add OpenAI API key for enhanced AI scripts.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate script using OpenAI
    const script = await generateAIScript(prompt, settings, openaiApiKey)
    
    return new Response(
      JSON.stringify({
        success: true,
        script: script,
        platform: 'OpenAI',
        settings: settings
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating script:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Script generation failed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function generateAIScript(prompt: string, settings: any, apiKey: string): Promise<string> {
  const { platform, duration, tone, audience, industry, cta, hook_style, language } = settings

  const systemPrompt = `You are a viral content script writer specializing in ${platform} videos. 

Create an engaging ${duration}-second script that:
- Uses a ${hook_style} style hook to grab attention immediately
- Maintains a ${tone} tone throughout
- Targets ${audience} audience in the ${industry} industry
- Written in ${language}
- Ends with a ${cta} call-to-action
- Optimized for ${platform} format and algorithm

Structure the script with:
1. HOOK (0-3s): Strong opening that stops scrolling
2. BODY (middle): Main content with clear value
3. CTA (last 3-5s): Clear call-to-action

Make it conversational, engaging, and designed to go viral. Include timing cues in brackets like [0-3s], [4-15s], etc.`

  const userPrompt = `Create a ${duration}-second ${platform} script about: "${prompt}"`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 800,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Failed to generate script'
}

function generateFallbackScript(prompt: string, settings: any): string {
  const { platform, duration, tone, audience, hook_style, cta } = settings
  
  const hooks = {
    question: `❓ Ever wondered about ${prompt}?`,
    statistic: `🔥 Did you know that 90% of people don't know about ${prompt}?`,
    story: `📖 Let me tell you about ${prompt}...`,
    problem: `⚠️ Are you struggling with ${prompt}?`,
    controversy: `🚨 Unpopular opinion: ${prompt}`,
    'how-to': `✅ Here's exactly how to ${prompt}`
  }

  const ctas = {
    engagement: `💭 What's your experience with this? Let me know in the comments!`,
    follow: `🔔 Follow for more tips like this!`,
    website: `🔗 Link in bio for more details!`,
    product: `💎 Check out our solution - link in bio!`,
    subscribe: `👆 Subscribe for weekly content like this!`,
    download: `📱 Download the app using the link below!`
  }

  const toneAdjustments = {
    engaging: "Get ready to be amazed! 🤩",
    professional: "Here's what industry experts recommend:",
    conversational: "So here's the thing...",
    educational: "Let's break this down step by step:",
    humorous: "Okay, this is actually pretty funny... 😅",
    inspirational: "You have the power to change this! 💪"
  }

  const selectedHook = hooks[hook_style as keyof typeof hooks] || hooks.question
  const selectedCta = ctas[cta as keyof typeof ctas] || ctas.engagement
  const toneIntro = toneAdjustments[tone as keyof typeof toneAdjustments] || ""

  let script = `🎬 ${duration}s ${platform.toUpperCase()} SCRIPT\n\n`
  
  script += `[0-3s] HOOK:\n${selectedHook}\n\n`
  
  if (duration >= 30) {
    script += `[4-8s] SETUP:\n${toneIntro}\n\n`
    script += `[9-20s] MAIN CONTENT:\n📌 Key Point 1: About ${prompt}\n📌 Key Point 2: Why it matters\n📌 Key Point 3: How to implement\n\n`
    script += `[21-${duration-5}s] VALUE:\nThis changes everything because...\n\n`
  } else {
    script += `[4-${duration-5}s] MAIN CONTENT:\nHere's what you need to know about ${prompt}...\n\n`
  }
  
  script += `[${duration-4}s-${duration}s] CTA:\n${selectedCta}\n\n`
  
  script += `💡 PRO TIP: Adjust timing based on your speaking pace!\n`
  script += `🎯 Platform: ${platform} | Tone: ${tone} | Audience: ${audience}`

  return script
}