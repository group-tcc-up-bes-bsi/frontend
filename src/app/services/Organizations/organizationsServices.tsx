import { Folder } from "@mui/icons-material";
import { OrganizationObj } from "../../models/OrganizationObj";
import { Theme } from "@mui/material";
import { organizationType } from "../ConstantsTypes";
import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj, UserOrganization } from "@/app/models/UserObj";

export async function getMyOrganizations(userCurrent: UserObj, theme: Theme): Promise<{ message: MessageObj; organizations: OrganizationObj[] }> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations/my`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`,
            },
        });

        const responseData = await response.json().catch(() => null);
        if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
            return {
                message: new MessageObj(
                    'error',
                    getErrorTitle(responseData?.statusCode || 404),
                    'Nenhuma organização encontrada',
                    'error'
                ),
                organizations: []
            };
        }

        const organizations: OrganizationObj[] = responseData.map((item) => ({
            organizationId: item.organizationId,
            name: item.name,
            description: item.description,
            organizationType: item.organizationType.toUpperCase() === 'COLLABORATIVE' ?
                organizationType.COLLABORATIVE
                : organizationType.INDIVIDUAL,
            favorite: false,
            borderColor: theme.palette.text.primary,
            icon: item.organizationType.toUpperCase() === 'COLLABORATIVE'
                ? <Folder sx={{ color: theme.palette.button.star }} />
                : <Folder sx={{ color: theme.palette.button.primary }} />

        }));

        return {
            message: new MessageObj(
                'success',
                'Organizações carregadas',
                'Organizações carregadas com sucesso',
                'success'
            ),
            organizations,
        };

    } catch {
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                'Erro: Servidor inoperante',
                'error'
            ),
            organizations: []
        };
    }
}

export async function getOrganizationUsers(
    orgId: number,
    userCurrent: UserObj
): Promise<{ message: MessageObj; users: UserOrganization[] }> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations/data/${orgId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`,
            },
        });

        const responseData = await response.json().catch(() => null);

        const orgUsers = responseData?.organizationUsers;

        if (!orgUsers || !Array.isArray(orgUsers) || orgUsers.length === 0) {
            return {
                message: new MessageObj(
                    'error',
                    getErrorTitle(responseData?.statusCode || 404),
                    'Nenhum usuário encontrado para a organização',
                    'error'
                ),
                users: []
            };
        }

        const users: UserOrganization[] = orgUsers.map((item) => ({
            userId: 0,
            organizationId: orgId,
            username: item.user,
            userType: (item.userType).toUpperCase(),
            inviteAccepted: item.inviteAccepted,
        }));

        return {
            message: new MessageObj(
                'success',
                'Usuários encontrados',
                'Organização carregada com sucesso',
                'success'
            ),
            users,
        };

    } catch {
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                'Erro: Servidor inoperante',
                'error'
            ),
            users: []
        };
    }
}