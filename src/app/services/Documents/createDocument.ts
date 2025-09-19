import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function createDocument(
  Name: string,
  Description: string,
  Type: string,
  OrganizationId: number,
  userCurrent: UserObj
): Promise<{ message: MessageObj; documentId: number }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents`;
  const documentData = {
    name: Name,
    description: Description,
    type: Type.toLowerCase(),
    organizationId: OrganizationId
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
      body: JSON.stringify(documentData),
    });

    const responseData = await response.json().catch(() => null);

    if (response.ok) {
      return {
        message: new MessageObj(
          "success",
          "Documento criado",
          "Documento criado com sucesso",
          "success"
        ),
        documentId: responseData.documentId,
      };
    }
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(responseData.statusCode),
        responseData.message,
        "error"
      ),
      documentId: 0,
    };
  } catch (error) {
    console.error(error);
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        `Erro: Servidor inoperante`,
        "error"
      ),
      documentId: 0,
    };
  }
}
