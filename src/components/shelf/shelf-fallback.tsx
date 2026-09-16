import { assetPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";
import Link from "next/link";

type ShelfFallbackProps = {
  books: Book[];
  selectedId: number | null;
};

const rows = [
  [0, 12],
  [12, 24],
  [24, 35],
] as const;

export function ShelfFallback({ books, selectedId }: ShelfFallbackProps) {
  return (
    <div className="flex h-full items-center justify-center bg-[#2a1c14] p-4 sm:p-8">
      <div className="w-full max-w-4xl rounded-sm border-[10px] border-[#8a5a32] bg-[#4a2e18] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-5">
        <p className="mb-3 text-center text-[10px] uppercase tracking-[0.28em] text-[#c4a07a]">
          The shelf · click a spine
        </p>
        <div className="space-y-4">
          {rows.map(([start, end]) => (
            <div
              key={`${start}-${end}`}
              className="flex h-36 items-end justify-center gap-1 border-b-8 border-[#8a5a32] bg-[#5c3a22]/80 px-2 pb-0 sm:h-44 sm:gap-1.5"
            >
              {books.slice(start, end).map((book) => {
                const selected = book.id === selectedId;
                return (
                  <Link
                    key={book.id}
                    href={`/?book=${book.id}`}
                    title={`${book.title} — ${book.author}`}
                    aria-label={`${book.title} by ${book.author}`}
                    className={cn(
                      "flex origin-bottom items-end justify-center rounded-sm px-1 pb-2 pt-3 transition-transform duration-700 ease-out",
                      selected
                        ? "-translate-y-10 scale-110 ring-2 ring-[#e34a1c]"
                        : "hover:-translate-y-1",
                    )}
                    style={{
                      backgroundColor: book.palette.band,
                      backgroundImage: `url(${assetPath(book.coverImageUrl)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: `${Math.round(70 + book.height * 18)}%`,
                      width: `${Math.max(20, Math.round(book.thickness * 96))}px`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
