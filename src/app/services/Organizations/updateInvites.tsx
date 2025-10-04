import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function updateInvites(orgId: number, userCurrent: UserObj, inviteRes: boolean): Promise<{ message: MessageObj }> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/organizations/updateUser/invite`;
    const invite = {
        organizationId: orgId,
        userId: userCurrent.userId,
        inviteAccepted: inviteRes
    };
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`
            },
            body: JSON.stringify(invite)
        });

        await response.json().catch(() => null);
        if (inviteRes) {
            return {
                message: new MessageObj(
                    'success',
                    'Aceito ',
                    'Convite aceito com sucesso',
                    'success'
                ),
            };
        } else {
            return {
                message: new MessageObj(
                    'success',
                    'Recusado ',
                    'Convite recusado com sucesso',
                    'success'
                ),
            };
        }
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