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

    const { uploadId, filePath, filename, fileSize } = await req.json();

    // Validate input
    if (!uploadId || !filePath || !filename || !fileSize) {
      throw new Error("Missing required fields: uploadId, filePath, filename, fileSize");
    }

    // Create upload record in database
    const { data: upload, error: uploadError } = await supabaseClient
      .from('uploads')
      .insert({
        id: uploadId,
        user_id: user.id,
        filename,
        file_path: filePath,
        file_size: fileSize,
        status: 'pending'
      })
      .select()
      .single();

    if (uploadError) {
      throw new Error(`Failed to create upload record: ${uploadError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        upload 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Upload complete error:", error);
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