-- Local Link: businesses, products, leads and product photo storage.
--
-- Accounts live in Supabase Auth. The name and account type ("customer" or
-- "business") are kept in each user's metadata. A business is owned by an
-- account email, so seed businesses can belong to the demo account before it
-- has signed up.

-- Businesses ---------------------------------------------------------------

create table public.businesses (
  id text primary key default gen_random_uuid()::text,
  owner_email text not null default '',
  name text not null,
  topic_id text not null,
  description text not null default '',
  -- Set by Local Link staff once the student's school email and identity are checked.
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.businesses enable row level security;

create policy "Anyone can see businesses"
  on public.businesses for select
  using (true);

create policy "Accounts add businesses they own"
  on public.businesses for insert to authenticated
  with check (owner_email = auth.jwt() ->> 'email');

create policy "Owners edit their businesses"
  on public.businesses for update to authenticated
  using (owner_email = auth.jwt() ->> 'email')
  with check (owner_email = auth.jwt() ->> 'email');

-- Owners can only touch these columns, so nobody can give themselves the badge.
revoke insert, update on public.businesses from anon, authenticated;
grant insert (owner_email, name, topic_id, description) on public.businesses to authenticated;
grant update (name, topic_id, description) on public.businesses to authenticated;

-- Products -----------------------------------------------------------------

create table public.products (
  id bigint generated always as identity primary key,
  business_id text not null references public.businesses (id) on delete cascade,
  name text not null,
  price text not null,
  description text not null default '',
  -- Null means the product uses its business's topic.
  topic_id text,
  image text not null,
  created_at timestamptz not null default now()
);

create index products_business_id_idx on public.products (business_id);

alter table public.products enable row level security;

create policy "Anyone can see products"
  on public.products for select
  using (true);

create policy "Owners add products to their businesses"
  on public.products for insert to authenticated
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_email = auth.jwt() ->> 'email'
  ));

create policy "Owners delete their products"
  on public.products for delete to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_email = auth.jwt() ->> 'email'
  ));

-- Leads --------------------------------------------------------------------

-- A customer's contact details, sent to one business. Free for now. The
-- business contacts the customer itself, outside Local Link.
create table public.leads (
  id bigint generated always as identity primary key,
  business_id text not null references public.businesses (id) on delete cascade,
  customer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  email text not null check (length(trim(email)) > 0),
  phone text not null check (length(trim(phone)) > 0),
  created_at timestamptz not null default now(),
  -- Set the first time the business opens its leads page with this lead on it.
  viewed_at timestamptz,
  -- Whether the customer has seen the "lead viewed" message.
  viewed_message_read boolean not null default false
);

create index leads_business_id_idx on public.leads (business_id);
create index leads_customer_id_idx on public.leads (customer_id);

alter table public.leads enable row level security;

create policy "Customers send leads as themselves"
  on public.leads for insert to authenticated
  with check (customer_id = auth.uid());

create policy "Customers see their leads, businesses see leads sent to them"
  on public.leads for select to authenticated
  using (
    customer_id = auth.uid()
    or exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_email = auth.jwt() ->> 'email'
    )
  );

-- No update policy: viewed_at and viewed_message_read only change through the
-- two functions below, so neither side can edit the contact details.
revoke insert, update on public.leads from anon, authenticated;
grant insert (business_id, name, email, phone) on public.leads to authenticated;

/* Called by the leads page with the leads it is showing. Only leads sent to
 * the caller's own businesses are marked, and only the first view counts. */
create function public.mark_leads_viewed(lead_ids bigint[])
returns void
language sql
security definer
set search_path = ''
as $$
  update public.leads l
  set viewed_at = now()
  from public.businesses b
  where l.id = any (lead_ids)
    and l.viewed_at is null
    and b.id = l.business_id
    and b.owner_email = auth.jwt() ->> 'email';
$$;

/* Called once the customer has seen their "lead viewed" messages. */
create function public.read_lead_view_messages()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.leads
  set viewed_message_read = true
  where customer_id = auth.uid()
    and viewed_at is not null
    and not viewed_message_read;
$$;

revoke execute on function public.mark_leads_viewed(bigint[]) from public, anon;
revoke execute on function public.read_lead_view_messages() from public, anon;
grant execute on function public.mark_leads_viewed(bigint[]) to authenticated;
grant execute on function public.read_lead_view_messages() to authenticated;

-- Product photos -----------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Each account uploads into a folder named after its user id.
create policy "Accounts upload product photos to their folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Accounts delete their own product photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Seed data ----------------------------------------------------------------

-- demo@locallink.com owns two businesses so switching between them can be demoed.
insert into public.businesses (id, owner_email, name, topic_id, verified, description) values
  ('amys-artistic-classes', '', 'Amy''s Artistic Classes', 'art', true,
   'Small-group painting lessons for beginners, held on weekends at the community centre.'),
  ('rayvans-kitchen', '', 'Rayvan''s Kitchen', 'homemade-goods', true,
   'Fresh juices squeezed every morning and delivered around the neighbourhood.'),
  ('tonys-gazette', '', 'Tony''s Gazette', 'homemade-goods', false,
   'A weekly newspaper covering local events, sport and school news in Bridgeland.'),
  ('gabriels-sunday-school', '', 'Gabriel''s Sunday School', 'tutoring', true,
   'Friendly Bible classes for younger children every Sunday afternoon.'),
  ('jays-tutoring-zone', '', 'Jay''s Tutoring Zone', 'tutoring', true,
   'English essay and reading help for years 7 to 10, online or in person.'),
  ('natashas-babysitting', '', 'Natasha''s Babysitting', 'services', false,
   'First-aid trained babysitter available on weekday evenings and weekends.'),
  ('bobbys-bakery', 'demo@locallink.com', 'Bobby''s Bakery', 'baked-goods', true,
   'Slow-proved sourdough and seasonal bakes, ready for pickup every Saturday.'),
  ('priya-study-hall', '', 'Priya Study Hall', 'tutoring', true,
   'Maths tutoring from GCSE to A-level, with past-paper practice every session.'),
  ('leos-woodshop', '', 'Leo''s Woodshop', 'gardening', false,
   'Hand-built cedar planters made to order in any size.'),
  ('green-street-crew', '', 'Green Street Crew', 'gardening', true,
   'Three friends who mow, edge and tidy lawns all through spring and summer.'),
  ('mias-craft-corner', '', 'Mia''s Craft Corner', 'homemade-goods', true,
   'Beaded bracelets and keychains in custom colours and names.'),
  ('sweet-sixteen-bakes', 'demo@locallink.com', 'Sweet Sixteen Bakes', 'baked-goods', false,
   'Decorated cupcakes and birthday cakes for parties of any size.');

insert into public.products (business_id, name, price, image) values
  ('amys-artistic-classes', 'Painting Classes', '$25 / lesson', '/assets/product-2.png'),
  ('rayvans-kitchen', 'Fresh Orange Juice', '$4 / bottle', '/assets/product-1.png'),
  ('tonys-gazette', 'Bridgeland Newspaper', '$2 / issue', '/assets/product-3.png'),
  ('gabriels-sunday-school', 'Bible Classes', 'Free', '/assets/product-4.png'),
  ('jays-tutoring-zone', 'English Tutoring', '$20 / hour', '/assets/product-5.png'),
  ('natashas-babysitting', 'Babysitting', '$15 / hour', '/assets/babysitting.jpg'),
  ('bobbys-bakery', 'Sourdough Loaves', '$8 / loaf', '/assets/sourdough.jpg'),
  ('priya-study-hall', 'Math Tutoring', '$22 / hour', '/assets/math.jpg'),
  ('leos-woodshop', 'Garden Planters', '$30 each', '/assets/planters.jpg'),
  ('green-street-crew', 'Lawn Mowing', '$25 / visit', '/assets/lawn-mowing.jpg'),
  ('mias-craft-corner', 'Beaded Bracelets', '$6 each', '/assets/bracelets.jpg'),
  ('sweet-sixteen-bakes', 'Birthday Cupcakes', '$18 / dozen', '/assets/cupcakes.jpg');
