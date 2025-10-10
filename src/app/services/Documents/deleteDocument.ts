import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";
import { DocumentObj } from "@/app/models/DocumentObj";

export async function deleteDocument(
  userCurrent: UserObj,
  document: DocumentObj
): Promise<{ message: MessageObj; success: boolean }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/${document.documentId}`;

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
        `Documento de ID ${document.name} deletado com sucesso`,
        "success"
      ),
      success: true,
    };
  } catch {
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
