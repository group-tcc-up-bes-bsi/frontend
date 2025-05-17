import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Box,
    IconButton
} from '@mui/material';
import { Delete, MoreVert } from '@mui/icons-material';
import { useTheme } from '@/app/theme/ThemeContext';
interface FileItem {
    id: string;
    nome: string;
    tipo: string;
    dataCriacao: Date;
    ultimaAlteracao: Date;
    versao: string;
}

const TableDocuments = () => {
    const { theme } = useTheme();
    const files: FileItem[] = [
        {
            id: '1',
            nome: 'Documento.pdf',
            tipo: 'PDF',
            dataCriacao: new Date('2023-10-15'),
            ultimaAlteracao: new Date('2023-10-20'),
            versao: 'Teste'
        },
        {
            id: '2',
            nome: 'Planilha.xlsx',
            tipo: 'Excel',
            dataCriacao: new Date('2023-09-10'),
            ultimaAlteracao: new Date('2023-10-18'),
            versao: '2.0'
        },
        {
            id: '3',
            nome: 'Apresentação.pptx',
            tipo: 'PowerPoint',
            dataCriacao: new Date('2023-08-05'),
            ultimaAlteracao: new Date('2023-10-15'),
            versao: '1.5'
        }
    ];

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <TableContainer sx={{ mt: 0 }}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de arquivos">
                <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                        <TableCell>Arquivo</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>
                            <TableSortLabel>Data de Criação</TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel>Última Alteração</TableSortLabel>
                        </TableCell>
                        <TableCell>Versão</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell sx={{ background: theme.palette.background.default }}>{file.nome}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>{file.tipo}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(file.dataCriacao)}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(file.ultimaAlteracao)}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        color: theme.palette.text.primary,
                                        px: 1,
                                        borderRadius: 1,
                                        display: 'inline-block'
                                    }}
                                >
                                    {file.versao}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>
                                <IconButton aria-label="delete">
                                    <Delete color="error" />
                                </IconButton>
                                <IconButton aria-label="more">
                                    <MoreVert />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableDocuments;