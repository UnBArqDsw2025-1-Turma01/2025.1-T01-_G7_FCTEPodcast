import { AxiosInstace } from "./axios/AxiosInstance";

export const fetchImage = async (imageUrl: string): Promise<string> => {
  const response = await AxiosInstace.get(imageUrl, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
};
