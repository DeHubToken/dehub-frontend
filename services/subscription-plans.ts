import { api } from "@/libs/api";

export async function createOrUpdate(data: FormData) {
  return api<{}>("/subscription/plans", {
    method: "POST",
    body: data
  });
}
// export async function update(data: any) {
//   return api<{
//     id: string;
//     isHidden: boolean;
//   }>("/token_visibility", {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json' // Specify the content type
//     },
//     body: JSON.stringify(data)
//   });
// }
