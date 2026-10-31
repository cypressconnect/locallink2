-- Product reviews: a customer gives a product 1 to 5 stars and an optional
-- comment. One review per customer per product; they can edit or delete it.

create table public.reviews (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  customer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Copied from the customer's account when they post, so reviews can be read
  -- without exposing auth.users.
  reviewer_name text not null default coalesce(auth.jwt() -> 'user_metadata' ->> 'name', 'Customer'),
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '' check (length(comment) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, customer_id)
);

create index reviews_product_id_idx on public.reviews (product_id);

alter table public.reviews enable row level security;

create policy "Anyone can see reviews"
  on public.reviews for select
  using (true);

-- Only customer accounts review, and never a product from their own business.
create policy "Customers review products as themselves"
  on public.reviews for insert to authenticated
  with check (
    customer_id = auth.uid()
    and auth.jwt() -> 'user_metadata' ->> 'account_type' = 'customer'
    and not exists (
      select 1 from public.products p
      join public.businesses b on b.id = p.business_id
      where p.id = product_id and b.owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "Customers edit their reviews"
  on public.reviews for update to authenticated
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

create policy "Customers delete their reviews"
  on public.reviews for delete to authenticated
  using (customer_id = auth.uid());

-- Customers only set the stars and comment; the rest comes from their account.
revoke insert, update on public.reviews from anon, authenticated;
grant insert (product_id, rating, comment) on public.reviews to authenticated;
grant update (rating, comment, updated_at) on public.reviews to authenticated;
