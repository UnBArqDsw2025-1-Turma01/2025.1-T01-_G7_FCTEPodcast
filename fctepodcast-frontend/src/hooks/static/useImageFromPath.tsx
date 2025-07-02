import { AxiosInstace } from "../../utils/axios/AxiosInstance";

export async function getImageUrlFromPath(
  imagePath: string | null | undefined
): Promise<string> {
  if (!imagePath) {
    return "";
  }

  try {
    const response = await AxiosInstace(`/files/images/${imagePath}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return "";
  }
}
