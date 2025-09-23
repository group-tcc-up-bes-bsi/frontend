import { DocumentObj } from "./DocumentObj";
import { UserObj } from "./UserObj";

export interface VersionObj {
  documentVersionId: number;
  name: string;
  filePath: string;
  createdAt: Date;
  document: DocumentObj;
  user: UserObj;
}