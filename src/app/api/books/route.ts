import { getBooks } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const books = await getBooks();
  return Response.json(books);
}
