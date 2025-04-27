import { MessageObj } from "../models/MessageObj";

function getErrorTitle(statusCode: number): string {
    switch (statusCode) {
        case 400:
            return 'Requisição inválida';
        case 401:
            return 'Não autorizado';
        case 404:
            return 'Não encontrado';
        case 500:
            return 'Erro interno do servidor';
        default:
            return 'Erro inesperado';
    }
}

export async function createUser(UserName: string, Password: string, Email: string) {
    const url = `http://localhost:3000/users`;
    const userData = {
        username: UserName,
        password: Password,
        email: Email
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
            return {
                status: 'error',
                message: 'Falha no cadastrar-se',
                error: responseData?.message || `Erro HTTP: ${response.status} ${response.statusText}`,
                statusCode: response.status,
                data: responseData
            };
        }

        return {
            status: 'success',
            message: 'Usuário criado com sucesso',
            statusCode: response.status,
            data: responseData,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Erro ao tentar fazer novo cadastro',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            statusCode: 500,
            stack: error instanceof Error ? error.stack : undefined
        };
    }
}

export async function authLoginUser(UserName: string, Password: string) {
    const url = `http://localhost:3000/auth/login`;
    const userData = {
        username: UserName,
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
            if (responseData.message == 'Username and password are required') {
                return {
                    message: new MessageObj(
                        'error',
                        getErrorTitle(responseData.statusCode),
                        'Usuário e senha devem ser preenchidos!!!',
                        'error')
                }
            }
            if (responseData.message == 'Invalid username') {
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
        return {
            message: new MessageObj(
                'error',
                getErrorTitle(500),
                `Erro: ${error}`,
                'error'
            )
        };
    }
}

