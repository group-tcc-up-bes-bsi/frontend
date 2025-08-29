import { userType } from "../services/ConstantsTypes";

export interface userOrganization {
    id: number;
    username: string;
    type: userType;
    organizationId: number;
}
