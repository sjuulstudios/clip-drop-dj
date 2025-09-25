import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { uploadId } = await req.json();

    if (!uploadId) {
      throw new Error("Upload ID is required");
    }

    // Verify upload exists
    const { data: upload, error: uploadError } = await supabaseClient
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (uploadError || !upload) {
      throw new Error("Upload not found");
    }

    // Create a processing job
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .insert({
        upload_id: uploadId,
        job_type: 'detect',
        status: 'pending'
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to create processing job: ${jobError.message}`);
    }

    // Update upload status to processing
    await supabaseClient
      .from('uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId);

    // In a real implementation, you would trigger your audio processing worker here
    // For now, we'll simulate processing with a background task
    setTimeout(async () => {
      try {
        // Update job status to processing
        await supabaseClient
          .from('jobs')
          .update({ 
            status: 'processing',
            started_at: new Date().toISOString()
          })
          .eq('id', job.id);

        // Simulate processing time
        setTimeout(async () => {
          try {
            // Create some dummy cuts for demonstration
            const dummyCuts = [
              { upload_id: uploadId, start_time: 30.5, end_time: 32.0, confidence: 0.95, cut_type: 'drop' },
              { upload_id: uploadId, start_time: 125.2, end_time: 127.1, confidence: 0.87, cut_type: 'drop' },
              { upload_id: uploadId, start_time: 240.8, end_time: 242.5, confidence: 0.92, cut_type: 'drop' }
            ];

            // Insert cuts
            await supabaseClient
              .from('cuts')
              .insert(dummyCuts);

            // Update job as completed
            await supabaseClient
              .from('jobs')
              .update({ 
                status: 'completed',
                completed_at: new Date().toISOString()
              })
              .eq('id', job.id);

            // Update upload as completed
            await supabaseClient
              .from('uploads')
              .update({ 
                status: 'completed',
                duration_seconds: 300 // Mock 5 minute duration
              })
              .eq('id', uploadId);

          } catch (error) {
            console.error('Processing simulation error:', error);
            const errorMessage = error instanceof Error ? error.message : "Unknown processing error";
            
            // Mark job as failed
            await supabaseClient
              .from('jobs')
              .update({ 
                status: 'failed',
                completed_at: new Date().toISOString(),
                error_message: errorMessage
              })
              .eq('id', job.id);

            // Mark upload as failed
            await supabaseClient
              .from('uploads')
              .update({ status: 'failed' })
              .eq('id', uploadId);
          }
        }, 8000); // Complete after 8 seconds
      } catch (error) {
        console.error('Processing start error:', error);
      }
    }, 1000); // Start processing after 1 second

    return new Response(
      JSON.stringify({ 
        success: true,
        jobId: job.id,
        message: "Audio processing started"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Process audio error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
      }
    );
  }
});