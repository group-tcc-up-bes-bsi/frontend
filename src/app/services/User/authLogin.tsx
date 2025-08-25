import { MessageObj } from "../../models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";

export async function authLoginUser(User: string, Password: string) {
    const url = `http://localhost:3000/auth/login`;
    const userData = {
        username: User,
        password: Password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const responseData = await response.json().catch(() => null);
        if (!response.ok) {
            if (responseData.message == 'Invalid user') {
                return {
                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Usuário não encontrado!!!',
                        'error')
                }
            }
            if (responseData.message == 'Invalid password') {
                return {

                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Senha incorreta!!!',
                        'error')
                }
            }
            return {
                message: new MessageObj(
                    'error',
                    getErrorTitle(0),
                    'Erro não catalogado!!!',
                    'error')
            }
        };
        return {
            message: new MessageObj(
                'success',
                'Login realizado',
                'Redirecionando para o dashboard...',
                'success'),
            token: responseData.token,
        };
    } catch (error) {
        console.error(error);
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                `Erro: Servidor Inoperante`,
                'error'
            )
        };
    }
}

