# sadrobot AI Daily

Daily worldwide AI briefing, published automatically every morning.

**Live site:** https://krisztianhari-wq.github.io/ai-news/

## What it does
- Collects news from ~50 public sources (RSS/Atom feeds, HTML news pages, Google News proxies) defined in `config/feeds.json`.
- Classifies and summarises them into nine categories: Models & Releases · Research · Agents & Tools · AI Security · AI Threats & Defense · Safety & Evals · Policy & Regulation (EU) · Industry & Compute · Incidents & Society.
- Stores each day as `public/data/days/YYYY-MM-DD.json`; the archive is searchable on the site.
- Static site (Vite + React) deployed to GitHub Pages by `.github/workflows/daily.yml`, which also runs a heuristic fallback collection if no edition exists by 10:30 CEST.

## Local use
```bash
npm install
npm run collect -- --no-llm   # collect today's items
npm run dev                   # preview at http://localhost:5173
```

## Security
- No backend, no database, no user accounts.
- Feed content is treated as untrusted: HTML stripped, only `http(s)` links rendered, strict CSP, `no-referrer`, `noopener` links.
- Summaries are AI-generated; always verify with the linked source.

## Two brands, one codebase
The look is chosen at build time with `VITE_BRAND`: the GitHub Pages workflow builds with `VITE_BRAND=yettel` (Yettel palette, wordmark, "Open" label), while ai.sadrobot.eu builds without it and gets the sadrobot brand. Content and daily editions are identical.
