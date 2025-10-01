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

  const uploadFile = async (file: File) => {
    try {
      console.log('Getting presigned URL...');
      
      // Get presigned upload URL
      const { uploadId, uploadUrl, filePath } = await api.getPresignedUploadUrl(
        file.name,
        file.type,
        file.size
      );

      console.log('Uploading file to storage...', { uploadId, filePath });

      // Upload file to storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload failed:', errorText);
        throw new Error('Failed to upload file to storage');
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