# MeowMind — Production Deployment

## Prerequisites
- GitHub repo with this code
- Supabase account (free tier works)
- Google Cloud Console account (for OAuth)
- Vercel account (free tier works)

---

## Step 1 — Supabase (PostgreSQL)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `meowmind`, choose a region near your users
3. **Dashboard → Settings → Database → Connection string**  
   Copy the **Transaction pooler URI** (port `6543`) — looks like:  
   `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
4. Push the schema to Supabase:
   ```bash
   # 1. Temporarily switch schema to PostgreSQL
   #    Edit prisma/schema.prisma → change provider = "sqlite" → "postgresql"

   # 2. Push schema
   DATABASE_URL="<your-supabase-url>" npx prisma db push

   # 3. Revert schema provider back to "sqlite" for local dev
   ```

---

## Step 2 — Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **New Project** → name it `meowmind`
3. **APIs & Services → OAuth consent screen**  
   - User type: External  
   - App name: MeowMind, support email: your email  
   - Scopes: add `email`, `profile`, `openid`
4. **Credentials → Create credentials → OAuth 2.0 Client ID**  
   - Type: Web application  
   - Authorized redirect URI:  
     `https://your-app.vercel.app/api/auth/callback/google`  
     (add `http://localhost:3000/api/auth/callback/google` for dev too)
5. Copy **Client ID** and **Client Secret**

---

## Step 3 — VAPID Keys (Push Notifications)

```bash
node scripts/generate-vapid-keys.mjs
```

Copy the output into your env vars.

---

## Step 4 — Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Vercel auto-detects Next.js — no config needed
4. **Environment Variables** — add all vars from `.env.production.example`:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Supabase connection string |
   | `NEXTAUTH_SECRET` | Random 32-byte base64 string |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |
   | `GOOGLE_CLIENT_ID` | From Google Console |
   | `GOOGLE_CLIENT_SECRET` | From Google Console |
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | From step 3 |
   | `VAPID_PRIVATE_KEY` | From step 3 |
   | `VAPID_EMAIL` | `mailto:your@email.com` |
   | `CRON_SECRET` | `openssl rand -hex 32` |

5. **Deploy** → Vercel runs `prisma generate && next build` automatically

---

## Step 5 — Vercel Cron Job (Daily Reminders)

Add to `vercel.json` (create if needed):
```json
{
  "crons": [
    {
      "path": "/api/cron/notify",
      "schedule": "0 * * * *"
    }
  ]
}
```

The cron calls `/api/cron/notify?secret=<CRON_SECRET>` every hour and sends push notifications to users whose `reminderTime` matches the current hour.

---

## Dev → Prod Checklist

- [ ] Supabase project created and schema pushed
- [ ] Google OAuth credentials configured with production redirect URI
- [ ] VAPID keys generated
- [ ] All env vars set in Vercel
- [ ] `NEXTAUTH_URL` updated to production domain
- [ ] Google OAuth redirect URI updated to production domain
- [ ] Cron job configured in vercel.json
- [ ] Remove or disable the dev-login provider (it's already gated by `NODE_ENV === 'development'` ✅)

---

## Switching Database: Dev ↔ Production

The app auto-detects the DB from `DATABASE_URL`:
- `file:./dev.db` → SQLite via `@prisma/adapter-better-sqlite3`  
- `postgresql://...` → PostgreSQL via `@prisma/adapter-pg`

**No code changes needed** — just swap the env var.
