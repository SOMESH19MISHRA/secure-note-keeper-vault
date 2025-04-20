
-- Create vault-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
SELECT 'vault-files', 'vault-files'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'vault-files'
);

-- Set RLS policies for the vault-files bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own files
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vault-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to select only their own files
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'vault-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update only their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vault-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete only their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vault-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
