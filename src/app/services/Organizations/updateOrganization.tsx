import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function updateOrganization(orgId: number, Name: string, Description: string, OrganizationType: string, userCurrent: UserObj): Promise<{ message: MessageObj }> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations/${orgId}`;
    const organizationData = {
        name: Name,
        description: Description,
        organizationType: OrganizationType.toLowerCase(),
    };
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`
            },
            body: JSON.stringify(organizationData)
        });

        await response.json().catch(() => null);
        return {
        message: new MessageObj(
            'success',
            'Organização atualizada',
            'Organização atualizada com sucesso',
            'success'
        ),
    };
} catch {
    return {
        message: new MessageObj(
            'error',
            getErrorTitle(500),
            `Erro: Servidor inoperante`,
            'error'
        ),
    };
}
}