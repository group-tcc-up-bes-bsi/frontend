import { organizationsType } from "../services/ConstantsTypes";

export interface OrganizationObj {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  borderColor?: string;
}

export interface OrganizationObjWithIcon{
  id: string;
  title: string;
  description: string;
  createdBy: string;
  type: organizationsType;
  borderColor?: string;
  icon?: React.ReactNode;
}