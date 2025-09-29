import { MessageObj } from "@/app/models/MessageObj";
import { UserObj } from "@/app/models/UserObj";
import { Theme } from "@mui/material";
import { getMyOrganizations, getOrganizationUsers } from "./organizationsServices";
import { getErrorTitle } from "../ErrorTitle";
import { OrganizationObj } from "@/app/models/OrganizationObj";
import { organizationType } from "../ConstantsTypes";
import { Folder } from "@mui/icons-material";

export async function getOrganizations(
    userCurrent: UserObj,
    theme: Theme
): Promise<{ message: MessageObj; organizations: OrganizationObj[] }> {
    try {
        const myOrgsResponse = await getMyOrganizations(userCurrent, theme);
        const favoritesUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/favorites/organizations`;
        const favoritesResponse = await fetch(favoritesUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userCurrent?.jwtToken}`,
            },
        });
        const favoritesData = await favoritesResponse.json().catch(() => []);
        const favoriteOrgIds = new Set<number>(
            Array.isArray(favoritesData)
                ? favoritesData.map((fav: OrganizationObj) => fav.organizationId)
                : []
        );

        if (myOrgsResponse.organizations.length === 0) {
            return {
                message: new MessageObj(
                    "error",
                    getErrorTitle(404),
                    "Você não participa de organizações",
                    "error"
                ),
                organizations: [],
            };
        }

        const organizations: OrganizationObj[] = [];

        for (const org of myOrgsResponse.organizations) {
            const orgUsersResponse = await getOrganizationUsers(org.organizationId, userCurrent);

            const myUser = orgUsersResponse.users.find(
                (user) => user.username === userCurrent.username
            );

            if (myUser?.inviteAccepted !== false && org.organizationType != undefined) {
                organizations.push({
                    organizationId: org.organizationId,
                    name: org.name,
                    description: org.description,
                    organizationType: org.organizationType === 'Colaborativo' ?
                        organizationType.COLLABORATIVE
                        : organizationType.INDIVIDUAL,
                    favorite: favoriteOrgIds.has(org.organizationId),
                    borderColor: theme.palette.text.primary,
                    icon: org.organizationType === 'Colaborativo'
                        ? <Folder sx={{ color: theme.palette.button.star }} />
                        : <Folder sx={{ color: theme.palette.button.primary }} />
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
            organizations,
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
            organizations: [],
        };
    }
}

export function countOrganizations(
    organizations: OrganizationObj[]
): number {
    if (!organizations || organizations.length === 0) return 0;
    return organizations.length;
}
