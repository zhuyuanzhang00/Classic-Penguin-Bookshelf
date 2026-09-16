import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const books = [
  { id: 1, slug: "the-handmaids-tale", title: "The Handmaid's Tale", author: "Margaret Atwood", year: "1985", band: "#8B1E3F", paper: "#F3E6D0", ink: "#2A0F16" },
  { id: 2, slug: "around-the-world-in-eighty-days", title: "Around the World in Eighty Days", author: "Jules Verne", year: "1873", band: "#E85D04", paper: "#F7EEDC", ink: "#1C140C" },
  { id: 3, slug: "nausea", title: "Nausea", author: "Jean-Paul Sartre", year: "1938", band: "#4B5563", paper: "#EEE7D8", ink: "#111827" },
  { id: 4, slug: "the-wind-in-the-willows", title: "The Wind in the Willows", author: "Kenneth Grahame", year: "1908", band: "#4D7C0F", paper: "#F4EBD4", ink: "#1A2E05" },
  { id: 5, slug: "dantes-inferno", title: "Dante's Inferno", author: "Dante Alighieri", year: "c.1320", band: "#7F1D1D", paper: "#EFE6D2", ink: "#1C0A0A" },
  { id: 6, slug: "dracula", title: "Dracula", author: "Bram Stoker", year: "1897", band: "#3B0A45", paper: "#F0E4CC", ink: "#1A0B1F" },
  { id: 7, slug: "frankenstein", title: "Frankenstein", author: "Mary Shelley", year: "1818", band: "#365314", paper: "#E8EFD6", ink: "#14532D" },
  { id: 8, slug: "the-collector", title: "The Collector", author: "John Fowles", year: "1963", band: "#334155", paper: "#EDE6D6", ink: "#0F172A" },
  { id: 9, slug: "the-communist-manifesto", title: "The Communist Manifesto", author: "Karl Marx & Friedrich Engels", year: "1848", band: "#B91C1C", paper: "#F5E6D3", ink: "#450A0A" },
  { id: 10, slug: "1984", title: "1984", author: "George Orwell", year: "1949", band: "#111827", paper: "#E5E7EB", ink: "#111827" },
  { id: 11, slug: "freedom-is-a-constant-struggle", title: "Freedom Is a Constant Struggle", author: "Angela Y. Davis", year: "2016", band: "#B45309", paper: "#FAF3E3", ink: "#1C1917" },
  { id: 12, slug: "the-grapes-of-wrath", title: "The Grapes of Wrath", author: "John Steinbeck", year: "1939", band: "#B45309", paper: "#F3E4C8", ink: "#431407" },
  { id: 13, slug: "war-and-peace", title: "War and Peace", author: "Leo Tolstoy", year: "1869", band: "#1E3A5F", paper: "#F0E6D0", ink: "#0B1C2C" },
  { id: 14, slug: "the-war-of-the-worlds", title: "The War of the Worlds", author: "H. G. Wells", year: "1898", band: "#0F766E", paper: "#E7F0E4", ink: "#042F2E" },
  { id: 15, slug: "hunger", title: "Hunger", author: "Knut Hamsun", year: "1890", band: "#292524", paper: "#E7E5E4", ink: "#1C1917" },
  { id: 16, slug: "great-expectations", title: "Great Expectations", author: "Charles Dickens", year: "1861", band: "#EA580C", paper: "#F8EBD8", ink: "#1C1917" },
  { id: 17, slug: "the-little-prince", title: "The Little Prince", author: "Antoine de Saint-Exupéry", year: "1943", band: "#0369A1", paper: "#FEF3C7", ink: "#0C4A6E" },
  { id: 18, slug: "the-invisible-man", title: "The Invisible Man", author: "H. G. Wells", year: "1897", band: "#1C1917", paper: "#F5F5F4", ink: "#0C0A09" },
  { id: 19, slug: "little-women", title: "Little Women", author: "Louisa May Alcott", year: "1868", band: "#BE123C", paper: "#FDE8E8", ink: "#4C0519" },
  { id: 20, slug: "the-waves", title: "The Waves", author: "Virginia Woolf", year: "1931", band: "#0E7490", paper: "#ECFEFF", ink: "#164E63" },
  { id: 21, slug: "the-bodysurfers", title: "The Bodysurfers", author: "Robert Drewe", year: "1983", band: "#F59E0B", paper: "#FFFBEB", ink: "#78350F" },
  { id: 22, slug: "dangerous-liaisons", title: "Dangerous Liaisons", author: "Pierre Choderlos de Laclos", year: "1782", band: "#A16207", paper: "#FEFCE8", ink: "#422006" },
  { id: 23, slug: "brideshead-revisited", title: "Brideshead Revisited", author: "Evelyn Waugh", year: "1945", band: "#1E3A8A", paper: "#EEF2FF", ink: "#1E1B4B" },
  { id: 24, slug: "breakfast-at-tiffanys", title: "Breakfast at Tiffany’s", author: "Truman Capote", year: "1958", band: "#0D9488", paper: "#CCFBF1", ink: "#134E4A" },
  { id: 25, slug: "the-jungle-book", title: "The Jungle Book", author: "Rudyard Kipling", year: "1894", band: "#166534", paper: "#ECFCCB", ink: "#14532D" },
  { id: 26, slug: "wuthering-heights", title: "Wuthering Heights", author: "Emily Brontë", year: "1847", band: "#44403C", paper: "#E7E5E4", ink: "#1C1917" },
  { id: 27, slug: "holding-the-man", title: "Holding the Man", author: "Timothy Conigrave", year: "1995", band: "#CA8A04", paper: "#FEF9C3", ink: "#422006" },
  { id: 28, slug: "of-mice-and-men", title: "Of Mice and Men", author: "John Steinbeck", year: "1937", band: "#7C2D12", paper: "#FFEDD5", ink: "#431407" },
  { id: 29, slug: "love-in-the-time-of-cholera", title: "Love in the Time of Cholera", author: "Gabriel García Márquez", year: "1985", band: "#9F1239", paper: "#FFE4E6", ink: "#4C0519" },
  { id: 30, slug: "treasure-island", title: "Treasure Island", author: "Robert Louis Stevenson", year: "1883", band: "#C2410C", paper: "#FFEDD5", ink: "#7C2D12" },
  { id: 31, slug: "the-adventures-of-sherlock-holmes", title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", year: "1892", band: "#57534E", paper: "#F5F5F4", ink: "#1C1917" },
  { id: 32, slug: "one-flew-over-the-cuckoos-nest", title: "One Flew Over the Cuckoo’s Nest", author: "Ken Kesey", year: "1962", band: "#3F6212", paper: "#ECFCCB", ink: "#1A2E05" },
  { id: 33, slug: "hamlet", title: "Hamlet", author: "William Shakespeare", year: "c.1600", band: "#171717", paper: "#FEF3C7", ink: "#1C1917" },
  { id: 34, slug: "the-time-machine", title: "The Time Machine", author: "H. G. Wells", year: "1895", band: "#92400E", paper: "#FEF3C7", ink: "#451A03" },
];

function wrap(text, max = 18) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function coverSvg(book) {
  const titleLines = wrap(book.title, book.title.length > 22 ? 16 : 18);
  const titleStart = 278 - ((titleLines.length - 1) * 22) / 2;
  const titleSpans = titleLines
    .map((line, index) => {
      const dy = index === 0 ? titleStart : 28;
      return `<tspan x="200" dy="${index === 0 ? dy : 28}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="620" viewBox="0 0 400 620" role="img" aria-labelledby="title">
  <title id="title">${escapeXml(book.title)} — ${escapeXml(book.author)}</title>
  <rect width="400" height="620" fill="${book.band}"/>
  <rect x="18" y="18" width="364" height="584" fill="none" stroke="${book.paper}" stroke-width="2" opacity="0.55"/>
  <rect x="0" y="196" width="400" height="228" fill="${book.paper}"/>
  <rect x="0" y="196" width="400" height="8" fill="${book.ink}" opacity="0.85"/>
  <rect x="0" y="416" width="400" height="8" fill="${book.ink}" opacity="0.85"/>
  <text x="200" y="72" text-anchor="middle" fill="${book.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="11" letter-spacing="5">CLASSICS</text>
  <text x="200" y="108" text-anchor="middle" fill="${book.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="3">${escapeXml(book.year)}</text>
  <ellipse cx="200" cy="148" rx="28" ry="34" fill="${book.paper}" opacity="0.95"/>
  <ellipse cx="200" cy="156" rx="16" ry="20" fill="${book.band}"/>
  <circle cx="193" cy="146" r="3" fill="${book.paper}"/>
  <circle cx="207" cy="146" r="3" fill="${book.paper}"/>
  <path d="M188 168 C200 176 212 176 212 168" fill="none" stroke="${book.paper}" stroke-width="2"/>
  <text text-anchor="middle" fill="${book.ink}" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700">${titleSpans}</text>
  <text x="200" y="390" text-anchor="middle" fill="${book.ink}" font-family="Georgia, 'Times New Roman', serif" font-size="13" letter-spacing="1.5">${escapeXml(book.author.toUpperCase())}</text>
  <text x="200" y="520" text-anchor="middle" fill="${book.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="12" letter-spacing="3">A SHELF EDITION</text>
  <text x="200" y="552" text-anchor="middle" fill="${book.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="11" opacity="0.8">No. ${String(book.id).padStart(2, "0")}</text>
</svg>
`;
}

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "covers");
await mkdir(outDir, { recursive: true });

for (const book of books) {
  const filename = `${String(book.id).padStart(2, "0")}-${book.slug}.svg`;
  await writeFile(path.join(outDir, filename), coverSvg(book), "utf8");
}

console.log(`Wrote ${books.length} covers to ${outDir}`);
