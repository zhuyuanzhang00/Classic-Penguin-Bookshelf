import { Badge } from "@/components/ui/badge";
import { SEED_BOOKS } from "@/data/seed";
import type { Book } from "@/types/book";

function QuoteBlock({ book }: { book: Book }) {
  if (book.quoteStatus === "verified" && book.quoteText && book.quoteCitation) {
    return (
      <figure className="space-y-3">
        <blockquote className="font-heading text-xl leading-relaxed text-[color:var(--ink)]">
          “{book.quoteText}”
        </blockquote>
        <figcaption className="text-sm leading-relaxed text-[color:var(--ink)]/75">
          {book.quoteCitation}
        </figcaption>
      </figure>
    );
  }

  return (
    <p className="rounded-sm border border-dashed border-[color:var(--ink)]/20 bg-white/60 p-4 text-sm leading-relaxed text-[color:var(--ink)]/80">
      {book.quoteFailureNote ?? "No verified quote sourced yet."}
    </p>
  );
}

export default function CitationsPage() {
  const books = SEED_BOOKS;
  const verified = books.filter((book) => book.quoteStatus === "verified").length;
  const unavailable = books.length - verified;

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[color:var(--paper)]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--band)]">
          Verification ledger
        </p>
        <h1 className="mt-2 font-heading text-4xl text-[color:var(--ink)] sm:text-5xl">
          Citations
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--ink)]/80">
          This page is a hard gate. No quote is invented for atmosphere. A
          title either carries a short public-domain passage with an edition
          citation, or it shows an explicit failure note. Copyrighted works
          stay unavailable rather than misquoted.
        </p>
        <p className="mt-3 text-sm text-[color:var(--ink)]/70">
          {verified} verified · {unavailable} unavailable · {books.length} titles
          in shelf order.
        </p>

        <ol className="mt-10 space-y-8">
          {books.map((book) => (
            <li
              key={book.id}
              className="border-t border-[color:var(--ink)]/10 pt-6"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--band)]">
                  {String(book.id).padStart(2, "0")}
                </span>
                <h2 className="font-heading text-2xl text-[color:var(--ink)]">
                  {book.title}
                </h2>
              </div>
              <p className="mt-1 text-sm text-[color:var(--ink)]/70">
                {book.author}, {book.year}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant={book.quoteStatus === "verified" ? "default" : "outline"}
                >
                  {book.quoteStatus === "verified" ? "Verified quote" : "Unavailable"}
                </Badge>
                {book.isNonfiction ? (
                  <Badge variant="secondary">Nonfiction</Badge>
                ) : null}
                {book.imprintException ? (
                  <Badge variant="outline">Imprint exception</Badge>
                ) : null}
              </div>
              <div className="mt-4">
                <QuoteBlock book={book} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
