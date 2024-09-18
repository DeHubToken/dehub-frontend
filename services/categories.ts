import { api } from "@/libs/api";

export async function getCategories() {
  const response = await api<string[]>("/get_categories", {
    next: { revalidate: 3 * 60, tags: ["categories"] }
  });
  return response;
}
