import { userType } from "../services/ConstantsTypes";

export interface userOrganization {
    userId: number;
    username: string;
    type: userType;
    organizationId: number;
}
