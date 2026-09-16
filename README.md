# The Orange Band

A Penguin Classics–style **3D bookshelf**: seventeen titles in a fixed order, camera controls, a live literary-critic panel, and a hard-gated `/citations` page that never invents quotes.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js App Router on port **43123** |
| `npm run build` | Production build |
| `npm start` | Serve the production build on **43123** |
| `npm run covers` | Regenerate the deterministic SVG covers in `public/covers` |

## What you can do

- Orbit the wooden case (drag / pinch). Click a spine — or the 2D rail on small screens — to open the detail panel.
- Detail shows title, author, year, generated cover, imprint-exception and nonfiction badges when they apply, and the critic rating/review.
- **Open book** reveals either a verified public-domain quote with an edition citation, or the failure note `No verified quote sourced yet.`
- Edit `criticRating` (1–5) and `criticReview` in the panel. Saves via `PATCH /api/books/[id]` and persists to `data/books.json` (in-memory fallback if the filesystem is read-only).
- `/citations` lists all 17 titles in shelf order with quote status, text, citation, or failure note.

## API

- `GET /api/books` — full shelf, critic fields merged from the JSON store.
- `GET /api/books/[id]` — one title.
- `PATCH /api/books/[id]` — **only** `{ criticRating, criticReview }`. Extra keys are rejected.

## Quote policy

Quotes are a hard gate. Copyrighted titles are marked unavailable rather than paraphrased. Public-domain lines, when present, are short passages checked against Project Gutenberg (or the 1888 Engels English *Manifesto*) with chapter/edition citations. Prefer a failure note over a guessed line.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, React Three Fiber, drei. Covers are deterministic SVGs (v1 placeholder generation), not licensed Penguin artwork.
