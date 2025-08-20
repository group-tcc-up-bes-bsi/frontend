import { DocumentObj } from "../models/DocumentObj";

export function getDocuments(): DocumentObj[] {
  return [
    {
      id: "1",
      name: "Document.pdf",
      type: "PDF",
      createdAt: new Date("2023-10-15"),
      updatedAt: new Date("2023-10-20"),
      version: "Test",
      creator: "User A",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "2",
      name: "Spreadsheet.xlsx",
      type: "Excel",
      createdAt: new Date("2023-09-10"),
      updatedAt: new Date("2023-10-18"),
      version: "2.0",
      creator: "User B",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "3",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User C",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "4",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User D",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "5",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User E",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "6",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User F",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "7",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User G",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "8",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User H",
      imagemSrc: "/login/img_fundo_1.png"
    },
    {
      id: "9",
      name: "Presentation.pptx",
      type: "PowerPoint",
      createdAt: new Date("2023-08-05"),
      updatedAt: new Date("2023-10-15"),
      version: "1.5",
      creator: "User I",
      imagemSrc: "/login/img_fundo_1.png"
    },
  ];
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
