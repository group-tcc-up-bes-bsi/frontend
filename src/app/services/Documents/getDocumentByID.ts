import { DocumentObj } from "@/app/models/DocumentObj";
import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { getErrorTitle } from "../ErrorTitle";
import { getVersionsByDocument } from "../Versions/getVersions";
import { VersionObj } from "@/app/models/VersionObj";

export async function getDocumentById(
  userCurrent: UserObj,
  document: DocumentObj
): Promise<{ message: MessageObj; document: DocumentObj | null }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/id/${document.documentId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    const responseData = await response.json().catch(() => null);

    if (!responseData || responseData?.statusCode) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(responseData?.statusCode || 404),
          "Documento não encontrado",
          "error"
        ),
        document: null,
      };
    }

    const doc: DocumentObj = {
      documentId: responseData.documentId,
      name: responseData.name,
      type: responseData.type,
      description: responseData.description,
      creationDate: new Date(responseData.creationDate),
      lastModifiedDate: new Date(responseData.lastModifiedDate),
      organization: responseData.organization,
      version: "Sem Versão",
      favorite: false,
    };

    try {
      const versionsResponse = await getVersionsByDocument(
        userCurrent,
        document
      );
      if (versionsResponse.versions.length > 0) {
        const activeVersion: VersionObj | undefined =
          versionsResponse.versions.find(
            (v) => v.documentVersionId === responseData.activeVersionId
          );

        if (activeVersion) {
          doc.version = activeVersion.name;
        } else {
          doc.version = versionsResponse.versions[0].name;
        }
      }
    } finally {}

    return {
      message: new MessageObj(
        "success",
        "Documento carregado",
        "Documento carregado com sucesso",
        "success"
      ),
      document: doc,
    };
  } catch {
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro: Servidor inoperante",
        "error"
      ),
      document: null,
    };
  }
}
