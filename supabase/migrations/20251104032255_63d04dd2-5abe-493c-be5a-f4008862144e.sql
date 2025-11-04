-- Create posts table for blog
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  thumbnail TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts only
CREATE POLICY "Anyone can view published posts"
ON public.posts
FOR SELECT
USING (published = true);

-- Create index on slug for faster lookups
CREATE INDEX idx_posts_slug ON public.posts(slug);

-- Create index on published for filtering
CREATE INDEX idx_posts_published ON public.posts(published);

-- Create index on created_at for sorting
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_posts_updated_at();