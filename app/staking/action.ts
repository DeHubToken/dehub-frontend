"use server";

import { revalidateTag } from "next/cache";

export async function invalidateUpload() {
  revalidateTag("nfts");
}
