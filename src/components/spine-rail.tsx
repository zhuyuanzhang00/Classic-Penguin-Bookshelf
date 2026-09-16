import type { Book } from "@/types/book";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SpineRailProps = {
  books: Book[];
  selectedId: number | null;
};

export function SpineRail({ books, selectedId }: SpineRailProps) {
  return (
    <div className="z-30 shrink-0 border-t border-[color:var(--ink)]/10 bg-[color:var(--paper)]">
      <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-3 sm:px-6">
        {books.map((book) => {
          const selected = book.id === selectedId;
          return (
            <Link
              key={book.id}
              href={`/?book=${book.id}`}
              title={`${book.title} — ${book.author}`}
              className={cn(
                "flex h-28 min-w-8 shrink-0 flex-col items-center justify-end rounded-sm px-1 pb-2 pt-3 text-center transition-transform",
                selected
                  ? "translate-y-[-4px] ring-2 ring-[color:var(--band)]"
                  : "hover:-translate-y-0.5",
              )}
              style={{
                backgroundColor: book.palette.band,
                backgroundImage: `url(${book.coverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: book.palette.spineInk,
              }}
            >
              <span
                className="max-h-20 w-full overflow-hidden text-[9px] font-semibold uppercase leading-tight tracking-wide"
                style={{ writingMode: "vertical-rl" }}
              >
                {book.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
