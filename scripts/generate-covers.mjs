import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Cartouche cream locked to The Little Prince (id 17) band system. */
const CLASSICS_PAPER = "#F6EED4";

const books = [
  { id: 1, slug: "the-handmaids-tale", title: "The Handmaid's Tale", author: "Margaret Atwood", year: "1985", band: "#8B1E3F", ink: "#2A0F16" },
  { id: 2, slug: "around-the-world-in-eighty-days", title: "Around the World in Eighty Days", author: "Jules Verne", year: "1873", band: "#E85D04", ink: "#1C140C" },
  { id: 3, slug: "nausea", title: "Nausea", author: "Jean-Paul Sartre", year: "1938", band: "#4B5563", ink: "#111827" },
  { id: 4, slug: "the-wind-in-the-willows", title: "The Wind in the Willows", author: "Kenneth Grahame", year: "1908", band: "#4D7C0F", ink: "#1A2E05" },
  { id: 5, slug: "dantes-inferno", title: "Dante's Inferno", author: "Dante Alighieri", year: "c.1320", band: "#7F1D1D", ink: "#1C0A0A" },
  { id: 6, slug: "dracula", title: "Dracula", author: "Bram Stoker", year: "1897", band: "#3B0A45", ink: "#1A0B1F" },
  { id: 7, slug: "frankenstein", title: "Frankenstein", author: "Mary Shelley", year: "1818", band: "#365314", ink: "#14532D" },
  { id: 8, slug: "the-collector", title: "The Collector", author: "John Fowles", year: "1963", band: "#334155", ink: "#0F172A" },
  { id: 9, slug: "the-communist-manifesto", title: "The Communist Manifesto", author: "Karl Marx \u0026 Friedrich Engels", year: "1848", band: "#B91C1C", ink: "#450A0A" },
  { id: 10, slug: "1984", title: "1984", author: "George Orwell", year: "1949", band: "#111827", ink: "#111827" },
  { id: 11, slug: "freedom-is-a-constant-struggle", title: "Freedom Is a Constant Struggle", author: "Angela Y. Davis", year: "2016", band: "#B45309", ink: "#1C1917" },
  { id: 12, slug: "the-grapes-of-wrath", title: "The Grapes of Wrath", author: "John Steinbeck", year: "1939", band: "#B45309", ink: "#431407" },
  { id: 13, slug: "war-and-peace", title: "War and Peace", author: "Leo Tolstoy", year: "1869", band: "#1E3A5F", ink: "#0B1C2C" },
  { id: 14, slug: "the-war-of-the-worlds", title: "The War of the Worlds", author: "H. G. Wells", year: "1898", band: "#0F766E", ink: "#042F2E" },
  { id: 15, slug: "hunger", title: "Hunger", author: "Knut Hamsun", year: "1890", band: "#292524", ink: "#1C1917" },
  { id: 16, slug: "great-expectations", title: "Great Expectations", author: "Charles Dickens", year: "1861", band: "#EA580C", ink: "#1C1917" },
  { id: 17, slug: "the-little-prince", title: "The Little Prince", author: "Antoine de Saint-Exup\u00e9ry", year: "1943", band: "#0369A1", ink: "#0C4A6E" },
  { id: 18, slug: "the-invisible-man", title: "The Invisible Man", author: "H. G. Wells", year: "1897", band: "#1C1917", ink: "#0C0A09" },
  { id: 19, slug: "little-women", title: "Little Women", author: "Louisa May Alcott", year: "1868", band: "#BE123C", ink: "#4C0519" },
  { id: 20, slug: "the-waves", title: "The Waves", author: "Virginia Woolf", year: "1931", band: "#0E7490", ink: "#164E63" },
  { id: 21, slug: "the-bodysurfers", title: "The Bodysurfers", author: "Robert Drewe", year: "1983", band: "#B45309", ink: "#78350F" },
  { id: 22, slug: "dangerous-liaisons", title: "Dangerous Liaisons", author: "Pierre Choderlos de Laclos", year: "1782", band: "#A16207", ink: "#422006" },
  { id: 23, slug: "brideshead-revisited", title: "Brideshead Revisited", author: "Evelyn Waugh", year: "1945", band: "#1E3A8A", ink: "#1E1B4B" },
  { id: 24, slug: "breakfast-at-tiffanys", title: "Breakfast at Tiffany\u2019s", author: "Truman Capote", year: "1958", band: "#0D9488", ink: "#134E4A" },
  { id: 25, slug: "the-jungle-book", title: "The Jungle Book", author: "Rudyard Kipling", year: "1894", band: "#166534", ink: "#14532D" },
  { id: 26, slug: "wuthering-heights", title: "Wuthering Heights", author: "Emily Bront\u00eb", year: "1847", band: "#44403C", ink: "#1C1917" },
  { id: 27, slug: "holding-the-man", title: "Holding the Man", author: "Timothy Conigrave", year: "1995", band: "#A16207", ink: "#422006" },
  { id: 28, slug: "of-mice-and-men", title: "Of Mice and Men", author: "John Steinbeck", year: "1937", band: "#7C2D12", ink: "#431407" },
  { id: 29, slug: "love-in-the-time-of-cholera", title: "Love in the Time of Cholera", author: "Gabriel Garc\u00eda M\u00e1rquez", year: "1985", band: "#9F1239", ink: "#4C0519" },
  { id: 30, slug: "treasure-island", title: "Treasure Island", author: "Robert Louis Stevenson", year: "1883", band: "#C2410C", ink: "#7C2D12" },
  { id: 31, slug: "the-adventures-of-sherlock-holmes", title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", year: "1892", band: "#44403C", ink: "#1C1917" },
  { id: 32, slug: "one-flew-over-the-cuckoos-nest", title: "One Flew Over the Cuckoo\u2019s Nest", author: "Ken Kesey", year: "1962", band: "#3F6212", ink: "#1A2E05" },
  { id: 33, slug: "hamlet", title: "Hamlet", author: "William Shakespeare", year: "c.1600", band: "#171717", ink: "#1C1917" },
  { id: 34, slug: "the-time-machine", title: "The Time Machine", author: "H. G. Wells", year: "1895", band: "#92400E", ink: "#451A03" },
  { id: 35, slug: "journeys-end", title: "Journey\u2019s End", author: "R. C. Sherriff", year: "1928", band: "#3F4A3C", ink: "#1C1917" },
];

function wrap(text, max = 18) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length \u003e max \u0026\u0026 line) {
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
    .replaceAll("\u0026", "\u0026amp;")
    .replaceAll("\u003c", "\u0026lt;")
    .replaceAll("\u003e", "\u0026gt;")
    .replaceAll('"', "\u0026quot;");
}

function coverSvg(book) {
  const paper = CLASSICS_PAPER;
  const titleMax = book.title.length \u003e 24 ? 16 : 18;
  const titleLines = wrap(book.title, titleMax);
  const longest = Math.max(...titleLines.map((line) =\u003e line.length));
  const titleSize =
    titleLines.length \u003e= 3 ? 22 : titleLines.length === 2 ? 26 : longest \u003c= 8 ? 34 : 29;
  const lineHeight = titleSize + 8;
  const creamTop = 200;
  const creamHeight = 216;
  const creamCenter = creamTop + creamHeight / 2 - 10;
  const titleBlock = titleLines.length * lineHeight;
  const titleStart = creamCenter - titleBlock / 2 + titleSize * 0.85;
  const titleSpans = titleLines
    .map((line, index) =\u003e {
      const dy = index === 0 ? titleStart : lineHeight;
      return `\u003ctspan x="200" dy="${dy}"\u003e${escapeXml(line)}\u003c/tspan\u003e`;
    })
    .join("");

  const authorCaps = book.author.toUpperCase();
  const authorLines = authorCaps.length \u003e 30 ? wrap(authorCaps, 26) : [authorCaps];
  const authorStart = creamTop + creamHeight - 28 - (authorLines.length - 1) * 16;
  const authorSpans = authorLines
    .map((line, index) =\u003e {
      const dy = index === 0 ? authorStart : 16;
      return `\u003ctspan x="200" dy="${dy}"\u003e${escapeXml(line)}\u003c/tspan\u003e`;
    })
    .join("");

  return `\u003c?xml version="1.0" encoding="UTF-8"?\u003e
\u003csvg xmlns="http://www.w3.org/2000/svg" width="400" height="620" viewBox="0 0 400 620" role="img" aria-labelledby="title"\u003e
  \u003ctitle id="title"\u003e${escapeXml(book.title)} — ${escapeXml(book.author)}\u003c/title\u003e
  \u003crect width="400" height="620" fill="${book.band}"/\u003e
  \u003crect x="18" y="18" width="364" height="584" fill="none" stroke="${paper}" stroke-width="1.6" opacity="0.88"/\u003e
  \u003crect x="24" y="24" width="352" height="572" fill="none" stroke="${paper}" stroke-width="0.7" opacity="0.4"/\u003e
  \u003crect x="40" y="34" width="320" height="150" fill="none" stroke="${paper}" stroke-width="1.35" opacity="0.78"/\u003e
  \u003crect x="40" y="436" width="320" height="150" fill="none" stroke="${paper}" stroke-width="1.35" opacity="0.78"/\u003e
  \u003crect x="0" y="${creamTop}" width="400" height="${creamHeight}" fill="${paper}"/\u003e
  \u003crect x="0" y="${creamTop}" width="400" height="1.2" fill="${book.ink}" opacity="0.28"/\u003e
  \u003crect x="0" y="${creamTop + creamHeight - 1.2}" width="400" height="1.2" fill="${book.ink}" opacity="0.28"/\u003e
  \u003ctext x="200" y="62" text-anchor="middle" fill="${paper}" font-family="Georgia, 'Times New Roman', serif" font-size="11" letter-spacing="6"\u003eCLASSICS\u003c/text\u003e
  \u003ctext x="200" y="96" text-anchor="middle" fill="${paper}" font-family="Georgia, 'Times New Roman', serif" font-size="16" letter-spacing="4"\u003e${escapeXml(book.year)}\u003c/text\u003e
  \u003ccircle cx="200" cy="142" r="30" fill="${paper}"/\u003e
  \u003ccircle cx="191" cy="136" r="3.4" fill="${book.band}"/\u003e
  \u003ccircle cx="209" cy="136" r="3.4" fill="${book.band}"/\u003e
  \u003cpath d="M186 150 Q200 164 214 150" fill="none" stroke="${book.band}" stroke-width="2.2" stroke-linecap="round"/\u003e
  \u003ctext text-anchor="middle" fill="${book.ink}" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="700"\u003e${titleSpans}\u003c/text\u003e
  \u003ctext text-anchor="middle" fill="${book.ink}" font-family="Georgia, 'Times New Roman', serif" font-size="12" letter-spacing="2.4"\u003e${authorSpans}\u003c/text\u003e
  \u003ctext x="200" y="508" text-anchor="middle" fill="${paper}" font-family="Georgia, 'Times New Roman', serif" font-size="12" letter-spacing="3.4"\u003eA SHELF EDITION\u003c/text\u003e
  \u003ctext x="200" y="542" text-anchor="middle" fill="${paper}" font-family="Georgia, 'Times New Roman', serif" font-size="13" opacity="0.92"\u003eNo. ${book.id}\u003c/text\u003e
\u003c/svg\u003e
`;
}

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "covers");
await mkdir(outDir, { recursive: true });

for (const book of books) {
  const filename = `${String(book.id).padStart(2, "0")}-${book.slug}.svg`;
  await writeFile(path.join(outDir, filename), coverSvg(book), "utf8");
}

console.log(`Wrote ${books.length} covers to ${outDir}`);
