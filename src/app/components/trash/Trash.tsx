import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    IconButton,
    TableSortLabel
} from '@mui/material';
import CustomTypography from '../CustomTypography';
import CustomTextField from '../CustomTextField';
import { CachedRounded, Delete } from '@mui/icons-material';
import CustomButton from '../CustomButton';
interface FileItem {
    id: string;
    nome: string;
    tipo: string;
    dataCriacao: Date;
    ultimaAlteracao: Date;
    versao: string;
}

const Trash: React.FC = () => {
    const { theme } = useTheme();
    const [filter, setFilter] = useState('');

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
        },
        {
            id: '4',
            nome: 'Apresentação.pptx',
            tipo: 'PowerPoint',
            dataCriacao: new Date('2023-08-05'),
            ultimaAlteracao: new Date('2023-10-15'),
            versao: '1.5'
        },
        {
            id: '5',
            nome: 'Apresentação.pptx',
            tipo: 'PowerPoint',
            dataCriacao: new Date('2023-08-05'),
            ultimaAlteracao: new Date('2023-10-15'),
            versao: '1.5'
        }, {
            id: '6',
            nome: 'Apresentação.pptx',
            tipo: 'PowerPoint',
            dataCriacao: new Date('2023-08-05'),
            ultimaAlteracao: new Date('2023-10-15'),
            versao: '1.5'
        }, {
            id: '7',
            nome: 'Apresentação.pptx',
            tipo: 'PowerPoint',
            dataCriacao: new Date('2023-08-05'),
            ultimaAlteracao: new Date('2023-10-15'),
            versao: '1.5'
        }, {
            id: '8',
            nome: 'Apresentação.pptx',
            tipo: 'PowerPoint',
            dataCriacao: new Date('2023-08-05'),
            ultimaAlteracao: new Date('2023-10-15'),
            versao: '1.5'
        }, {
            id: '9',
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
        <Box sx={{ maxWidth: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Box sx={{ width: '100%', display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '50%' }}>
                            <CustomTextField
                                name="filter"
                                label="Informe um detalhe do documento"
                                type="text"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                focusedColor="primary"
                                hoverColor="info"
                            />
                        </Box>
                        <CustomButton
                            fullWidth={false}
                            text="Esvaziar Lixeira"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={2}
                            marginTop={0.5}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.background.default, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                        <CustomTypography
                            width={100}
                            text="Documents"
                            component="h2"
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 3,
                                mt: 1,
                                fontWeight: 'bold'
                            }}
                        />
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 1,
                                maxHeight: 'calc(80vh - 150px)',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: theme.palette.background.default,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '3px',
                                },
                            }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="tabela de Documentos">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                            <TableCell>Documento</TableCell>
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
                                                    <IconButton aria-label="more">
                                                        <CachedRounded sx={{ color: theme.palette.text.primary }} />
                                                    </IconButton>
                                                    <IconButton aria-label="delete">
                                                        <Delete color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Trash;