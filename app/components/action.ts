"use server";

import { redirect } from "next/navigation";

import objectToGetParams from "@/libs/utils";

type Params = {
  category?: string;
  type?: string;
  range?: string;
  q: string;
};

export async function search(params: Params) {
  const { category, type, range, q } = params;
  const query = objectToGetParams({ category, type, range, q });
  redirect(`/${query}`);
}
