-- Make published and excerpt optional (nullable)
ALTER TABLE public.posts 
ALTER COLUMN published DROP NOT NULL,
ALTER COLUMN excerpt DROP NOT NULL;

-- Update existing null excerpts to empty string if needed
UPDATE public.posts 
SET excerpt = '' 
WHERE excerpt IS NULL;