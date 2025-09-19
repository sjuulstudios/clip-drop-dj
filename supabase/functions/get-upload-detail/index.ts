import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const uploadId = url.pathname.split('/').pop()

    if (!uploadId) {
      return new Response(
        JSON.stringify({ error: 'Upload ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get upload details with cuts and jobs
    const { data: upload, error } = await supabase
      .from('uploads')
      .select(`
        *,
        jobs (
          id,
          type,
          status,
          created_at,
          started_at,
          finished_at,
          error_message
        ),
        cuts (
          id,
          time_seconds,
          confidence
        )
      `)
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching upload:', error)
      return new Response(
        JSON.stringify({ error: 'Upload not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate download URLs if processing is complete
    let downloadUrls = null
    if (upload.status === 'done' && upload.s3_output_prefix) {
      try {
        const { data: csvUrl } = await supabase.storage
          .from('dj-sets')
          .createSignedUrl(`${upload.s3_output_prefix}cuts.csv`, 3600)

        const { data: zipUrl } = await supabase.storage
          .from('dj-sets')
          .createSignedUrl(`${upload.s3_output_prefix}clips.zip`, 3600)

        downloadUrls = {
          csv: csvUrl?.signedUrl,
          zip: zipUrl?.signedUrl
        }
      } catch (urlError) {
        console.error('Error generating download URLs:', urlError)
      }
    }

    return new Response(
      JSON.stringify({ 
        upload,
        downloadUrls 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-upload-detail function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})