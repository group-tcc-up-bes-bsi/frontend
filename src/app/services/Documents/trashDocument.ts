import { DocumentObj } from "@/app/models/DocumentObj";
import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { OrganizationObj } from "@/app/models/OrganizationObj";
import { getErrorTitle } from "../ErrorTitle";
import { getVersionsByDocument } from "../Versions/getVersions";

export async function getDocumentsTrash(
  userCurrent: UserObj,
  organization: OrganizationObj
): Promise<{ message: MessageObj; documents: DocumentObj[] }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/organization/${organization.organizationId}/trashed`;

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
          "Nenhum documento encontrado na lixeira",
          "error"
        ),
        documents: [],
      };
    }
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
        favorite: false,
      };

      documents.push(document);
    }

    return {
      message: new MessageObj(
        "success",
        "Documentos da lixeira carregados",
        "Documentos carregados com sucesso",
        "success"
      ),
      documents,
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

export async function moveDocumentToTrash(
  userCurrent: UserObj,
  document: DocumentObj
): Promise<{ message: MessageObj }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/${document.documentId}/trash`;

  try {
    const responseVersion = await getVersionsByDocument(userCurrent, document);
    if (responseVersion.versions.length > 0) {
      return {
        message: new MessageObj(
          "error",
          `${document.name} não foi excluído`,
          "O documento possui versões associadas. Exclua todas as versões antes de remover o documento.",
          "error"
        ),
      };
    }
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
    });

    if (!response.ok) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(response.status),
          "Não foi possível mover o documento para a lixeira",
          "error"
        ),
      };
    }

    return {
      message: new MessageObj(
        "success",
        "Documento atualizado",
        "Documento movido para a lixeira com sucesso",
        "success"
      ),
    };
  } catch {
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

export async function restoreDocumentFromTrash(
  userCurrent: UserObj,
  documentId: number
): Promise<{ message: MessageObj }> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/documents/${documentId}/restore`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCurrent?.jwtToken}`,
      },
      body: "",
    });

    if (!response.ok) {
      return {
        message: new MessageObj(
          "error",
          getErrorTitle(response.status),
          "Não foi possível restaurar o documento",
          "error"
        ),
      };
    }

    return {
      message: new MessageObj(
        "success",
        "Documento restaurado",
        "Documento restaurado com sucesso",
        "success"
      ),
    };
  } catch {
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
