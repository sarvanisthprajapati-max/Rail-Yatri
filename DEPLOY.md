# Deploying RailYatra as a real website

This folder is a complete, ready-to-run website (Vite + React). You don't
need to touch any code to get it live — just deploy it.

## Fastest path: Vercel (free, ~5 minutes)

1. Create a free account at https://vercel.com if you don't have one.
2. Push this `railyatra-site/` folder to a new GitHub repo
   (or use `npx vercel` from inside this folder to deploy without GitHub —
   it'll ask you to log in and will detect the Vite settings automatically).
3. If using GitHub: in Vercel, click **Add New → Project**, import the repo.
   Framework preset: **Vite**. Leave build command (`npm run build`) and
   output directory (`dist`) as detected. Click **Deploy**.
4. You'll get a live URL like `https://railyatra-site.vercel.app` within a
   minute or two. Every future push to the repo redeploys automatically.
5. Want a custom domain (e.g. `railyatra.com`)? Vercel → your project →
   Settings → Domains → add it and follow the DNS instructions it gives you.

## Alternative: Netlify

1. `npm install && npm run build` locally (or in Netlify's build pipeline).
2. Drag the resulting `dist/` folder onto https://app.netlify.com/drop, or
   connect the GitHub repo the same way as Vercel (build command
   `npm run build`, publish directory `dist`).

## Testing locally first (optional but recommended)

```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`.

## Important: what works out of the box vs. what needs the backend

This site runs in **local demo mode** by default (`BACKEND_URL = ""` at the
top of `src/App.jsx`): payments are simulated, and "shared" data (seat maps,
PNR lookup, the admin dashboard) is stored in each visitor's own browser via
localStorage — **not shared across different visitors' devices**.

To make it a real, fully working booking site — real UPI payments, a seat
map every visitor sees the same way, PNR lookup that works from any device,
a real admin dashboard, real accounts:

1. Deploy `/backend` (see `backend/README.md` — also a ~5 minute Render
   deploy, plus a real Razorpay account).
2. In `src/App.jsx`, set:
   ```js
   const BACKEND_URL = "https://your-backend-url.onrender.com";
   ```
3. Redeploy the site (push to GitHub, Vercel picks it up automatically).

Everything in the app — seats, payments, cancellations, accounts, live
status, push alerts, loyalty points — is already wired to use the backend
the moment that URL is set; nothing else needs to change.
