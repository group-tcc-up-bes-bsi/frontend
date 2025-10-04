import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function updateDocument(
  documentId: number,
  Name: string,
  Description: string,
  Type: string,
  userCurrent: UserObj
): Promise<{ message: MessageObj }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/${documentId}`;
  const documentData = {
    name: Name,
    type: Type,
    description: Description,
  };
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
      body: JSON.stringify(documentData),
    });

    await response.json().catch(() => null);
    return {
      message: new MessageObj(
        "success",
        "Documento atualizada",
        "Documento atualizada com sucesso",
        "success"
      ),
    };
  } catch {
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        `Erro: Servidor inoperante`,
        "error"
      ),
    };
  }
}
