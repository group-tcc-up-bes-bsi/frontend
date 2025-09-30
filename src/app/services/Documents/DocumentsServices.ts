import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { DocumentObj } from "@/app/models/DocumentObj";
import { getErrorTitle } from "../ErrorTitle";
import { getMyOrganizations } from "../Organizations/organizationsServices";
import { getOrganizationDocuments } from "./getOrganizationDocuments";
import { Theme } from "@mui/material";
import { getDocumentsTrash } from "./trashDocument";

export async function getDocuments(
  userCurrent: UserObj,
  theme: Theme
): Promise<{ message: MessageObj; documents: DocumentObj[] }> {
  try {
    const { message: orgMessage, organizations } = await getMyOrganizations(
      userCurrent,
      theme
    );

    if (!organizations || organizations.length === 0) {
      return {
        message: new MessageObj(
          "error",
          orgMessage.title,
          "Nenhuma organização encontrada para carregar documentos",
          "error"
        ),
        documents: [],
      };
    }

    const allDocuments: DocumentObj[] = [];
    for (const org of organizations) {
      const { documents } = await getOrganizationDocuments(userCurrent, org);
      allDocuments.push(...documents);
    }

    return {
      message: new MessageObj(
        "success",
        "Documentos carregados",
        `Foram carregados ${allDocuments.length} documentos de ${organizations.length} organizações`,
        "success"
      ),
      documents: allDocuments,
    };
  } catch {
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro ao carregar documentos das organizações",
        "error"
      ),
      documents: [],
    };
  }
}

export async function getAllDocumentsTrash(
  userCurrent: UserObj,
  theme: Theme
): Promise<{ message: MessageObj; documents: DocumentObj[] }> {
  try {
    const { message: orgMessage, organizations } = await getMyOrganizations(
      userCurrent,
      theme
    );

    if (!organizations || organizations.length === 0) {
      return {
        message: new MessageObj(
          "error",
          orgMessage.title,
          "Nenhuma organização encontrada para carregar documentos da lixeira",
          "error"
        ),
        documents: [],
      };
    }

    const allDocuments: DocumentObj[] = [];
    for (const org of organizations) {
      const { documents } = await getDocumentsTrash(userCurrent, org);
      allDocuments.push(...documents);
    }

    return {
      message: new MessageObj(
        "success",
        "Documentos da lixeira carregados",
        `Foram carregados ${allDocuments.length} documentos da lixeira de ${organizations.length} organizações`,
        "success"
      ),
      documents: allDocuments,
    };
  } catch {
    return {
      message: new MessageObj(
        "error",
        getErrorTitle(500),
        "Erro ao carregar documentos da lixeira das organizações",
        "error"
      ),
      documents: [],
    };
  }
}

export function countDocuments(documents: DocumentObj[]): number {
  if (!documents || documents.length === 0) return 0;
  return documents.length;
}
