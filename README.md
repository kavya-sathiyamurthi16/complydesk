# ComplyDesk

ComplyDesk is a Vite + React compliance dashboard backed by Supabase.

## Project Structure

- `frontend/` - active Vite frontend, including `frontend/src/`, `frontend/public/`, and `frontend/index.html`.
- `backend/` - backend service boundary notes. Supabase currently provides the backend; no separate API server is required.
- `db/` - Supabase database documentation and SQL migrations.
- `src/` - legacy source copy retained temporarily because Windows/OneDrive locked the original directory during relocation.
- `public/` - static frontend assets.

## Development

```powershell
npm install
npm run dev
npm run build
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Apply the SQL under `db/migrations/` in Supabase before using invoice persistence.

## Deployment

Deploy the repository root as a Vite application. Configure the same `VITE_*` variables in the hosting provider and run `npm run build` during deployment.

---

## Vite Template Notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
