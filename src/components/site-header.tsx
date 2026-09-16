import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 shrink-0 border-b border-[color:var(--ink)]/15 bg-[color:var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-wrap items-baseline gap-3">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="font-heading text-xl tracking-tight text-[color:var(--ink)] sm:text-2xl">
              The Orange Band
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--band)] sm:inline">
              A Classics Shelf
            </span>
          </Link>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink)]/45 lg:inline">
            Drag to orbit · click a spine
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="text-[color:var(--ink)]/80 transition-colors hover:text-[color:var(--band)]"
          >
            Shelf
          </Link>
          <Link
            href="/citations"
            className="text-[color:var(--ink)]/80 transition-colors hover:text-[color:var(--band)]"
          >
            Citations
          </Link>
        </nav>
      </div>
    </header>
  );
}
