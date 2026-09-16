export type QuoteStatus = "verified" | "unavailable";

export type CoverPalette = {
  band: string;
  paper: string;
  ink: string;
  cloth: string;
  spineInk: string;
};

export type Book = {
  id: number;
  slug: string;
  title: string;
  author: string;
  year: string;
  criticRating: number | null;
  criticReview: string;
  imprintException: boolean;
  imprintExceptionNote: string | null;
  isNonfiction: boolean;
  isDrama?: boolean;
  quoteStatus: QuoteStatus;
  quoteText: string | null;
  quoteCitation: string | null;
  quoteFailureNote: string | null;
  coverImageUrl: string;
  palette: CoverPalette;
  height: number;
  thickness: number;
  depth: number;
};

export type CriticPatch = {
  criticRating: number;
  criticReview: string;
};
