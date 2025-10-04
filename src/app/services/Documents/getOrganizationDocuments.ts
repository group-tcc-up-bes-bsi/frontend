import { DocumentObj } from "@/app/models/DocumentObj";
import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { getErrorTitle } from "../ErrorTitle";
import { OrganizationObj } from "@/app/models/OrganizationObj";
import { getOrganizationUsers } from "../Organizations/organizationsServices";
import { VersionObj } from "@/app/models/VersionObj";
import { getVersionsByDocument } from "../Versions/getVersions";

export async function getOrganizationDocuments(
  userCurrent: UserObj,
  organization: OrganizationObj
): Promise<{ message: MessageObj; documents: DocumentObj[] }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/organization/${organization.organizationId}`;
  const favoritesUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/favorites/documents`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    const responseData = await response.json().catch(() => null);

    const favoritesResponse = await fetch(favoritesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });
    const favoritesData = await favoritesResponse.json().catch(() => []);

    const favoriteIds = new Set<number>(
      Array.isArray(favoritesData)
        ? favoritesData.map((fav: DocumentObj) => fav.documentId)
        : []
    );

    if (
      responseData?.statusCode ||
      !Array.isArray(responseData) ||
      responseData.length === 0
    ) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(responseData?.statusCode || 404),
          "Nenhum documento encontrado",
          "error"
        ),
        documents: [],
      };
    }

    const orgUsersResponse = await getOrganizationUsers(
      organization.organizationId,
      userCurrent
    );

    const myUser = orgUsersResponse.users.find(
      (user) => user.username === userCurrent.username
    );

    if (myUser?.inviteAccepted !== false) {
      const documents: DocumentObj[] = [];

      for (const item of responseData) {
        const document: DocumentObj = {
          documentId: item.documentId,
          name: item.name,
          type: item.type,
          description: item.description,
          creationDate: new Date(item.creationDate),
          lastModifiedDate: new Date(item.lastModifiedDate),
          organization: organization,
          version: "Sem Versão",
          favorite:  favoriteIds.has(item.documentId),
        };

        if (item.activeVersionId) {
          const versionsResponse = await getVersionsByDocument(
            userCurrent,
            document
          );

          if (versionsResponse.versions.length > 0) {
            const activeVersion: VersionObj | undefined =
              versionsResponse.versions.find(
                (v) => v.documentVersionId === item.activeVersionId
              );

            if (activeVersion) {
              document.version = activeVersion.name;
            } else {
              document.version = versionsResponse.versions[0].name;
            }
          }
        }

        documents.push(document);
      }

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
        "Nenhum documento encontrado",
        "error"
      ),
      documents: [],
    };
  } catch {
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
