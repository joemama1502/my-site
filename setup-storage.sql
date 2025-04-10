-- Enable the storage API extension
create extension if not exists "storage" schema "storage";

-- Create the storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profile-assets', 'profile-assets', true)
on conflict (id) do nothing;

-- Allow public read access to files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'profile-assets' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload files"
on storage.objects for insert
with check (
    bucket_id = 'profile-assets'
    and auth.role() = 'authenticated'
);

-- Allow users to update their own files
create policy "Users can update own files"
on storage.objects for update
using (
    bucket_id = 'profile-assets'
    and auth.uid() = owner
)
with check (
    bucket_id = 'profile-assets'
    and auth.uid() = owner
);

-- Allow users to delete their own files
create policy "Users can delete own files"
on storage.objects for delete
using (
    bucket_id = 'profile-assets'
    and auth.uid() = owner
); 