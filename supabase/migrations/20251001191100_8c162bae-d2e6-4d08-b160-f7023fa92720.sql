-- Update storage bucket to support 4GB files
UPDATE storage.buckets 
SET file_size_limit = 4294967296 
WHERE id = 'dj-sets';

-- If bucket doesn't exist, create it with proper settings
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'dj-sets', 
  'dj-sets', 
  false, 
  false,
  4294967296, -- 4GB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
)
ON CONFLICT (id) DO UPDATE
SET file_size_limit = 4294967296,
    allowed_mime_types = ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];