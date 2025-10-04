import { DocumentObj } from "@/app/models/DocumentObj";
import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { VersionObj } from "@/app/models/VersionObj";
import { getErrorTitle } from "../ErrorTitle";
import { getOrganizationUsers } from "../Organizations/organizationsServices";

export async function getVersionsByDocument(
  userCurrent: UserObj,
  doc: DocumentObj
): Promise<{ message: MessageObj; versions: VersionObj[] }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/document-versions/document/${doc.documentId}`;

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
          "Nenhuma versão encontrada",
          "error"
        ),
        versions: [],
      };
    }

    let versions: VersionObj[];

    const orgUsersResponse = await getOrganizationUsers(
      doc.organization.organizationId,
      userCurrent
    );

    const myUser = orgUsersResponse.users.find(
      (user) => user.username === userCurrent.username
    );
    if (myUser?.inviteAccepted !== false) {
      versions = responseData.map((item) => ({
        documentVersionId: item.documentVersionId,
        name: item.name,
        filePath: item.filePath,
        creationDate: new Date(item.creationDate),
        document: doc,
        user: userCurrent
      }));
      return {
        message: new MessageObj(
          "success",
          "Versões carregadas",
          "Versões carregadas com sucesso",
          "success"
        ),
        versions,
      };
    }

    return {
      message: new MessageObj(
        "error",
        "Não encontrado",
        "Nenhuma documento encontrado",
        "error"
      ),
      versions: [],
    };
  } catch {
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro: Servidor inoperante",
        "error"
      ),
      versions: [],
    };
  }
}
