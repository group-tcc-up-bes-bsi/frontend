import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Box,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { Delete, MoreVert } from '@mui/icons-material';
import { useTheme } from '@/app/theme/ThemeContext';
import { FileItem } from '../models/FileItem';

import React, { useState } from 'react';
import { useDocumentStateStore } from '../state/DocumentState';
import { useOptionsDashboardStore } from '../state/optionsDashboard';

const TableDocuments = () => {
    const { theme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const alterFile = useDocumentStateStore((state) => state.alter);
    const alterOption = useOptionsDashboardStore((state) => state.alter);

    const files: FileItem[] = [
        {
            id: '1',
            name: 'Document.pdf',
            type: 'PDF',
            createdAt: new Date('2023-10-15'),
            updatedAt: new Date('2023-10-20'),
            version: 'Test',
            creator: 'User A'
        },
        {
            id: '2',
            name: 'Spreadsheet.xlsx',
            type: 'Excel',
            createdAt: new Date('2023-09-10'),
            updatedAt: new Date('2023-10-18'),
            version: '2.0',
            creator: 'User B'
        },
        {
            id: '3',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User C'
        },
        {
            id: '4',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User D'
        },
        {
            id: '5',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User E'
        },
        {
            id: '6',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User F'
        },
        {
            id: '7',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User G'
        },
        {
            id: '8',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User H'
        },
        {
            id: '9',
            name: 'Presentation.pptx',
            type: 'PowerPoint',
            createdAt: new Date('2023-08-05'),
            updatedAt: new Date('2023-10-15'),
            version: '1.5',
            creator: 'User I'
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
                            <TableCell sx={{ background: theme.palette.background.default }}>{file.name}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>{file.type}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(file.createdAt)}</TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(file.updatedAt)}</TableCell>
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
                                    {file.version}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ background: theme.palette.background.default }}>
                                <IconButton aria-label="delete">
                                    <Delete color="error" />
                                </IconButton>
                                <IconButton
                                    aria-label="more"
                                    onClick={(event) => {
                                        setAnchorEl(event.currentTarget);
                                        setSelectedFile(file);
                                    }}
                                >
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedFile?.id === file.id}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuItem onClick={() => { setAnchorEl(null); }}>Alterar</MenuItem>
                                    <MenuItem onClick={() => { setAnchorEl(null); }}>Versões</MenuItem>
                                    <MenuItem onClick={() => { alterOption('Stats'); if (selectedFile) alterFile(selectedFile); setAnchorEl(null); }}>Estatísticas</MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableDocuments;