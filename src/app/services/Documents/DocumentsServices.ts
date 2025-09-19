import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { DocumentObj } from "@/app/models/DocumentObj";
import { getErrorTitle } from "../ErrorTitle";
import { getMyOrganizations } from "../Organizations/organizationsServices";
import { getOrganizationDocuments } from "./getOrganizationDocuments";
import { Theme } from "@mui/material";
import { organizationType } from "../ConstantsTypes";

export async function getDocuments(
  userCurrent: UserObj,
  theme: Theme
): Promise<{ message: MessageObj; documents: DocumentObj[] }> {
  try {
    const { message: orgMessage, organizations } = await getMyOrganizations(userCurrent, theme);

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
  } catch (error) {
    console.error(error);
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

export function getDocumentsTrash(): DocumentObj[] {
  return [
    {
      documentId: 1,
      name: "Document.pdf",
      type: "PDF",
      creationDate: new Date("2023-10-15"),
      lastModifiedDate: new Date("2023-10-20"),
      description: "Pdf",
      favorite: true,
      version: "Test",
      creator: "User A",
      organization: {
        organizationId: 1,
        name: "Projeto Inovação",
        description: "Descrição do Projeto Inovação",
        favorite: true,
        organizationType: organizationType.COLLABORATIVE,
        borderColor: undefined,
        icon: undefined,
      },
    },
    {
      documentId: 2,
      name: "Spreadsheet.xlsx",
      type: "Excel",
      creationDate: new Date("2023-09-10"),
      lastModifiedDate: new Date("2023-10-18"),
      description: "Planilha Excel",
      favorite: false,
      version: "2.0",
      creator: "User B",
      organization: {
        organizationId: 1,
        name: "TCC",
        description: "Trabalho de Conclusão de Curso",
        favorite: false,
        organizationType: organizationType.COLLABORATIVE,
        borderColor: undefined,
        icon: undefined,
      },
    },
    {
      documentId: 3,
      name: "Presentation.pptx",
      type: "PowerPoint",
      creationDate: new Date("2023-08-05"),
      lastModifiedDate: new Date("2023-10-15"),
      description: "Apresentação do projeto",
      favorite: false,
      version: "1.5",
      creator: "User C",
      organization: {
        organizationId: 1,
        name: "TCC",
        description: "Trabalho de Conclusão de Curso",
        favorite: false,
        organizationType: organizationType.COLLABORATIVE,
        borderColor: undefined,
        icon: undefined,
      },
    },
  ]
}
