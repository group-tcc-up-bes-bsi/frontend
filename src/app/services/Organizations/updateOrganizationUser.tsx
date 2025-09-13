import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj, UserOrganization } from "@/app/models/UserObj";

export async function updateOrganizationUser(user: UserOrganization, userCurrent: UserObj) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations/updateUser/permission`;
    const organizationUserData = {
        userId: user.userId,
        organizationId: user.organizationId,
        userType: user.userType.toLowerCase(),
    };
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`
            },
            body: JSON.stringify(organizationUserData)
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