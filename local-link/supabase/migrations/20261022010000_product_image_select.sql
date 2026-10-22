-- Deleting a photo through the storage API looks the object up first, so
-- accounts also need to be able to see the files in their own folder.
create policy "Accounts see their own product photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
