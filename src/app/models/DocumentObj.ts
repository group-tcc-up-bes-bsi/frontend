import { OrganizationObj } from "./OrganizationObj";

export interface DocumentObj {
  documentId: number;
  documentName: string;
  documentType: string;
  documentDescription: string;
  documentCreationDate: Date;
  documentLastModifiedDate: Date;
  version: string;
  creator: string;
  imagemSrc: string;
  organization: OrganizationObj;
  favorite: boolean;
}