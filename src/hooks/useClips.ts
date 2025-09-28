import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Clip {
  id: string;
  upload_id: string;
  user_id: string;
  name: string;
  start_time: number;
  end_time: number;
  aspect_ratio: string;
  timeline_json?: any;
  export_url?: string;
  created_at: string;
  updated_at: string;
}

export const useClips = (uploadId?: string) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClips = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('clips').select('*').order('created_at', { ascending: false });
      
      if (uploadId) {
        query = query.eq('upload_id', uploadId);
      }
      
      const { data, error: clipError } = await query;
      
      if (clipError) throw clipError;
      
      setClips(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClips();
    }
  }, [user, uploadId]);

  const createClip = async (
    uploadId: string,
    name: string,
    startTime: number,
    endTime: number,
    aspectRatio: string = '16:9'
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clips')
        .insert({
          upload_id: uploadId,
          user_id: user.id,
          name,
          start_time: startTime,
          end_time: endTime,
          aspect_ratio: aspectRatio,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh clips list
      await fetchClips();
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create clip');
    }
  };

  const updateClip = async (
    clipId: string,
    updates: Partial<Pick<Clip, 'name' | 'start_time' | 'end_time' | 'aspect_ratio' | 'timeline_json'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('clips')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clipId)
        .select()
        .single();

      if (error) throw error;

      // Refresh clips list
      await fetchClips();
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update clip');
    }
  };

  const deleteClip = async (clipId: string) => {
    try {
      const { error } = await supabase
        .from('clips')
        .delete()
        .eq('id', clipId);

      if (error) throw error;

      // Refresh clips list
      await fetchClips();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete clip');
    }
  };

  return {
    clips,
    loading,
    error,
    createClip,
    updateClip,
    deleteClip,
    refetch: fetchClips,
  };
};