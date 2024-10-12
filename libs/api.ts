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

export async function apiStream<T>(
  endpoint: string,
  config?: RequestInit & { tags?: string[] },
  callback?: (data: T) => void // Callback function to handle streamed data
): Promise<ApiResponse<T>> {
  const { cache = "no-store", tags, ...restConfig } = config || {};
  const url = env.apiBaseUrl + endpoint;

  try {
    const result = await fetch(url, {
      method: "GET",
      ...(cache && !restConfig.next?.revalidate && { cache }),
      ...(tags && { next: { tags } }),
      ...restConfig,
    });

    if (!result.ok) {
      const errorText = await result.text();
      return { success: false, error: `Error fetching data: ${errorText}` };
    }

    // Process the stream response
    const reader = result.body?.getReader();
    const decoder = new TextDecoder();
    let partialData = '';
    let resul = {}

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and process it
      const chunk = decoder.decode(value, { stream: true });
      partialData += chunk;

      // Remove the "data: " prefix if it exists
      if (partialData.startsWith("data: ")) {
        partialData = partialData.substring(6); // Remove the first 6 characters ("data: ")
      }

      // Attempt to parse JSON objects if applicable
      let startIndex = partialData.indexOf('{');
      let endIndex = partialData.lastIndexOf('}');

      // Only try parsing if we have both a starting and ending brace
      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        try {
          const jsonString = partialData.substring(startIndex, endIndex + 1); // Extract the JSON object
          const parsedData = JSON.parse(jsonString);
          if(parsedData.result) resul = parsedData.result
          console.log(parsedData, resul);

          // Clear the buffer once the JSON object has been successfully parsed
          partialData = partialData.slice(endIndex + 1);

          // Invoke the callback with the parsed data
          if (callback) {
            callback(parsedData);
          }
        } catch (parseError) {
          // If parsing fails, continue appending chunks until a complete JSON object is formed
          console.warn('Incomplete JSON data, waiting for more chunks...');
        }
      }
    }

    return { success: true, data: resul as T}; // Mark as success if the stream completes
  } catch (err) {
    return { success: false, error: `Stream error: ${getErrorFromUnknown(err)}` };
  }
}