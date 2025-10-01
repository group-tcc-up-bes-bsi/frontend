import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function deleteDocument(
  userCurrent: UserObj,
  documentId: number
): Promise<{ message: MessageObj; success: boolean }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/${documentId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
      body: null,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(response.status),
          errorData?.message || "Erro ao deletar documento",
          "error"
        ),
        success: false,
      };
    }

    return {
      message: new MessageObj(
        "success",
        "Documento deletado",
        `Documento de ID ${documentId} deletado com sucesso`,
        "success"
      ),
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro: Servidor inoperante ao tentar deletar documento",
        "error"
      ),
      success: false,
    };
  }
}
