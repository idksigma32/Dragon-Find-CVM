# FindIt architecture

## Current application boundaries

- Next.js App Router pages render Material UI client interfaces.
- `src/lib/mock-store.js` is the single browser-persistent data boundary. It broadcasts `findit-data-changed` so open pages refresh together.
- `src/lib/mock-domain.mjs` contains pure matching, visibility, permission, and state-transition rules that can be reused by server actions later.
- Supabase browser/server preparation remains isolated under `src/lib/supabase/`; it is not required by demo mode.

## Future data model

Likely Supabase tables are `profiles`, `schools`, `items`, `claims`, `claim_events`, `inventory_locations`, `moderation_events`, `notifications`, `saved_items`, `recent_items`, and `activity_events`. Item ownership and private claim details should be separate protected fields or tables.

## Authorization and privacy

Editing reports, reading private claim details, reviewing claims, changing inventory, moderating, archiving, and resetting demo data are currently client-side demo controls. Production must enforce these operations with Supabase Auth, server-side authorization, role claims, and Row Level Security. Private claim details must never be selected into public item queries.

## Storage and notifications

Photos should move from local data URLs to Supabase Storage with signed/private access and size/type policies. Resend or a queued notification service can deliver claim decisions, match alerts, and pickup reminders; the in-app notifications table remains the source of truth.
