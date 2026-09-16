# Backend

ComplyDesk currently uses Supabase as its backend service instead of a separate Node or Express API.

Backend responsibilities are accessed from:

- `src/services/dataService.ts` for application data access
- `src/services/supabaseService.ts` for direct Supabase service functions
- `src/lib/supabase.ts` for the Supabase client

If a server-side API is added later, place routes, authentication, and privileged operations under this directory. Never put a Supabase `service_role` key in the frontend or `.env` values exposed to Vite.
