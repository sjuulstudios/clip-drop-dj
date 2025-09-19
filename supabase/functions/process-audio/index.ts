import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This is a simplified version - in production you'd use a worker service
// with ffmpeg and librosa for actual audio processing
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { uploadId } = await req.json()

    if (!uploadId) {
      return new Response(
        JSON.stringify({ error: 'Upload ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update job status to processing
    await supabase
      .from('jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('upload_id', uploadId)
      .eq('type', 'detect')

    // Simulate audio processing - in production this would:
    // 1. Download audio file from storage
    // 2. Extract audio using ffmpeg
    // 3. Analyze using librosa for drop detection
    // 4. Generate cuts.csv and clips if needed
    // 5. Upload results to storage

    // For demo purposes, simulate some processing time and create mock cuts
    await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second delay

    const mockCuts = [
      { time_seconds: 45.2, confidence: 0.9 },
      { time_seconds: 125.7, confidence: 0.8 },
      { time_seconds: 234.1, confidence: 0.95 },
      { time_seconds: 312.8, confidence: 0.7 },
      { time_seconds: 445.3, confidence: 0.85 }
    ]

    // Insert cuts into database
    const cutsData = mockCuts.map(cut => ({
      upload_id: uploadId,
      time_seconds: cut.time_seconds,
      confidence: cut.confidence
    }))

    await supabase
      .from('cuts')
      .insert(cutsData)

    // Create mock CSV content
    const csvContent = 'time_seconds,time_formatted,confidence\n' + 
      mockCuts.map(cut => {
        const minutes = Math.floor(cut.time_seconds / 60)
        const seconds = (cut.time_seconds % 60).toFixed(3)
        const formatted = `${minutes}:${seconds.padStart(6, '0')}`
        return `${cut.time_seconds},${formatted},${cut.confidence}`
      }).join('\n')

    // Upload CSV to storage
    const { error: csvError } = await supabase.storage
      .from('dj-sets')
      .upload(`outputs/${uploadId}/cuts.csv`, csvContent, {
        contentType: 'text/csv',
        upsert: true
      })

    if (csvError) {
      console.error('Error uploading CSV:', csvError)
    }

    // Update upload and job status
    await supabase
      .from('uploads')
      .update({ 
        status: 'done',
        duration_seconds: Math.max(...mockCuts.map(c => c.time_seconds)) + 60
      })
      .eq('id', uploadId)

    await supabase
      .from('jobs')
      .update({ 
        status: 'done',
        finished_at: new Date().toISOString()
      })
      .eq('upload_id', uploadId)
      .eq('type', 'detect')

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Processing completed',
        cuts: mockCuts.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in process-audio function:', error)
    
    // Update job status to failed
    const { uploadId } = await req.json().catch(() => ({}))
    if (uploadId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      )
      
      await supabase
        .from('jobs')
        .update({ 
          status: 'failed',
          error_message: error.message,
          finished_at: new Date().toISOString()
        })
        .eq('upload_id', uploadId)
        .eq('type', 'detect')
    }

    return new Response(
      JSON.stringify({ error: 'Processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})