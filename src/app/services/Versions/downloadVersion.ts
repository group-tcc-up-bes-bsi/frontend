import { UserObj } from "@/app/models/UserObj";
import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";

export async function downloadVersion(
  userCurrent: UserObj,
  versionId: number
): Promise<{ message: MessageObj; file?: File }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/document-versions/download/${versionId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(errorData?.statusCode || 500),
          errorData?.message || "Erro ao baixar arquivo",
          "error"
        ),
      };
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `document_version_${versionId}`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }
    const file = new File([blob], filename, { type: blob.type });

    return {
      message: new MessageObj(
        "success",
        "Download realizado",
        "O arquivo foi carregado para pré-visualização",
        "success"
      ),
      file,
    };
  } catch (error) {
    console.error(error);
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro: Servidor inoperante",
        "error"
      ),
    };
  }
}
