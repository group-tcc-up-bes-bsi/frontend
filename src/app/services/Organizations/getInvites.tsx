import { MessageObj } from "@/app/models/MessageObj";
import { UserObj, UserOrganization } from "@/app/models/UserObj";
import { Theme } from "@mui/material";
import { getMyOrganizations, getOrganizationUsers } from "./organizationsServices";
import { getErrorTitle } from "../ErrorTitle";

export async function getInvites(
    userCurrent: UserObj,
    theme: Theme
): Promise<{ message: MessageObj; users: UserOrganization[] }> {
    try {
        const myOrgsResponse = await getMyOrganizations(userCurrent, theme);

        if (myOrgsResponse.organizations.length === 0) {
            return {
                message: new MessageObj(
                    'error',
                    getErrorTitle(404),
                    'Você não possui organizações',
                    'error'
                ),
                users: [],
            };
        }

        const users: UserOrganization[] = [];

        for (const org of myOrgsResponse.organizations) {
            const orgUsersResponse = await getOrganizationUsers(org.organizationId, userCurrent);

            const myUser = orgUsersResponse.users.find(
                (user) => user.username === userCurrent.username
            );

            if (myUser) {
                users.push(myUser);
            }
        }

        return {
            message: new MessageObj(
                'success',
                'Organizações carregadas',
                'Lista de organizações que você participa carregada com sucesso',
                'success'
            ),
            users,
        };

    } catch (error) {
        console.error(error);
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                'Erro: Servidor inoperante',
                'error'
            ),
            users: [],
        };
    }
}
