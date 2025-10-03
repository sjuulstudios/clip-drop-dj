import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

export interface Upload {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  duration_seconds?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  jobs?: Array<{
    id: string;
    job_type: 'detect' | 'split';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    started_at?: string;
    completed_at?: string;
    error_message?: string;
  }>;
  cuts?: Array<{
    id: string;
    start_time: number;
    end_time?: number;
    confidence?: number;
    cut_type?: string;
  }>;
}

export const useUploads = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const data = await api.getUploads();
      setUploads(data.uploads || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch uploads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
    try {
      console.log('Getting presigned URL...');
      
      // Get presigned upload URL
      const { uploadId, uploadUrl, token, filePath } = await api.getPresignedUploadUrl(
        file.name,
        file.type,
        file.size
      );

      console.log('Uploading file to storage...', { uploadId, filePath });
      
      // The uploadUrl from presign is already a complete signed URL with token as query parameter
      console.log('Using presigned URL for upload:', uploadUrl);

      // Ensure absolute URL and log helpful diagnostics
      let finalUploadUrl = uploadUrl;
      try {
        const isAbsolute = /^https?:\/\//.test(uploadUrl);
        if (!isAbsolute) {
          const SUPABASE_URL = 'https://bepfythffyyzvazxakvs.supabase.co';
          finalUploadUrl = `${SUPABASE_URL}${uploadUrl.startsWith('/') ? '' : '/'}${uploadUrl}`;
        }
      } catch (e) {
        console.warn('Failed to normalize upload URL, using raw value.', e);
      }

      console.log('Final upload URL:', finalUploadUrl, {
        hasTokenInQuery: finalUploadUrl.includes('token='),
        tokenPreview: token ? token.slice(0, 8) + '...' : 'none',
        filePath,
      });

      // Try XHR upload first for real progress; fallback to SDK if token/URL issues occur
      let uploaded = false;
      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              console.log(`Upload progress: ${percentComplete.toFixed(1)}%`);
              onProgress?.(percentComplete);
            }
          });

          // Handle completion
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log('File uploaded successfully via XHR');
              resolve();
            } else {
              console.error('Upload failed with status:', xhr.status);
              let errorMessage = `Upload failed with status ${xhr.status}`;
              
              // Try to parse error response
              try {
                const errorData = JSON.parse(xhr.responseText);
                errorMessage = errorData.message || errorData.error || errorMessage;
              } catch {
                errorMessage = xhr.responseText || errorMessage;
              }
              
              console.error('Error details:', errorMessage);
              reject(new Error(errorMessage));
            }
          });

          // Handle errors
          xhr.addEventListener('error', () => {
            console.error('Upload error:', xhr.statusText);
            reject(new Error('Network error during upload'));
          });

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'));
          });

          // Open connection and send file
          xhr.open('PUT', finalUploadUrl, true);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.setRequestHeader('x-upsert', 'true');
          xhr.send(file);
        });
        uploaded = true;
      } catch (xhrErr) {
        const msg = xhrErr instanceof Error ? xhrErr.message.toLowerCase() : String(xhrErr).toLowerCase();
        const tokenHint = msg.includes('token') || msg.includes("querystring must have required property 'token'");
        if (tokenHint) {
          console.warn('XHR upload failed due to token URL issue. Falling back to supabase-js uploadToSignedUrl.');
          const { error: fallbackError } = await supabase.storage
            .from('dj-sets')
            .uploadToSignedUrl(filePath, token, file);
          if (fallbackError) {
            console.error('Fallback upload failed:', fallbackError.message);
            throw new Error(`Fallback upload failed: ${fallbackError.message}`);
          }
          onProgress?.(100);
          uploaded = true;
        } else {
          throw xhrErr;
        }
      }

      if (!uploaded) {
        throw new Error('Upload could not be completed');
      }

      console.log('File uploaded successfully, completing upload...');

      // Complete upload
      await api.completeUpload(uploadId, filePath, file.name, file.size);

      console.log('Upload completed, starting processing...');

      // Trigger processing
      await api.processAudio(uploadId);

      console.log('Processing started');

      // Refresh uploads list
      await fetchUploads();

      return uploadId;
    } catch (err) {
      console.error('Upload error:', err);
      throw new Error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  return {
    uploads,
    loading,
    error,
    uploadFile,
    refetch: fetchUploads,
  };
};

export const useUploadDetail = (uploadId: string) => {
  const [upload, setUpload] = useState<Upload | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<{ csv?: string; zip?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUploadDetail = async () => {
      try {
        setLoading(true);
        const data = await api.getUploadDetail(uploadId);
        setUpload(data.upload);
        setDownloadUrls(data.downloadUrls);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch upload details');
      } finally {
        setLoading(false);
      }
    };

    if (uploadId) {
      fetchUploadDetail();
    }
  }, [uploadId]);

  return {
    upload,
    downloadUrls,
    loading,
    error,
  };
};