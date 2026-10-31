# Local Link — CS4 Individual Project

An online marketplace connecting high school student businesses with local
customers. The website lives in [`local-link/`](local-link/) (React + Vite +
Tailwind CSS, with a Supabase backend).

`Local_Link_HTML/` and `Local_Link_HTML.zip` are the original static design
export and are not needed to run the site.

## How to run it

### 1. Install the tools (once)

- [Node.js](https://nodejs.org) 20 or newer (this comes with `npm`). Check with:

  ```bash
  node -v
  npm -v
  ```

- Only if you need to change the database: the
  [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase` on macOS).

### 2. Install the packages (once, and after pulling new dependencies)

```bash
cd local-link
npm install
```

### 3. Add the Supabase keys (once)

Create `local-link/.env.local` (it is gitignored, so it is never committed):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Both values are on the Supabase dashboard under **Project Settings → API**.
Without this file the site shows a "Supabase is not set up" page.

### 4. Start the site

```bash
cd local-link
npm run dev
```

Open the address it prints (normally <http://localhost:5173>). Press
`Ctrl + C` in the terminal to stop it. Changes to the code reload the page
automatically.

### 5. Log in

The login page lists two demo accounts; click one to fill in the form:

| Account | Email | Password |
| --- | --- | --- |
| Customer | `customer@locallink.com` | `customer123` |
| Student business | `demo@locallink.com` | `business123` |

They are created automatically the first time you log in with them. You can
also sign up for a new account.

## Database changes

The tables, security rules and seed data are SQL files in
`local-link/supabase/migrations`. To apply new ones to the Supabase project:

```bash
cd local-link
supabase login                                   # once
supabase link --project-ref <project-ref>        # once
supabase db push
```

## Other commands

Run these from inside `local-link/`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with live reload |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder to check the production build |
| `npm run lint` | Checks the code for mistakes with oxlint |

## Troubleshooting

- **"Supabase is not set up"** — `.env.local` is missing or misnamed. Check it
  is inside `local-link/`, then stop and restart `npm run dev`.
- **`command not found: npm`** — Node.js is not installed, or the terminal
  needs to be reopened after installing it.
- **Port 5173 already in use** — another copy is running. Stop it, or use the
  new port Vite prints.
- **Errors mentioning a missing table (e.g. `reviews`)** — the database is
  behind the code. Run `supabase db push` (see above).

See [`local-link/README.md`](local-link/README.md) for what each page does and
how the code is laid out.
