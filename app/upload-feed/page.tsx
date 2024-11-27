import { getCategories } from "@/services/categories";

import { UploadForm } from "./components/upload-form";

export default async function Page() {
  const categoriesRes = await getCategories();
  let categories: string[] = [];

  if (categoriesRes.success) {
    categories = categoriesRes.data;
  }

  return <UploadForm categories={categories} />;
}
