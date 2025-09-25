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

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get upload ID from URL path
    const url = new URL(req.url);
    const uploadId = url.pathname.split('/').pop();

    if (!uploadId) {
      throw new Error("Upload ID is required");
    }

    // Fetch upload with jobs and cuts
    const { data: upload, error: uploadError } = await supabaseClient
      .from('uploads')
      .select(`
        *,
        jobs (*),
        cuts (*)
      `)
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (uploadError) {
      throw new Error(`Failed to fetch upload: ${uploadError.message}`);
    }

    if (!upload) {
      throw new Error("Upload not found or access denied");
    }

    // Generate download URLs for files
    let downloadUrls: { csv?: string; zip?: string } = {};

    if (upload.status === 'completed') {
      // Try to get CSV download URL
      const { data: csvUrl } = await supabaseClient.storage
        .from('dj-sets')
        .createSignedUrl(`${upload.file_path}.csv`, 3600); // 1 hour expiry

      if (csvUrl) {
        downloadUrls.csv = csvUrl.signedUrl;
      }

      // Try to get ZIP download URL  
      const { data: zipUrl } = await supabaseClient.storage
        .from('dj-sets')
        .createSignedUrl(`${upload.file_path}.zip`, 3600); // 1 hour expiry

      if (zipUrl) {
        downloadUrls.zip = zipUrl.signedUrl;
      }
    }

    return new Response(
      JSON.stringify({ 
        upload,
        downloadUrls 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get upload detail error:", error);
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