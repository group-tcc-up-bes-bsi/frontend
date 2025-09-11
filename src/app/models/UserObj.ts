import { userType } from "../services/ConstantsTypes";

export interface UserObj{
    userId: number;
    username: string;
    jwtToken: string;
}

export interface UserOrganization {
    userId: number;
    organizationId: number;
    username: string;
    userType: userType;
    inviteAccepted: boolean;
}
