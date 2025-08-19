export function getErrorTitle(statusCode: number): string {
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