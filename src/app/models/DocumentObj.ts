import { OrganizationObj } from "./OrganizationObj";

export interface DocumentObj {
  documentId: number;
  name: string;
  type: string;
  description: string;
  creationDate: Date;
  lastModifiedDate: Date;
  organization: OrganizationObj;
  
  version: string;
  creator: string;
  favorite: boolean;
}