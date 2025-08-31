import { organizationType } from "../services/ConstantsTypes";

export interface OrganizationObj {
  organizationId: number;
  organizationName: string;
  organizationDescription: string;
  favorite: boolean;
  organizationType: organizationType;
  borderColor?: string;
  icon?: React.ReactNode;
}
