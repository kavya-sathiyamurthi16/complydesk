# Frontend

The frontend is the Vite + React application located in `frontend/src/`.

Run it from the repository root:

```powershell
npm run dev
npm run build
```

Frontend environment variables are defined in the root `.env` file:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The root Vite configuration is intentionally kept at the repository root so existing GitHub and hosting deployments continue to work.
