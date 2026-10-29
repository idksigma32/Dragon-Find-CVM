# FindIt

FindIt is a responsive school lost-and-found web app built with Next.js App Router, React, Tailwind CSS v4, Material UI, and Supabase.

## Features

- Browse, search, and filter lost and found items
- Responsive landing page with featured items and community workflow
- Authenticated report form with image upload support
- Student dashboard for personal reports
- Shared authentication form for sign in and sign up
- Supabase SSR browser/server clients and auth session refresh middleware
- RLS-protected profiles, items, claims, and private item-image storage
- Material UI components for navigation, forms, dialogs, cards, tabs, responsive drawers, skeletons, alerts, and data tables

## Local setup

1. Install Node.js 20.9 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and add a Supabase project URL plus publishable/anon key.
4. Apply the migration in `supabase/migrations/20251029000000_initial_schema.sql` using the Supabase CLI or SQL editor.
5. Start the development server:

   ```bash
   npm run dev
   ```

Without Supabase credentials, the public browse and landing pages work with demo content. Sign-in, report submission, dashboard data, and storage uploads require a configured Supabase project and cannot be tested locally until credentials are provided.

The shared MUI theme is stored in `src/theme/theme.js`, with the App Router cache provider configured in the root layout.

## Deployment

The project is configured for Vercel. Add the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) environment variables in the Vercel project settings, then deploy from the repository.

Resend is intentionally not wired yet. Any future email notification implementation should use a server-only API route or server action and keep the Resend API key out of client code.
