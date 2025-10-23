import bcrypt from "bcryptjs";
import { MessageObj } from "../../models/MessageObj";
import { STATIC_SALT } from "../ConstantsTypes";
import { getErrorTitle } from "../ErrorTitle";

export async function authLoginUser(User: string, Password: string) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/auth/login`;
    
    const hashedPassword = bcrypt.hashSync(Password, STATIC_SALT);

    const userData = {
        username: User,
        password: hashedPassword
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

        console.log(responseData);
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
                    if (responseData.message == `Invalid username`) {
                        return {
                            
                            message: new MessageObj(
                                'error',
                                getErrorTitle(responseData.statusCode),
                                'Usuário não encontrado',
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
    } catch {
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

