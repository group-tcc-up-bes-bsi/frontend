import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { getErrorTitle } from "../ErrorTitle";

export async function deleteVersion(
  userCurrent: UserObj,
  versionId: number
): Promise<{ message: MessageObj }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/document-versions/${versionId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(responseData?.statusCode || 500),
          responseData?.message || "Erro ao excluir versão",
          "error"
        ),
      };
    }

    return {
      message: new MessageObj(
        "success",
        "Versão removida",
        "A versão foi removida com sucesso",
        "success"
      ),
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
