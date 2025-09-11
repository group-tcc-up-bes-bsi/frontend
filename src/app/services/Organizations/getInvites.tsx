import { MessageObj } from "@/app/models/MessageObj";
import { UserObj, UserOrganization } from "@/app/models/UserObj";
import { Theme } from "@mui/material";
import { getMyOrganizations, getOrganizationUsers } from "./organizationsServices";
import { getErrorTitle } from "../ErrorTitle";

export async function getInvites(
    userCurrent: UserObj,
    theme: Theme
): Promise<{ message: MessageObj; users: UserOrganization[]; organizationsInvite: { organizationId: number; name: string }[] }> {
    try {
        const myOrgsResponse = await getMyOrganizations(userCurrent, theme);

        if (myOrgsResponse.organizations.length === 0) {
            return {
                message: new MessageObj(
                    "error",
                    getErrorTitle(404),
                    "Você não possui organizações",
                    "error"
                ),
                users: [],
                organizationsInvite: [],
            };
        }

        const users: UserOrganization[] = [];
        const organizationsInvite: { organizationId: number; name: string }[] = [];

        for (const org of myOrgsResponse.organizations) {
            const orgUsersResponse = await getOrganizationUsers(org.organizationId, userCurrent);

            const myUser = orgUsersResponse.users.find(
                (user) => user.username === userCurrent.username
            );

            // só adiciona se não for OWNER e inviteAccepted === false
            if (myUser && myUser.userType.toString() !== "OWNER" && myUser.inviteAccepted === false) {
                users.push(myUser);

                organizationsInvite.push({
                    organizationId: org.organizationId,
                    name: org.name,
                });
            }
        }

        return {
            message: new MessageObj(
                "success",
                "Organizações carregadas",
                "Lista de organizações que você participa carregada com sucesso",
                "success"
            ),
            users,
            organizationsInvite,
        };
    } catch (error) {
        console.error(error);
        return {
            message: new MessageObj(
                "error",
                getErrorTitle(500),
                "Erro: Servidor inoperante",
                "error"
            ),
            users: [],
            organizationsInvite: [],
        };
    }
}

export async function getInvitesCount(
  userCurrent: UserObj,
  theme: Theme
): Promise<{ count: number }> {
  const result = await getInvites(userCurrent, theme);

  return {
    count: result.users.length, 
  };
}
