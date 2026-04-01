# Zorvyn Finance Dashboard

Personal finance dashboard built with **React**, **Vite**, **Zustand**, **Recharts**, and **plain CSS**. Features summary metrics, line and pie charts, insights, a filterable transactions table, **admin / viewer** roles, **dark / light** theme, and **localStorage** persistence.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm install`  | Install dependencies     |
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build to `dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint               |

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Deploy on Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), import the repository.
3. Use the defaults: **Framework Preset: Vite**, **Build Command:** `npm run build`, **Output Directory:** `dist`.

The included `vercel.json` pins the Vite build output. Add SPA `rewrites` in Vercel or this file if you introduce client-side routing later.

Environment variables are not required for the default app.

## Data & roles

- **Admin:** add, edit, and delete transactions (delete asks for confirmation).
- **Viewer:** read-only; search, filters, and sorting still work.
- Data persists in the browser under the key `zorvyn-finance-dashboard-v4`.

## License

MIT (or your chosen license — update this file when you add a `LICENSE`).
