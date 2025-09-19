import { DocumentObj } from "./DocumentObj";
import { UserObj } from "./UserObj";

export interface VersionObj {
  documentVersionId: number;
  versionName: string;
  versionFilePath: string;
  createdAt: Date;
  document: DocumentObj;
  user: UserObj;
}