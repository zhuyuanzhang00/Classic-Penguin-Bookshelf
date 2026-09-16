"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { assetPath } from "@/lib/paths";
import type { Book, CriticPatch } from "@/types/book";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export function BookDetailPanel({
  book,
  saved = false,
  onSave,
}: {
  book: Book;
  saved?: boolean;
  onSave: (id: number, patch: CriticPatch) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const criticRating = Number.parseInt(String(data.get("criticRating") ?? ""), 10);
    const criticReview = String(data.get("criticReview") ?? "").trim();

    if (!Number.isInteger(criticRating) || criticRating < 1 || criticRating > 5) {
      setError("criticRating must be an integer from 1 to 5.");
      return;
    }
    if (criticReview.length < 20 || criticReview.length > 4000) {
      setError("criticReview must be between 20 and 4000 characters.");
      return;
    }

    setError(null);
    onSave(book.id, { criticRating, criticReview });
  }

  return (
    <div
      data-book-detail-panel=""
      data-book-id={book.id}
      className="fixed inset-0 z-[200] flex justify-end"
      style={{ zIndex: 200 }}
    >
      <Link href="/" className="absolute inset-0 bg-black/40" aria-label="Close book details" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-detail-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[color:var(--ink)]/10 bg-[color:var(--paper)] shadow-2xl"
      >
        <Link
          href="/"
          className="absolute right-3 top-3 rounded-sm p-1 text-[color:var(--ink)]/70 hover:bg-[color:var(--ink)]/5"
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </Link>
        <div className="h-full overflow-y-auto px-5 pb-10 pt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--band)]">
            Title {String(book.id).padStart(2, "0")}
          </p>
          <h2
            id="book-detail-title"
            className="mt-2 font-heading text-3xl leading-tight text-[color:var(--ink)]"
          >
            {book.title}
          </h2>
          <p className="mt-1 text-base text-[color:var(--ink)]/70">
            {book.author}, {book.year}
          </p>

          <div className="mt-5 overflow-hidden rounded-sm border border-[color:var(--ink)]/10 bg-[color:var(--band)]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath(book.coverImageUrl)}
              alt={`Generated cover for ${book.title}`}
              className="mx-auto h-auto w-full max-w-[260px]"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {book.isNonfiction ? (
              <Badge variant="secondary">Nonfiction — not a novel</Badge>
            ) : null}
            {book.isDrama ? (
              <Badge variant="secondary">Drama — not a novel</Badge>
            ) : null}
            {book.imprintException ? (
              <Badge variant="outline">Imprint exception</Badge>
            ) : null}
          </div>
          {book.imprintException && book.imprintExceptionNote ? (
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink)]/75">
              {book.imprintExceptionNote}
            </p>
          ) : null}

          <section className="mt-6 border-t border-[color:var(--ink)]/10 pt-5">
            <h3 className="font-heading text-xl text-[color:var(--ink)]">
              Literary critic
            </h3>
            <p className="mt-1 text-sm text-[color:var(--ink)]/65">
              Rating and review stay in this browser (localStorage) and merge
              over the seed on every visit. GitHub Pages has no server.
            </p>
            {saved ? (
              <p className="mt-3 rounded-sm bg-[color:var(--band)]/10 px-3 py-2 text-sm text-[color:var(--ink)]">
                Literary critic notes saved in this browser.
              </p>
            ) : null}
            {error ? (
              <p className="mt-3 rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <form key={book.id} onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={book.id} />
              <div className="space-y-2">
                <Label htmlFor="criticRating">Critic rating</Label>
                <div id="criticRating" className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className="flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1 rounded-sm border border-[color:var(--ink)]/15 px-2 text-sm has-[:checked]:border-[color:var(--band)] has-[:checked]:text-[color:var(--band)]"
                    >
                      <input
                        type="radio"
                        name="criticRating"
                        value={value}
                        defaultChecked={book.criticRating === value}
                        className="sr-only"
                      />
                      <span>★ {value}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="critic-review">Critic review</Label>
                <Textarea
                  id="critic-review"
                  name="criticReview"
                  defaultValue={book.criticReview}
                  rows={7}
                  className="min-h-40 bg-white/70"
                  required
                  minLength={20}
                  maxLength={4000}
                />
              </div>
              <Button type="submit">Save critic notes</Button>
            </form>
          </section>

          <section className="mt-6 border-t border-[color:var(--ink)]/10 pt-5">
            <h3 className="font-heading text-xl text-[color:var(--ink)]">
              Inside the book
            </h3>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-[color:var(--band)]">
                Open book
              </summary>
              {book.quoteStatus === "verified" && book.quoteText ? (
                <figure className="mt-3 space-y-3">
                  <blockquote className="font-heading text-lg leading-relaxed text-[color:var(--ink)]">
                    “{book.quoteText}”
                  </blockquote>
                  <figcaption className="text-sm text-[color:var(--ink)]/70">
                    {book.quoteCitation}
                  </figcaption>
                </figure>
              ) : (
                <p className="mt-3 rounded-sm border border-dashed border-[color:var(--ink)]/20 bg-white/50 p-3 text-sm text-[color:var(--ink)]/80">
                  {book.quoteFailureNote ?? "No verified quote sourced yet."}
                </p>
              )}
            </details>
          </section>
        </div>
      </aside>
    </div>
  );
}
