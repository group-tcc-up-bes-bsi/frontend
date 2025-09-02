import { userType } from "../services/ConstantsTypes";

export interface UserOrganization {
    userId: number;
    username: string;
    type: userType;
    organizationId: number;
}
