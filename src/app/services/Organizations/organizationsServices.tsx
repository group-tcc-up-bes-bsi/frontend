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
            organizationType: item.organizationType.toUpperCase() === 'COLLABORATIVE' ? organizationType.COLLABORATIVE : organizationType.INDIVIDUAL,
            favorite: false, //Ajustar quando implementar favoritos
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />

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

    } catch (error) {
        console.error(error);
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

        if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
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

        const users: UserOrganization[] = responseData.map((item) => ({
            username: item.user,
            type: item.userType,
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

    } catch (error) {
        console.error(error);
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
