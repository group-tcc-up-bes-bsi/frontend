import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function updateActiveVersion(
  documentId: number,
  versionId: number,
  userCurrent: UserObj,
): Promise<{ message: MessageObj }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/${documentId}/active-version/${versionId}`;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    await response.json().catch(() => null);
    return {
      message: new MessageObj(
        "success",
        "Documento atualizado",
        "Documento atualizado com sucesso",
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
