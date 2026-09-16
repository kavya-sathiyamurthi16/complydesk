# Database

Supabase is the database and backend platform for this project.

Apply SQL migrations from `db/migrations/` in the Supabase SQL Editor or through the Supabase CLI. The frontend reads and writes the `government_compliance` table through the public anon client, so Row Level Security policies must be configured before deployment.

Do not commit Supabase secrets. Only the public project URL and anon key belong in frontend environment variables.
