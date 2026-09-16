import { ShelfApp, ShelfAppFallback } from "@/components/shelf-app";
import { SEED_BOOKS } from "@/data/seed";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<ShelfAppFallback books={SEED_BOOKS} />}>
      <ShelfApp books={SEED_BOOKS} />
    </Suspense>
  );
}
