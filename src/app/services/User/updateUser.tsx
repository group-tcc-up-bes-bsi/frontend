import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";

export async function updatePasswordUser(userId: number, UserName: string, Password: string, AdminPass: string) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/users/update-password/`;
    const userData = {
        username: UserName,
        password: Password,
        adminPass: AdminPass
    };

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const responseData = await response.json().catch(() => null);
        if (!response.ok) {
            if (responseData.message == `No user found with ID ${userId} to update`) {
                return {
                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Usuário não encontrado',
                        'error')
                }
            }
            if (responseData.message == `No data provided for update userId ${userId}`) {
                return {
                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Senha não fornecida para atualização',
                        'error')
                }
            }
            if (responseData.message == 'No AdminPass provided for update') {
                return {
                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Senha de administrador incorreta',
                        'error')
                }
            }
            if (responseData.message == 'Invalid AdminPass') {
                return {
                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Senha de administrador incorreta',
                        'error')
                }
            }
        }

        return {
            message: new MessageObj(
                'success',
                'Usuário atualizado',
                'Usuário atualizado com sucesso',
                'success'
            )
        };
    } catch {
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