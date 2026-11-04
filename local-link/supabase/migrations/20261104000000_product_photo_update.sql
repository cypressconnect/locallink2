-- Lets a business change the photo of a product it already listed. Only the
-- image column can be updated, so a product can't be moved to another business.

create policy "Owners edit their products"
  on public.products for update to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_email = auth.jwt() ->> 'email'
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_email = auth.jwt() ->> 'email'
  ));

revoke update on public.products from anon, authenticated;
grant update (image) on public.products to authenticated;
