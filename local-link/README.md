# Local Link

An online marketplace that connects high school student businesses with local
customers. Built with React, Vite and Tailwind CSS, styled to match the original
Local Link design.

## Running it

```bash
npm install
npm run dev
```

## What is built so far

| Page | Route | Notes |
| --- | --- | --- |
| Homepage | `/` | Hero, popular topics, popular products, testimonials, contact form |
| Login / Signup | `/login` | Toggles between customer and student business, and between log in and sign up |
| Online Marketplace | `/marketplace` | Search, topic filters, verified-only filter, product grid |

## Still to build

Admin system, contact page, lead submission, and the topic page. These routes
currently render the `ComingSoon` placeholder so navigation never breaks.

## Project layout

```
src/
  auth.jsx              account state, saved to localStorage
  index.css             Tailwind theme tokens and shared component classes
  components/
    Navbar.jsx
    Footer.jsx          includes the contact form
    ProductCard.jsx     shared by the homepage and the marketplace
  data/
    products.js         products and topics
  pages/
    Home.jsx
    Login.jsx
    Marketplace.jsx
    ComingSoon.jsx
```

## Notes

Accounts are stored in the browser with `localStorage`, so there is no server
yet and no real password checking. Swap `src/auth.jsx` for a real API when the
backend exists.
