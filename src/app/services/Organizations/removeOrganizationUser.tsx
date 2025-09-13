import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj, UserOrganization } from "@/app/models/UserObj";

export async function removeOrganizationUser(user: UserOrganization, userCurrent: UserObj) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations/removeUser/${user.organizationId}/${user.userId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`
            },
        });

        await response.json().catch(() => null);
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