import { MessageObj } from "@/app/models/MessageObj";
import { getErrorTitle } from "../ErrorTitle";
import bcrypt from 'bcryptjs';

export async function createUser(UserName: string, Password: string) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/users`;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Password, salt);

    const userData = {
        username: UserName,
        password: hashedPassword,
    };

    console.log(`usuário criado: ${UserName} senha: ${Password}, hash: ${hashedPassword}`)

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
            if (responseData.message == 'User already exists') {
                return {
                    message: new MessageObj(
                        'error',
                        'Usuário ja cadastrado',
                        'Ja existe um usuário com esse nome',
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
                'Usuário criado',
                'Usuário criado com sucesso',
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