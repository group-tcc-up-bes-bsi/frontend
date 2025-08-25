import { organizationsType } from "../services/ConstantsTypes";

export interface OrganizationObj {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  borderColor?: string;
}

export interface OrganizationObjSimple {
  id: number;
  title: string;
}

export interface OrganizationObjWithIcon {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  type: organizationsType;
  borderColor?: string;
  icon?: React.ReactNode;
}

export interface OrganizationFavorite {
  id: number;
  title: string;
  favorite: boolean;
  totDocuments: number;
}
