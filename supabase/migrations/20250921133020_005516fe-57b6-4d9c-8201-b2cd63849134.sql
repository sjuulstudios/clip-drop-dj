-- Create profiles table with extended user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  instagram_link TEXT,
  theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user_survey table for onboarding survey
CREATE TABLE public.user_survey (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  how_found TEXT, -- Google, Instagram, TikTok, YouTube, Friend, Event, Other
  role TEXT, -- DJ/Producer, Manager, Label, Creator, Other
  platforms TEXT[], -- IG, TikTok, YouTube, FB, WhatsApp, Other
  set_length TEXT, -- <1h, 1-2h, 2-4h, 4h+
  genres TEXT[], -- multi-select chips
  posting_frequency TEXT, -- 1/wk, 2-3/wk, 4-6/wk, Daily
  country TEXT,
  timezone TEXT,
  newsletter_optin BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_survey ENABLE ROW LEVEL SECURITY;

-- Create policies for user_survey
CREATE POLICY "Users can view their own survey" 
ON public.user_survey 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own survey" 
ON public.user_survey 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey" 
ON public.user_survey 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create uploads table
CREATE TABLE public.uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for uploads
CREATE POLICY "Users can view their own uploads" 
ON public.uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" 
ON public.uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" 
ON public.uploads 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create cuts table for detected drops
CREATE TABLE public.cuts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  start_time DECIMAL NOT NULL,
  end_time DECIMAL,
  confidence DECIMAL,
  cut_type TEXT DEFAULT 'drop' CHECK (cut_type IN ('drop', 'buildup', 'break')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cuts ENABLE ROW LEVEL SECURITY;

-- Create policies for cuts
CREATE POLICY "Users can view cuts for their uploads" 
ON public.cuts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.uploads 
  WHERE uploads.id = cuts.upload_id 
  AND uploads.user_id = auth.uid()
));

CREATE POLICY "System can create cuts" 
ON public.cuts 
FOR INSERT 
WITH CHECK (true);

-- Create clips table for user-created clips
CREATE TABLE public.clips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time DECIMAL NOT NULL,
  end_time DECIMAL NOT NULL,
  aspect_ratio TEXT DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1', '4:5')),
  timeline_json JSONB, -- Editor settings, text, watermarks, etc.
  export_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

-- Create policies for clips
CREATE POLICY "Users can view their own clips" 
ON public.clips 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clips" 
ON public.clips 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clips" 
ON public.clips 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clips" 
ON public.clips 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create jobs table for processing queue
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('detect', 'export')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs
CREATE POLICY "Users can view jobs for their uploads" 
ON public.jobs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.uploads 
  WHERE uploads.id = jobs.upload_id 
  AND uploads.user_id = auth.uid()
));

CREATE POLICY "System can manage jobs" 
ON public.jobs 
FOR ALL 
USING (true);