# Local Link — How to Open and Use It

Local Link is a website that connects high school student businesses with
local customers. These steps take you from the zip file to the site running in
your browser. You don't need to know how to code.

You need an internet connection, because accounts, products, leads and reviews
are stored online.


## Step 1: Unzip the folder

Double-click the zip file. A folder appears next to it. Open that folder.
Don't run anything from inside the zip, because it won't work there.


## Step 2: Install Node.js (one time only)

The site runs on Node.js, which is free.

1. Go to https://nodejs.org
2. Download the **LTS** version and install it, clicking Next/Continue
   through the installer.

If you already have Node.js 20 or newer, skip this step.


## Step 3: Start the site

**On a Mac:** double-click **`Start Local Link (Mac).command`**.

- If macOS says it "cannot be opened because it is from an unidentified
  developer", right-click the file, choose **Open**, then click **Open**
  again.

**On Windows:** double-click **`Start Local Link (Windows).bat`**.

- If Windows shows "Windows protected your PC", click **More info**, then
  **Run anyway**.

A black terminal window opens:

- The first time, it installs what the site needs. This takes a minute or
  two.
- Then your browser opens Local Link automatically.
- If the browser doesn't open, go to **http://localhost:5173** yourself.

**Keep the terminal window open while you use the site.** Close it when
you're done, and the site stops.

Next time, just double-click the start file again. It starts much faster
after the first time.


## Step 4: Log in

Click **Login/Signup** at the top of the site. You can make your own account,
or click one of the demo accounts on the login page to fill it in:

| Account          | Email                  | Password    |
| ---------------- | ---------------------- | ----------- |
| Customer         | customer@locallink.com | customer123 |
| Student business | demo@locallink.com     | business123 |

The homepage has a **How Local Link works** section that explains every page.
Here are some things to try:

- **As a customer:**
  - Browse the Online Marketplace.
  - Click a product to read and write reviews.
  - Press **Send Lead** to send your contact details to a business.
  - Check **My Leads**.
- **As a business:**
  - Open **My Business** to edit your description and add or delete products.
  - Open **Leads** to see customers who contacted you.


## If something goes wrong

- **The start file shows "Node.js is not installed"**: do Step 2, then
  double-click the start file again. If it still says that, restart the
  computer once so it finds Node.js.
- **The page says "Supabase is not set up"**: the hidden file
  `local-link/.env` is missing. It can get lost if the zip is made with
  some tools. Ask the project owner for a fresh copy of the zip.
- **The page can't connect or loads forever**: check your internet
  connection.
- **"Port 5173 is in use"**: the site is already running in another terminal
  window. Use that window, or close it and start again. The terminal also
  prints the address it's using.


## Running it from a terminal instead

If you're comfortable with a terminal, this does the same thing as the start
files:

```
cd local-link
npm install
npm run dev
```

Then open http://localhost:5173.


## For the developer

- The site's code is in `local-link/`. See `local-link/README.md` for what
  each page does and how the code is laid out.
- `Local_Link_HTML/` and `Local_Link_HTML.zip` are the original static design
  export. They aren't needed to run the site.
- The Supabase connection details are in `local-link/.env`. The publishable
  key is meant to be public; the database's row level security controls access.
  To use a different project, put your own values in `local-link/.env.local`,
  which overrides `.env`.
- Database changes are SQL files in `local-link/supabase/migrations`. Apply
  them with `supabase db push` from `local-link/` (after `supabase login` and
  `supabase link --project-ref <ref>`). Do this before sending out a new zip,
  so people with the zip get the latest database too.
- **Making the zip:** leave out `local-link/node_modules`. It's large and
  won't work on other computers. The start file reinstalls it. Run this from
  the folder that contains this project:

  ```
  zip -r LocalLink.zip "CS4 Individual Project Website" -x "*/node_modules/*" "*/.git/*" "*/dist/*" "*.DS_Store"
  ```
