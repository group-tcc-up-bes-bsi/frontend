import { UserOrganization } from "@/app/models/UserObj";
import { userType } from "../ConstantsTypes";

export function getUsersOrganization(): UserOrganization[] {
  return [
    {
      userId: 1,
      username: "joao",
      type: userType.OWNER,
      organizationId: 101,
    },
    {
      userId: 2,
      username: "maria",
      type: userType.VIEWER,
      organizationId: 101,
    },
    {
      userId: 3,
      username: "carlos",
      type: userType.READ,
      organizationId: 102,
    },
    {
      userId: 4,
      username: "ana",
      type: userType.VIEWER,
      organizationId: 103,
    },
  ];
}
