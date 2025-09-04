import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";
import { getByUserName } from "../User/getByUserName";

export async function createOrganization(Name: string, Description: string, OrganizationType: string, userCurrent: UserObj) {
    const userExists = await getByUserName(userCurrent.username, userCurrent);
    if (userExists.message.severity == 'error'){
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                `Usuário não encontrado`,
                'error'
            )
        };
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations`;
    const organizationData = {
        name: Name,
        description: Description,
        organizationType: OrganizationType.toLowerCase(),
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`
            },
            body: JSON.stringify(organizationData)
        });

        const responseData = await response.json().catch(() => null);

        if (!response.ok) {
            if (responseData.message == 'User already exists') {
                return {
                    message: new MessageObj(
                        'error',
                        'Organização já cadastrada',
                        'Já existe uma Organização com esse nome',
                        'error')
                }
            }
            return {
                message: new MessageObj(
                    'error',
                    getErrorTitle(responseData.statusCode),
                    responseData.message,
                    'error')
            }
        }

        return {
            message: new MessageObj(
                'success',
                'Organização criada',
                'Organização criada com sucesso',
                'success'
            )
        };
    } catch (error) {
        console.error(error)
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                `Erro: Servidor inoperante`,
                'error'
            )
        };
    }
}