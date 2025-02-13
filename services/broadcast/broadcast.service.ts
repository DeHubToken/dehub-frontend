import { api } from "@/libs/api";

export const createLiveStream = async (data: any, coverImage: File) => {
  // console.log(data, coverImage);

  const formData = new FormData();

  for (const key in data) {
    if (key === "settings" || key === "categories") {
      formData.append(key, JSON.stringify(data[key])); 
    } else {
      formData.append(key, data[key]);
    }
  }

  formData.append("thumbnail", coverImage);

  // console.log(
  //   formData.get("title"),
  //   formData.get("description"),
  //   formData.get("status"),
  //   formData.get("thumbnail"),
  //   formData.get("categories"), 
  //   formData.get("settings")
  // );

  return api<any>(`/live`, {
    method: "POST",
    body: formData,
    // headers: {}
  });
};

export const broadcastStream = async (url: string, data: any) => {
  return api<any>(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const likeLiveStream = async (id: string, data: any) => {
  return api<any>(`/live/${id}/like`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const getLiveStream = async (streamId: string) => {
  return api<any>(`/live/${streamId}`, {
    method: "GET"
  });
};

export const getLiveVideos = async () => {
  return api<any>(`/live`, {
    method: "GET"
  });
};

export const checkIfBroadcastOwner = async (
  address: string | `0x${string}` | undefined,
  stream: any
) => {
  return stream.address === address;
};
