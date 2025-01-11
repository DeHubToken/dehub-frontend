import { getCategories } from "@/services/categories";
import GoLiveForm from "./components/go-live";


export default async function Page() {
  const categoriesRes = await getCategories();
  let categories: string[] = [];

  if (categoriesRes.success) {
    categories = categoriesRes.data;
  }

  return <GoLiveForm categories={categories} />;
}
