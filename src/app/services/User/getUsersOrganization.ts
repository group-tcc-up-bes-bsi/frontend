import { userOrganization } from "@/app/models/UserObj";
import { userType } from "../ConstantsTypes";

export function getUsersOrganization(): userOrganization[] {
  return [
    {
      id: 1,
      username: "joao",
      type: userType.OWNER,
      organizationId: 101,
    },
    {
      id: 2,
      username: "maria",
      type: userType.VIEWER,
      organizationId: 101,
    },
    {
      id: 3,
      username: "carlos",
      type: userType.READ,
      organizationId: 102,
    },
    {
      id: 4,
      username: "ana",
      type: userType.VIEWER,
      organizationId: 103,
    },
  ];
}
