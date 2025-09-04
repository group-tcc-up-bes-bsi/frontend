import { OrganizationObj } from "./OrganizationObj";

export interface DocumentObj {
  documentId: number;
  name: string;
  type: string;
  description: string;
  creationDate: Date;
  lastModifiedDate: Date;
  version: string;
  creator: string;
  imagemSrc: string;
  organization: OrganizationObj;
  favorite: boolean;
}