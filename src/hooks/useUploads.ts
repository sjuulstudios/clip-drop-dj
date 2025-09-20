import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Upload {
  id: string;
  filename: string;
  bytes: number;
  duration_seconds?: number;
  status: 'uploaded' | 'processing' | 'done' | 'failed';
  created_at: string;
  updated_at: string;
  error_message?: string;
  jobs?: Array<{
    id: string;
    type: 'detect' | 'split';
    status: 'queued' | 'processing' | 'done' | 'failed';
    error_message?: string;
  }>;
  cuts?: Array<{
    id: string;
    time_seconds: number;
    confidence?: number;
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
      // Get presigned upload URL
      const { uploadId, uploadUrl, filePath } = await api.getPresignedUploadUrl(
        file.name,
        file.type,
        file.size
      );

      // Upload file to storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Complete upload
      await api.completeUpload(uploadId, filePath, file.name, file.size);

      // Trigger processing
      await api.processAudio(uploadId);

      // Refresh uploads list
      await fetchUploads();

      return uploadId;
    } catch (err) {
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