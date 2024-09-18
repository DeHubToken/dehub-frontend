import { env } from "@/configs";

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

function getErrorFromUnknown(error: unknown) {
  const err = error as Record<string, unknown>;
  if ("error" in err) {
    return err.error as string;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function api<T>(
  endpoint: string,
  config?: RequestInit & { tags?: string[] }
): Promise<ApiResponse<T>> {
  const { cache = "no-store", tags, ...restConfig } = config || {};
  const url = env.apiBaseUrl + endpoint;
  try {
    const result = await fetch(url, {
      method: "GET",
      ...(cache && !restConfig.next?.revalidate && { cache }),
      ...(tags && { next: { tags } }),
      ...restConfig
    });

    if (result.headers.get("content-type")?.includes("application/json")) {
      const body = await result.json();
      if (!result.ok) {
        return { success: false, error: getErrorFromUnknown(body) };
      }

      return { success: true, data: body as T };
    }

    return { success: false, error: "Invalid response" };
  } catch (err) {
    return { success: false, error: getErrorFromUnknown(err) };
  }
}
