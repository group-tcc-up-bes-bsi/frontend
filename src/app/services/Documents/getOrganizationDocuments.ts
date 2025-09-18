import { DocumentObj } from "@/app/models/DocumentObj";
import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { getErrorTitle } from "../ErrorTitle";
import { OrganizationObj } from "@/app/models/OrganizationObj";
import { getOrganizationUsers } from "../Organizations/organizationsServices";

export async function getOrganizationDocuments(
  userCurrent: UserObj,
  organization: OrganizationObj
): Promise<{ message: MessageObj; documents: DocumentObj[] }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/organization/${organization.organizationId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    const responseData = await response.json().catch(() => null);
    if (
      !responseData ||
      !Array.isArray(responseData) ||
      responseData.length === 0
    ) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(responseData?.statusCode || 404),
          "Nenhuma documento encontrado",
          "error"
        ),
        documents: [],
      };
    }

    let documents: DocumentObj[];

    const orgUsersResponse = await getOrganizationUsers(
      organization.organizationId,
      userCurrent
    );

    const myUser = orgUsersResponse.users.find(
      (user) => user.username === userCurrent.username
    );
    if (myUser?.inviteAccepted !== false) {
      documents = responseData.map((item) => ({
        documentId: item.documentId,
        name: item.name,
        type: item.type,
        description: item.description,
        creationDate: new Date(item.creationDate),
        lastModifiedDate: new Date(item.lastModifiedDate),
        organization: organization,

        version: item.version || "1.0",
        creator: item.creator || "Desconhecido",
        imagemSrc: item.imagemSrc || "",
        favorite: item.favorite ?? false,
      }));
      return {
        message: new MessageObj(
          "success",
          "Documentos carregados",
          "Documentos carregados com sucesso",
          "success"
        ),
        documents,
      };
    }

    return {
      message: new MessageObj(
        "error",
        "Não encontrado",
        "Nenhuma documento encontrado",
        "error"
      ),
      documents: [],
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
      documents: [],
    };
  }
}

export function countOrganizationDocuments(documents: DocumentObj[]): number {
  if (!documents || documents.length === 0) return 0;
  return documents.length;
}
