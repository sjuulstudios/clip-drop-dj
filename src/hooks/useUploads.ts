import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

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

      // Upload file using XMLHttpRequest for real progress tracking
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
            console.log('File uploaded successfully');
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
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.send(file);
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