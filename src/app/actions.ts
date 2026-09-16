"use server";

import { updateCriticFields } from "@/lib/store";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveCriticNotes(formData: FormData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  const criticRating = Number.parseInt(String(formData.get("criticRating") ?? ""), 10);
  const criticReview = String(formData.get("criticReview") ?? "").trim();

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Invalid book id.");
  }
  if (!Number.isInteger(criticRating) || criticRating < 1 || criticRating > 5) {
    throw new Error("criticRating must be an integer from 1 to 5.");
  }
  if (criticReview.length < 20 || criticReview.length > 4000) {
    throw new Error("criticReview must be between 20 and 4000 characters.");
  }

  const updated = await updateCriticFields(id, { criticRating, criticReview });
  if (!updated) {
    throw new Error("Book not found.");
  }

  revalidatePath("/");
  revalidatePath("/citations");
  revalidatePath("/api/books");
  redirect(`/?book=${id}&saved=1`);
}
