import { OrganizationObjSimple } from "./OrganizationObj";

export interface DocumentObj {
  id: number;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  creator: string;
  imagemSrc: string;
}

export interface DocumentFavorite{
  id: number;
  name: string;
  favorite: boolean;
  organization: OrganizationObjSimple;
}