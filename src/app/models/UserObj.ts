import { userType } from "../services/ConstantsTypes";

export interface UserObj{
    userId: number;
    username: string;
    jwtToken: string;
}

export interface UserOrganization {
    username: string;
    type: userType;
    inviteAccepted: boolean;
}
