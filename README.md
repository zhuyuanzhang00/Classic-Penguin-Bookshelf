# The Orange Band

A Penguin Classics–style **3D bookshelf**: thirty-four titles in a fixed order, camera controls, a live literary-critic panel, and a hard-gated `/citations` page that never invents quotes.

Live site (GitHub Pages): [https://zhuyuanzhang00.github.io/Classic-Penguin-Bookshelf/](https://zhuyuanzhang00.github.io/Classic-Penguin-Bookshelf/)

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js App Router on port **43123** |
| `npm run build` | Static export to `out/` (no GitHub Pages base path) |
| `npm start` | Serve `out/` on **43123** (run `npm run build` first) |
| `npm run build:pages` | Static export with base path `/Classic-Penguin-Bookshelf` |
| `npm run preview:pages` | Pages-mode build, then serve the nested path on **43123** |
| `npm run covers` | Regenerate the deterministic SVG covers in `public/covers` |

Local Pages-style preview: `npm run preview:pages`, then open [http://127.0.0.1:43123/Classic-Penguin-Bookshelf/](http://127.0.0.1:43123/Classic-Penguin-Bookshelf/).

## Enable GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds the static export and deploys it on every push to `main`.

1. Open the repo **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run **Actions → Deploy GitHub Pages → Run workflow**).
4. Wait for the workflow to finish. The site is [https://zhuyuanzhang00.github.io/Classic-Penguin-Bookshelf/](https://zhuyuanzhang00.github.io/Classic-Penguin-Bookshelf/).

`/?book=5` and `/citations/` both work under that base path. Covers and JS chunks are prefixed with `/Classic-Penguin-Bookshelf`.

## What you can do

- Orbit the wooden case (drag / pinch). Click a spine — or the 2D rail on small screens — to **pull the book out**, then open the detail panel (`/?book=`). Close the panel to slide it back into its slot.
- Detail shows title, author, year, generated cover, imprint-exception, nonfiction, and drama badges when they apply, and the critic rating/review. *Hamlet* is flagged as drama, not a novel.
- **Open book** reveals either a verified public-domain quote with an edition citation, or the failure note `No verified quote sourced yet.`
- Edit `criticRating` (1–5) and `criticReview` in the panel. On GitHub Pages (and in the static export) those two fields persist in **localStorage** and merge over the seed. They do not sync across browsers or machines.
- `/citations` lists all 34 titles in shelf order with quote status, text, citation, or failure note.

## Quote policy

Quotes are a hard gate. Copyrighted titles are marked unavailable rather than paraphrased. Public-domain lines, when present, are short passages checked against Project Gutenberg (or the 1888 Engels English *Manifesto*) with chapter/edition citations. Prefer a failure note over a guessed line.

## Stack

Next.js App Router static export, TypeScript, Tailwind, shadcn/ui, React Three Fiber, drei. Covers are deterministic SVGs (v1 placeholder generation), not licensed Penguin artwork.

## 3D bookcase

The case mesh is **Kenney’s Furniture Kit `bookcaseOpen`** ([kenney.nl](https://www.kenney.nl/assets/furniture-kit)), **CC0 / Public Domain**. Credit: Kenney (www.kenney.nl). The GLB is vendored in `public/models/` and also embedded so the static Pages build still loads it if a binary upload is skipped.
