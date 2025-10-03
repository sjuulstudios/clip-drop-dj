import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import * as tus from 'tus-js-client';

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

      console.log('Starting TUS resumable upload...', { uploadId, filePath });

      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Use TUS protocol for resumable uploads (handles large files properly)
      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: `https://bepfythffyyzvazxakvs.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000],
          headers: {
            authorization: `Bearer ${session.access_token}`,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: 'dj-sets',
            objectName: filePath,
            contentType: file.type,
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024, // 6MB chunks
          onError: (error) => {
            console.error('TUS upload failed:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = (bytesUploaded / bytesTotal) * 100;
            console.log(`Upload progress: ${percentage.toFixed(1)}%`);
            onProgress?.(percentage);
          },
          onSuccess: () => {
            console.log('TUS upload completed successfully');
            resolve();
          },
        });

        // Start the upload
        upload.start();
      });

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