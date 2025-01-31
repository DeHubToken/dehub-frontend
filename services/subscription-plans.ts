import { api } from "@/libs/api";
import objectToGetParams from "@/libs/utils";

export async function createPlan(data: FormData) {
  return  await api<{}>("/plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  
}
export async function getPlan(id: string) {
  return api<{}>(`/plans/${id}`, {
    method: "GET"
  });
}
export async function getPlans(obj: any) {
  const plans = objectToGetParams(obj);
  return api<{}>(`/plans${plans}`, {
    method: "GET"
  });
}
export async function updatePlan(data: FormData, id: string | number) {
  return api<{}>(`/plans/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
export async function buyPlan(data: {planId:string,account:`0x${string}`|undefined}) {
  return api<{}>(`/plan/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
