import { userType } from "../services/ConstantsTypes";

export interface UserObj{
    userId: number;
    username: string;
    jwtToken: string;
}

export interface UserOrganization {
    userId: number;
    username: string;
    type: userType;
    organizationId: number;
}
