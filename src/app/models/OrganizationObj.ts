import { organizationType } from "../services/ConstantsTypes";

export interface OrganizationObj {
  organizationId: number;
  name: string;
  description: string;
  favorite: boolean;
  organizationType?: organizationType;
  borderColor?: string;
  icon?: React.ReactNode;
}
