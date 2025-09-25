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

    const { filename, contentType, fileSize } = await req.json();

    // Validate input
    if (!filename || !contentType || !fileSize) {
      throw new Error("Missing required fields: filename, contentType, fileSize");
    }

    // Validate file size (4GB limit)
    if (fileSize > 4 * 1024 * 1024 * 1024) {
      throw new Error("File size exceeds 4GB limit");
    }

    // Validate content type
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac',
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'
    ];
    
    if (!allowedTypes.includes(contentType)) {
      throw new Error("Unsupported file type");
    }

    // Generate unique upload ID and file path
    const uploadId = crypto.randomUUID();
    const fileExtension = filename.split('.').pop();
    const filePath = `${user.id}/${uploadId}.${fileExtension}`;

    // Create presigned URL for upload
    const { data: signedUrl } = await supabaseClient.storage
      .from('dj-sets')
      .createSignedUploadUrl(filePath, {
        upsert: true
      });

    if (!signedUrl) {
      throw new Error("Failed to create presigned upload URL");
    }

    return new Response(
      JSON.stringify({
        uploadId,
        uploadUrl: signedUrl.signedUrl,
        filePath,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Presign error:", error);
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