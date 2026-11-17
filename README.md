# Breaker Breaker

Label a circuit breaker panel. Two columns (odds left, evens right), slide-in editors, autosave to Supabase.

**Live app:** https://aaronjstanley.github.io/Breaker-Breaker/

## Stack

- React + TypeScript + Vite + Tailwind
- Supabase Postgres (same project as Med Track: `ltryvlcrnjdfjyqcufgq`)
- GitHub Pages via Actions

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Apply the schema once (SQL editor or CLI) from:

`supabase/migrations/20261117143000_create_breaker_breaker_schema.sql`

## GitHub Pages

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Optional repo secrets:

| Secret | Value |
|--------|--------|
| `SUPABASE_URL` | `https://ltryvlcrnjdfjyqcufgq.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | anon / publishable key |

If secrets are unset, the workflow falls back to `.env.example`.
