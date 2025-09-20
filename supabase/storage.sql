-- Create storage bucket for DJ sets
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'dj-sets', 
  'dj-sets', 
  false, 
  false,
  4294967296, -- 4GB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
);

-- Storage policies for dj-sets bucket
CREATE POLICY "Users can upload their own files" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'dj-sets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own files" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'dj-sets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own files" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'dj-sets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'dj-sets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);