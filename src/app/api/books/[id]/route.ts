import { getBook, updateCriticFields } from "@/lib/store";

export const dynamic = "force-dynamic";

function parseId(value: string) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (id === null) {
    return Response.json({ error: "Invalid book id." }, { status: 400 });
  }

  const book = await getBook(id);
  if (!book) {
    return Response.json({ error: "Book not found." }, { status: 404 });
  }

  return Response.json(book);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (id === null) {
    return Response.json({ error: "Invalid book id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Request body must be an object." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const extraKeys = Object.keys(payload).filter(
    (key) => key !== "criticRating" && key !== "criticReview",
  );
  if (extraKeys.length > 0) {
    return Response.json(
      {
        error:
          "Only criticRating and criticReview may be updated.",
        rejectedKeys: extraKeys,
      },
      { status: 400 },
    );
  }

  if (!("criticRating" in payload) || !("criticReview" in payload)) {
    return Response.json(
      { error: "Both criticRating and criticReview are required." },
      { status: 400 },
    );
  }

  const { criticRating, criticReview } = payload;
  if (
    typeof criticRating !== "number" ||
    !Number.isInteger(criticRating) ||
    criticRating < 1 ||
    criticRating > 5
  ) {
    return Response.json(
      { error: "criticRating must be an integer from 1 to 5." },
      { status: 400 },
    );
  }

  if (typeof criticReview !== "string") {
    return Response.json(
      { error: "criticReview must be a string." },
      { status: 400 },
    );
  }

  const trimmedReview = criticReview.trim();
  if (trimmedReview.length < 20) {
    return Response.json(
      { error: "criticReview must be at least 20 characters." },
      { status: 400 },
    );
  }
  if (trimmedReview.length > 4000) {
    return Response.json(
      { error: "criticReview must be 4000 characters or fewer." },
      { status: 400 },
    );
  }

  const updated = await updateCriticFields(id, {
    criticRating,
    criticReview: trimmedReview,
  });

  if (!updated) {
    return Response.json({ error: "Book not found." }, { status: 404 });
  }

  return Response.json(updated);
}
