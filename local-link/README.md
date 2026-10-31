# Local Link

An online marketplace that connects high school student businesses with local
customers. Built with React, Vite and Tailwind CSS, styled to match the original
Local Link design.

## Running it

```bash
npm install
npm run dev
```

The site uses the Supabase project in `.env`. To use another one, put its URL and publishable key in
`.env.local` (gitignored):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The database schema, security rules and seed businesses are in
`supabase/migrations`. Apply them with `supabase link --project-ref <ref>` and
then `supabase db push`.

## What is built so far

| Page | Route | Notes |
| --- | --- | --- |
| Homepage | `/` | Hero, popular topics, popular products, testimonials, contact form |
| Login / Signup | `/login` | Toggles between customer and student business, and between log in and sign up |
| Online Marketplace | `/marketplace` | Search, topic filters, verified-only filter, product grid |
| Topics | `/topics` | Businesses grouped by category |
| My Business | `/business` | Business homepage: businesses, description, products |
| Product | `/product/:productId` | Product details and reviews; customers post, edit and delete their review |
| Send a Lead | `/lead/:businessId` | Customer sends their name, email and phone to a business (free) |
| Leads | `/leads` | Business sees its leads; opening them marks them viewed |
| My Leads | `/my-leads` | Customer sees their leads and a message once each is viewed |

## Still to build

Admin system (including verifying businesses), the contact page, and paid
leads. Unbuilt routes render the `ComingSoon` placeholder so navigation never
breaks.

## Project layout

```
src/
  supabase.js           the shared Supabase client
  auth.jsx              Supabase Auth: name and account type live in user metadata
  index.css             Tailwind theme tokens and shared component classes
  components/
    Navbar.jsx          shows customers how many of their leads were viewed
    Footer.jsx          includes the contact form
    ProductCard.jsx     shared by the homepage and the marketplace
  data/
    products.js         topics and built-in product pictures
    businessStore.js    businesses and products (Supabase), photo uploads
    leadStore.js        sending, listing and marking leads (Supabase)
    reviewStore.js      loading, posting, editing and deleting reviews (Supabase)
  pages/
    Home.jsx  Login.jsx  Marketplace.jsx  Topics.jsx  BusinessHome.jsx
    Product.jsx  SendLead.jsx  Leads.jsx  MyLeads.jsx  ComingSoon.jsx
supabase/migrations/    tables, row level security, storage bucket, seed data
```

## Notes

- Row level security does the access control: anyone can read businesses and
  products, only owners change their own, customers only see their own leads,
  and businesses only see leads sent to them. Nobody can set `verified` from
  the site.
- A lead's `viewed_at` is set by the `mark_leads_viewed` function when the
  business opens its leads page; the customer's message is cleared by
  `read_lead_view_messages`.
- Reviews: one per customer per product, 1 to 5 stars plus an optional
  comment. Only customer accounts can post, never on their own business's
  products, and only the author can edit or delete a review. Product cards show
  the average rating.
- The demo accounts are created the first time someone logs in with them.
