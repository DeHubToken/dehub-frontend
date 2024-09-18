"use server";

import { revalidatePath } from "next/cache";

import { updateProfile } from "@/services/user";

export async function update(form: FormData) {
  revalidatePath("/me");
  return updateProfile(form);
}
