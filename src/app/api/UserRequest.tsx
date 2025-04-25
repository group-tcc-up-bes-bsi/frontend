export async function createUser() {
    const url = `http://localhost:3000/users`;
    const userData = {
        username: "greg",
        password: "securepassword123",
        email: 'greg@example.com'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar usuário: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Usuário criado com sucesso:', result);
    } catch (error) {
        console.error('Erro:', error);
    }
}

export async function authLoginUser() {
    const url = `http://localhost:3000/auth/login`;
    const userData = {
        username: "greg",
        password: "securepassword123"
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
                message: 'Falha no login',
                error: responseData?.message || `Erro HTTP: ${response.status} ${response.statusText}`,
                statusCode: response.status,
                data: responseData
            };
        }

        return {
            status: 'success',
            message: 'Login realizado com sucesso',
            data: responseData,
            statusCode: response.status
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Erro ao tentar fazer login',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            statusCode: 500,
            stack: error instanceof Error ? error.stack : undefined
        };
    }
}

