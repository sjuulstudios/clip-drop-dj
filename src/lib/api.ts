import { supabase } from '@/integrations/supabase/client';

const SUPABASE_FUNCTIONS_URL = `https://bepfythffyyzvazxakvs.supabase.co/functions/v1`;

// Helper function to make authenticated requests to Supabase Edge Functions
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }

  return response.json();
};

// API functions
export const api = {
  // Validate session
  validateSession: () => 
    makeAuthenticatedRequest('auth-session-validate'),

  // Get presigned upload URL
  getPresignedUploadUrl: (filename: string, contentType: string, fileSize: number) =>
    makeAuthenticatedRequest('upload-presign', {
      method: 'POST',
      body: JSON.stringify({ filename, contentType, fileSize }),
    }),

  // Complete upload
  completeUpload: (uploadId: string, filePath: string, filename: string, fileSize: number) =>
    makeAuthenticatedRequest('upload-complete', {
      method: 'POST',
      body: JSON.stringify({ uploadId, filePath, filename, fileSize }),
    }),

  // Get user uploads
  getUploads: () => 
    makeAuthenticatedRequest('get-uploads'),

  // Get upload detail
  getUploadDetail: (uploadId: string) =>
    makeAuthenticatedRequest(`get-upload-detail/${uploadId}`),

  // Trigger audio processing
  processAudio: async (uploadId: string) => {
    // Since this doesn't need auth, we call it directly
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/process-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uploadId }),
    });

    if (!response.ok) {
      throw new Error('Failed to start processing');
    }

    return response.json();
  },
};