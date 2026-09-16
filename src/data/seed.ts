import type { Book } from "@/types/book";
import { BOOKS_18_34 } from "@/data/books-18-34";

const UNAVAILABLE_NOTE = "No verified quote sourced yet.";

export const SEED_BOOKS: Book[] = [
  {
    id: 1,
    slug: "the-handmaids-tale",
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    year: "1985",
    criticRating: 5,
    criticReview:
      "Atwood’s Gilead remains the clearest late-20th-century parable of reproductive capture; the voice is chilling precisely because it stays domestic and procedural. Formally, the “found manuscript” frame keeps the reader complicit in reconstructing power. Still essential, imprint caveat above notwithstanding.",
    imprintException: true,
    imprintExceptionNote:
      "Typically Vintage Classics (UK PRH), not Penguin Classics or Penguin Modern Classics.",
    isNonfiction: false,
    quoteStatus: "unavailable",
    quoteText: null,
    quoteCitation: null,
    quoteFailureNote: UNAVAILABLE_NOTE,
    coverImageUrl: "/covers/01-the-handmaids-tale.svg",
    palette: {
      band: "#8B1E3F",
      paper: "#F3E6D0",
      ink: "#2A0F16",
      cloth: "#4A1020",
      spineInk: "#F3E6D0",
    },
    height: 1.86,
    thickness: 0.26,
    depth: 1.05,
  },
];

SEED_BOOKS.push(...BOOKS_18_34);
