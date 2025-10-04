import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import { UserObj } from "@/app/models/UserObj";

export async function getByUserName(userName: string, userCurrent: UserObj) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/users/by-username?username=${userName}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userCurrent?.jwtToken}`,
            },
        });

        const responseData = await response.json().catch(() => null);
        if (!responseData.userId) {
            return {
                message: new MessageObj(
                    'error',
                    getErrorTitle(responseData?.statusCode || 404),
                    'Usuário não encontrado',
                    'error'
                )
            }
        }
        return {
            message: new MessageObj(
                'success',
                'Usuário encontrado',
                'Usuário encontrado com sucesso',
                'success'
            ),
            user: responseData
        };
    } catch {
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                'Erro: Servidor inoperante',
                'error'
            )
        };
    }
}